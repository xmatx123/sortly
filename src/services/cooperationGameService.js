import { realtimeDb } from '../firebase';
import { ref, set, update, onValue, off, get } from 'firebase/database';
import { fetchCountries } from '../api/countriesApi'; // Import fetchCountries here

const GAME_STATES_PATH = 'gameStates';

// Helper to get random elements without mutation
const getRandomElements = (arr, num) => {
  if (num > arr.length) {
    console.warn("Requested more elements than available");
    num = arr.length;
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

export const cooperationGameService = {
  // Initialize a new game state for cooperation mode
  async initializeGameState(lobbyId, players, category = 'population') {
    // Fetch all countries within the service
    let allCountries;
    try {
      allCountries = await fetchCountries();
      // Sort countries by the selected category initially
      // This ensures the initial card and inventory make sense for the category
      allCountries.sort((a, b) => (a[category] ?? 0) - (b[category] ?? 0)); 

      if (!allCountries || allCountries.length < 11) { // Need at least 11
        throw new Error(`Not enough valid countries fetched to start cooperation mode for category ${category}.`);
      }
    } catch (fetchError) {
      console.error("Failed to fetch countries for initialization:", fetchError);
      throw new Error(`Could not fetch country data for category ${category} to start the game.`);
    }

    // Select 11 countries (1 initial + 10 inventory) - Now uses the sorted list
    const selectedCountries = getRandomElements(allCountries, 11); // Select randomly from category-sorted list
    const initialCountry = selectedCountries[0];
    const inventoryCountries = selectedCountries.slice(1).sort((a, b) => 0.5 - Math.random()); // Shuffle inventory

    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    const initialState = {
      lobbyId: lobbyId, // Store lobbyId for reference
      category: category, // Store the category
      currentPlayer: players[0].id, // First player starts
      players: players,
      mode: 'choosing', // Start in choosing mode
      sortedCountries: [initialCountry], // Start with one country sorted
      remainingCountries: inventoryCountries, // The 10 countries in inventory
      currentCountry: null, // No country chosen to place yet
      score: 1, // Started with 1 country sorted
      status: 'playing',
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    await set(gameStateRef, initialState);
    console.log(`Initialized ${category} cooperation game state for lobby`, lobbyId);
    // No need to return initialState, changes propagate via subscription
  },

  // Subscribe to game state changes
  subscribeToGameState(lobbyId, callback) {
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    const listener = onValue(gameStateRef, (snapshot) => {
      const data = snapshot.val();
      callback(data); // Pass data (or null if deleted) to callback
    }, (error) => {
      console.error("Error subscribing to game state:", error);
      callback(null); // Notify callback of error/disconnection
    });

    // Return unsubscribe function
    return () => off(gameStateRef, 'value', listener);
  },

  // Update game state (internal helper - might not be needed externally anymore)
  async updateGameState(lobbyId, updates) {
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    await update(gameStateRef, {
      ...updates,
      lastUpdated: Date.now()
    });
  },

  // Player chooses a card from the inventory
  async chooseCard(lobbyId, playerId, chosenCountry) {
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    const snapshot = await get(gameStateRef);
    const gameState = snapshot.val();

    if (!gameState || gameState.status !== 'playing') {
      throw new Error('Game is not active or not found');
    }
    if (gameState.mode !== 'choosing') {
      throw new Error('Not in choosing mode');
    }
    if (gameState.currentPlayer !== playerId) {
      throw new Error('Not your turn to choose');
    }
    // Verify the chosen country ID exists in the remaining list
    if (!gameState.remainingCountries || !gameState.remainingCountries.some(c => c.id === chosenCountry.id)) {
       console.error("Chosen country ID not found in remaining:", chosenCountry?.id, gameState.remainingCountries);
       throw new Error('Chosen country is not valid or not in the remaining inventory');
    }

    await update(gameStateRef, {
      currentCountry: chosenCountry, // Set the chosen country as the one to be placed
      mode: 'placing', // Switch mode to placing
      lastUpdated: Date.now()
    });
  },

  // Player places the chosen card into the sorted list
  async placeCard(lobbyId, playerId, placementIndex) {
    // placementIndex is the index where the player wants to insert the currentCountry
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    const snapshot = await get(gameStateRef);
    const gameState = snapshot.val();

    if (!gameState || gameState.status !== 'playing') {
      throw new Error('Game is not active or not found');
    }
    if (gameState.mode !== 'placing') {
      throw new Error('Not in placing mode');
    }
    if (gameState.currentPlayer !== playerId) {
      throw new Error('Not your turn to place');
    }
    if (!gameState.currentCountry) {
        throw new Error('No country currently chosen for placement');
    }
    if (typeof placementIndex !== 'number' || placementIndex < 0 || placementIndex > gameState.sortedCountries.length) {
      console.error("Invalid placement index received:", placementIndex, "Current sorted length:", gameState.sortedCountries.length);
      throw new Error('Invalid placement index');
    }
    // Get the category from the game state
    const category = gameState.category || 'population'; // Default to population if somehow missing

    // Construct the potential new sorted list based on the placement index
    const potentialNewSortedCountries = [...gameState.sortedCountries];
    potentialNewSortedCountries.splice(placementIndex, 0, gameState.currentCountry);

    // Server-side validation of the placement (using category from gameState)
    const isCorrect = (countriesList) => {
      // Check if countriesList is valid before accessing length
      if (!Array.isArray(countriesList)) {
        console.error("isCorrect received non-array:", countriesList);
        return false; // Or handle as appropriate
      }
      for (let i = 0; i < countriesList.length - 1; i++) {
        // Add checks for country objects and the compare property (using category)
        if (!countriesList[i] || !countriesList[i+1] ||
            typeof countriesList[i][category] === 'undefined' || // Use category
            typeof countriesList[i+1][category] === 'undefined' || // Use category
            countriesList[i][category] > countriesList[i + 1][category]) { // Use category
          console.warn(`Incorrect order found at index ${i} for category ${category}:`, countriesList[i][category], countriesList[i+1][category]);
          return false;
        }
      }
      return true;
    };

    if (isCorrect(potentialNewSortedCountries)) {
      // Correct Placement

      // --- Start: Added logic to remove placed card from remaining --- 
      // Ensure we have the country that was just placed and the remaining list
      const placedCountryId = gameState.currentCountry.id;
      let updatedRemainingCountries = gameState.remainingCountries || [];

      // Filter out the placed country from the remaining list
      updatedRemainingCountries = updatedRemainingCountries.filter(country => country.id !== placedCountryId);
      // --- End: Added logic --- 

      // Determine the next player correctly, ensuring players array exists
      let nextPlayerId = gameState.players[0]?.id; // Default to first player if only one or issues
      if (gameState.players.length > 1) {
          const currentPlayerIndex = gameState.players.findIndex(p => p.id === playerId);
          nextPlayerId = gameState.players[(currentPlayerIndex + 1) % gameState.players.length].id;
      }

      const updates = {
        currentPlayer: nextPlayerId,
        sortedCountries: potentialNewSortedCountries, // Update the sorted list
        remainingCountries: updatedRemainingCountries, // Update the remaining list
        currentCountry: null, // Clear the placed country
        mode: 'choosing', // Go back to choosing mode
        score: gameState.score + 1,
        lastUpdated: Date.now()
      };

      // Check for win condition (newly updated inventory empty AND placed correctly)
      if (updatedRemainingCountries.length === 0) {
        updates.status = 'completed';
        updates.result = 'win';
        updates.mode = 'finished'; // Or some final mode
      }

      await update(gameStateRef, updates);

    } else {
      // Incorrect Placement - End Game
      console.log(`Incorrect placement by ${playerId}. Ending game.`);
      await this.endGame(lobbyId); // Call endGame directly
    }
  },

  // End game (can be called on incorrect placement or explicitly)
  async endGame(lobbyId) { // No longer needs playerId here if called internally
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    // Check if game exists before updating
    const snapshot = await get(gameStateRef);
    if (snapshot.exists() && snapshot.val().status === 'playing') {
      await update(gameStateRef, {
        status: 'completed',
        result: 'lose',
        mode: 'finished',
        currentCountry: null, // Ensure no country is stuck in current
        lastUpdated: Date.now()
      });
      console.log("Game ended with lose state for lobby:", lobbyId);
    } else {
       console.log("Game already completed or does not exist, skipping endGame call for lobby:", lobbyId);
    }
  },

  // Clean up game state
  async cleanupGameState(lobbyId) {
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    await set(gameStateRef, null);
  }
}; 