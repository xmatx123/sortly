import { realtimeDb } from '../firebase';
import { ref, set, update, onValue, off, get } from 'firebase/database';
import { fetchCountries } from '../api/countriesApi'; 

// Use a separate path for Battle Royale game states
const GAME_STATES_PATH = 'battleRoyaleGameStates'; 

// Helper to get random elements without mutation
const getRandomElements = (arr, num) => {
  if (num > arr.length) {
    console.warn("Requested more elements than available");
    num = arr.length;
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

export const battleRoyaleGameService = {
  // Initialize a new game state for battle royale mode
  async initializeGameState(lobbyId, players, category = 'population') {
    // Validate player count (2-8)
    if (players.length < 2 || players.length > 8) {
      throw new Error('Battle Royale mode requires between 2 and 8 players.');
    }
      
    // Fetch all countries within the service
    let allCountries;
    const requiredCountries = 26; // 1 initial + 25 inventory
    try {
      allCountries = await fetchCountries();
      // Sort countries by the selected category initially
      allCountries.sort((a, b) => (a[category] ?? 0) - (b[category] ?? 0));

      if (!allCountries || allCountries.length < requiredCountries) {
        throw new Error(`Not enough valid countries fetched to start Battle Royale mode for category ${category}. Need ${requiredCountries}.`);
      }
    } catch (fetchError) {
      console.error("Failed to fetch countries for initialization:", fetchError);
      throw new Error(`Could not fetch country data for category ${category} to start the game.`);
    }

    // Select 26 countries (1 initial + 25 inventory) - From category-sorted list
    const selectedCountries = getRandomElements(allCountries, requiredCountries); 
    const initialCountry = selectedCountries[0];
    const inventoryCountries = selectedCountries.slice(1).sort((a, b) => 0.5 - Math.random()); // Shuffle inventory

    // Initialize players with active status
    const initialPlayers = players.map(p => ({ ...p, isActive: true, score: 0 })); // Add isActive flag and individual score

    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    const initialState = {
      lobbyId: lobbyId, 
      category: category, // Store the category
      gameType: 'battleRoyale', // Identify the game type
      currentPlayer: initialPlayers[0].id, // First active player starts
      players: initialPlayers, 
      activePlayers: initialPlayers.map(p => p.id), // Keep track of active player IDs
      mode: 'choosing', // Start in choosing mode
      sortedCountries: [initialCountry], // Start with one country sorted
      remainingCountries: inventoryCountries, // The 25 countries in inventory
      currentCountry: null, // No country chosen to place yet
      // score: 1, // Score is per-player
      status: 'playing',
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    await set(gameStateRef, initialState);
    console.log(`Initialized ${category} Battle Royale game state for lobby`, lobbyId, `at path ${GAME_STATES_PATH}/${lobbyId}`);
  },

  // Subscribe to game state changes (Likely reusable)
  subscribeToGameState(lobbyId, callback) {
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    const listener = onValue(gameStateRef, (snapshot) => {
      const data = snapshot.val();
      callback(data); 
    }, (error) => {
      console.error("Error subscribing to game state:", error);
      callback(null); 
    });
    return () => off(gameStateRef, 'value', listener);
  },

  // Update game state (Likely reusable)
  async updateGameState(lobbyId, updates) {
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    await update(gameStateRef, {
      ...updates,
      lastUpdated: Date.now()
    });
  },

  // Player chooses a card from the inventory (Likely reusable, maybe add active check)
  async chooseCard(lobbyId, playerId, chosenCountry) {
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    const snapshot = await get(gameStateRef);
    const gameState = snapshot.val();

    if (!gameState || gameState.status !== 'playing') throw new Error('Game is not active or not found');
    if (gameState.mode !== 'choosing') throw new Error('Not in choosing mode');
    if (gameState.currentPlayer !== playerId) throw new Error('Not your turn to choose');
    
    // Ensure the player is active
    const choosingPlayer = gameState.players.find(p => p.id === playerId);
    if (!choosingPlayer || !choosingPlayer.isActive) {
        throw new Error('You have been eliminated from the game.');
    }
    
    if (!gameState.remainingCountries || !gameState.remainingCountries.some(c => c.id === chosenCountry.id)) {
       console.error("Chosen country ID not found in remaining:", chosenCountry?.id, gameState.remainingCountries);
       throw new Error('Chosen country is not valid or not in the remaining inventory');
    }

    await update(gameStateRef, {
      currentCountry: chosenCountry, 
      mode: 'placing', 
      lastUpdated: Date.now()
    });
  },
  
  // Helper to find the next active player
  _findNextActivePlayer(players, currentPlayerId) {
      const activePlayers = players.filter(p => p.isActive);
      if (activePlayers.length === 0) return null; // Should not happen if checked before calling

      const currentPlayerIndex = activePlayers.findIndex(p => p.id === currentPlayerId);
      // If current player not found among active (e.g., just eliminated), or it's the last active player
      if (currentPlayerIndex === -1 || currentPlayerIndex === activePlayers.length - 1) {
          return activePlayers[0].id; // Wrap around to the first active player
      } else {
          return activePlayers[currentPlayerIndex + 1].id; // Next active player
      }
  },

  // Player places the chosen card into the sorted list
  async placeCard(lobbyId, playerId, placementIndex) {
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    const snapshot = await get(gameStateRef);
    let gameState = snapshot.val(); // Use 'let' as we might modify it locally before updating DB

    if (!gameState || gameState.status !== 'playing') throw new Error('Game is not active or not found');
    if (gameState.mode !== 'placing') throw new Error('Not in placing mode');
    if (gameState.currentPlayer !== playerId) throw new Error('Not your turn to place');
    if (!gameState.currentCountry) throw new Error('No country currently chosen for placement');
    
    // Ensure the player is active
    const placingPlayer = gameState.players.find(p => p.id === playerId);
    if (!placingPlayer || !placingPlayer.isActive) {
        throw new Error('You have been eliminated from the game.');
    }

    if (typeof placementIndex !== 'number' || placementIndex < 0 || placementIndex > gameState.sortedCountries.length) {
      console.error("Invalid placement index received:", placementIndex, "Current sorted length:", gameState.sortedCountries.length);
      throw new Error('Invalid placement index');
    }
    // Get the category from the game state
    const category = gameState.category || 'population'; // Default to population if somehow missing

    const potentialNewSortedCountries = [...gameState.sortedCountries];
    potentialNewSortedCountries.splice(placementIndex, 0, gameState.currentCountry);

    const isCorrect = (countriesList) => {
      if (!Array.isArray(countriesList)) return false;
      for (let i = 0; i < countriesList.length - 1; i++) {
        if (!countriesList[i] || !countriesList[i+1] ||
            typeof countriesList[i][category] === 'undefined' ||
            typeof countriesList[i+1][category] === 'undefined' ||
            countriesList[i][category] > countriesList[i + 1][category]) {
          console.warn(`Incorrect order found at index ${i} for category ${category}:`, countriesList[i][category], countriesList[i+1][category]);
          return false;
        }
      }
      return true;
    };
    
    let updates = {};
    const players = gameState.players; // Get current player list
    const placedCountryId = gameState.currentCountry.id;

    if (isCorrect(potentialNewSortedCountries)) {
      // Correct Placement
      console.log(`Correct placement by ${playerId}.`);
      
      // Remove placed card from remaining
      const updatedRemainingCountries = (gameState.remainingCountries || []).filter(country => country.id !== placedCountryId);

      // Update score for the player who placed correctly
      const playerIndex = players.findIndex(p => p.id === playerId);
      if(playerIndex !== -1) {
          players[playerIndex].score = (players[playerIndex].score || 0) + 1;
      }

      // Find the next active player
      const nextPlayerId = this._findNextActivePlayer(players, playerId);
      
      updates = {
        players: players, // Updated scores
        currentPlayer: nextPlayerId,
        sortedCountries: potentialNewSortedCountries,
        remainingCountries: updatedRemainingCountries,
        currentCountry: null,
        mode: 'choosing',
        lastUpdated: Date.now()
      };

      // Check if inventory is empty (Alternative win condition? Or just continue eliminating?)
      // For Battle Royale, the game continues until one player is left, regardless of inventory.
      // So, we don't end the game here based on empty inventory.

    } else {
      // Incorrect Placement - Eliminate Player
      console.log(`Incorrect placement by ${playerId}. Eliminating player.`);
      
      const playerIndex = players.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
          players[playerIndex].isActive = false;
      }
      
      const activePlayers = players.filter(p => p.isActive);
      const activePlayerIds = activePlayers.map(p => p.id);

      if (activePlayers.length <= 1) {
        // Game Over - Last player standing wins (or draw if 0 left somehow)
        console.log("Battle Royale finished. Winner determined.");
        updates = {
          players: players, // Show final status
          activePlayers: activePlayerIds,
          status: 'completed',
          mode: 'finished',
          result: activePlayers.length === 1 ? activePlayers[0].id : 'draw', // Store winner ID or 'draw'
          winner: activePlayers.length === 1 ? activePlayers[0] : null, // Store full winner object
          currentCountry: null, // Clear any chosen country
          lastUpdated: Date.now()
        };
      } else {
        // Game Continues - Find next active player
        const nextPlayerId = this._findNextActivePlayer(players, playerId); // Find next player *after* elimination
        
        // Incorrectly placed card is discarded, player doesn't get another turn immediately.
        // Remove the incorrectly placed card from the remaining inventory.
        const updatedRemainingCountries = (gameState.remainingCountries || []).filter(country => country.id !== placedCountryId);

        updates = {
          players: players, // Updated player statuses
          activePlayers: activePlayerIds,
          currentPlayer: nextPlayerId,
          currentCountry: null, // Clear the incorrectly placed country
          remainingCountries: updatedRemainingCountries, // Remove the card
          mode: 'choosing', // Next player starts by choosing
          lastUpdated: Date.now()
        };
      }
    }

    await update(gameStateRef, updates);
  },

  // End game (Handles win condition based on elimination)
  // This might not be explicitly called anymore, as placeCard handles the logic.
  // Kept for potential manual ending or cleanup.
  async endGame(lobbyId, winnerId = null) { 
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    const snapshot = await get(gameStateRef);
    if (snapshot.exists()) {
       const gameState = snapshot.val();
       if (gameState.status === 'playing') {
           const winner = gameState.players.find(p => p.id === winnerId);
           await update(gameStateRef, {
               status: 'completed',
               result: winnerId || 'ended', // Store winner ID or generic 'ended'
               winner: winner || null,
               mode: 'finished',
               currentCountry: null, 
               lastUpdated: Date.now()
           });
           console.log(`Battle Royale game ended. Winner: ${winnerId || 'N/A'}`);
       } else {
           console.log("Game already completed, skipping endGame call.");
       }
    } else {
       console.log("Game state not found, cannot end game for lobby:", lobbyId);
    }
  },

  // Clean up game state (Likely reusable)
  async cleanupGameState(lobbyId) {
    const gameStateRef = ref(realtimeDb, `${GAME_STATES_PATH}/${lobbyId}`);
    await set(gameStateRef, null);
    console.log("Cleaned up Battle Royale game state for lobby:", lobbyId);
  }
}; 