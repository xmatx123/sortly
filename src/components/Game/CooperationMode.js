import React, { useState, useEffect } from 'react';
import CountryCard from '../CountryCard'; // Adjusted path
import '../../pages/GamePage.css'; // Adjusted path
import { useNavigate } from 'react-router-dom'; // Removed useLocation
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { cooperationGameService } from '../../services/cooperationGameService'; // Adjusted path

// Helper function to capitalize
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

// Renamed component, accepts lobbyId and category as props
function CooperationMode({ lobbyId, category: categoryProp = 'population' }) { 
  const { currentUser } = useAuth();
  const [sortedCountries, setSortedCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, ended
  const [gameStateData, setGameStateData] = useState(null); // Store full game state
  const navigate = useNavigate();
  // Removed location logic
  
  // Determine category primarily from gameStateData once loaded, fallback to prop
  const category = gameStateData?.category || categoryProp;

  useEffect(() => {
    // Validate lobbyId passed as prop
    if (!lobbyId) { 
      console.error("CooperationMode requires a lobbyId prop.");
      // Optionally navigate away or show error
      navigate('/'); 
      return;
    }

    // Subscribe to the game state from Firebase
    const unsubscribe = cooperationGameService.subscribeToGameState(lobbyId, (data) => {
      if (data) {
        setGameStateData(data);
        setScore(data.score !== undefined ? data.score : 0);
        setSortedCountries(data.sortedCountries || []);
        setCurrentCountry(data.currentCountry || null); // The country to be placed
        setRemainingCountries(data.remainingCountries || []);
        setGameState(data.status || 'waiting'); // Use status from DB
        const currentCategory = data.category || 'population'; // Get category from data

        // Handle game completion based on status from DB
        if (data.status === 'completed') {
           let message = 'Game Over!';
           let finalScore = data.score || 0; // Use score from data
           const messageCategory = currentCategory === 'gini' ? 'Gini index' : capitalize(currentCategory);

           if (data.result === 'win') {
             message = `Congratulations! You sorted all countries correctly by ${messageCategory}.`;
           } else if (data.result === 'lose') {
             message = `Game Over! An incorrect move was made while sorting by ${messageCategory}.`;
           }
           
           navigate('/gameover', {
              state: { 
                score: finalScore, 
                message: message,
                category: currentCategory, 
                gameMode: `cooperation_${currentCategory}` 
              }, 
              replace: true
            });
        }

      } else {
        console.error("Game state not found for lobby:", lobbyId);
        navigate('/'); // Navigate away if game state disappears
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();

  }, [lobbyId, navigate, currentUser]); // Dependency is now lobbyId

  // Handler for when a player chooses a card from the inventory
  const handleChooseCard = async (country) => {
    if (!gameStateData || !currentUser) return;
    if (gameStateData.currentPlayer !== currentUser.uid) return; // Not their turn
    if (gameStateData.mode !== 'choosing') return; // Wrong mode

    try {
      await cooperationGameService.chooseCard(gameStateData.lobbyId, currentUser.uid, country);
    } catch (error) {
      console.error("Error choosing card:", error);
    }
  };

  // Handler for placing a card in the sorted list
  const handlePlaceCard = async (index) => {
    if (!gameStateData || !currentUser || !currentCountry) return;
    if (gameStateData.currentPlayer !== currentUser.uid) return; // Not their turn
    if (gameStateData.mode !== 'placing') return; // Wrong mode

    try {
      await cooperationGameService.placeCard(gameStateData.lobbyId, currentUser.uid, index);
    } catch (error) {
      console.error("Error placing card:", error);
    }
  };

  // Loading state based on gameStateData instead of separate isLoading flag
  if (!gameStateData || gameState === 'waiting') {
    return <div className="game-mode-loading">Loading Cooperation Game...</div>;
  }

  const isMyTurn = gameStateData.currentPlayer === currentUser?.uid;
  const currentPlayerName = gameStateData.players?.find(p => p.id === gameStateData.currentPlayer)?.name || 'Unknown';
  const canPlace = gameStateData.mode === 'placing' && isMyTurn && currentCountry;

  return (
    <div className="game-mode cooperation-mode"> {/* Add specific class */}
      <h2>Cooperation Mode - Sort by {category === 'gini' ? 'Gini Index' : capitalize(category)}</h2>
      <p>Current Turn: {currentPlayerName}</p>
      <p>Score: {score}</p>

      {/* Display sorted countries */}
      <div className="sorted-countries-container">
        <h3>Sorted Countries:</h3>
        <div className="sorted-countries">
          {canPlace && (
            <button
              className="place-button plus-button"
              onClick={() => handlePlaceCard(0)}
              aria-label="Place card at the beginning"
            >
              +
            </button>
          )}
          {sortedCountries.map((country, index) => (
            <React.Fragment key={`sorted-fragment-${country.id}`}>
              <CountryCard
                country={country}
                mode={category}
                statisticValue={country[category]}
                isFlippable={true}
                isClickable={false}
              />
              {canPlace && (
                <button
                  className="place-button plus-button"
                  onClick={() => handlePlaceCard(index + 1)}
                  aria-label={`Place card after ${country.name}`}
                >
                  +
                </button>
              )}
            </React.Fragment>
          ))}
          {sortedCountries.length === 0 && canPlace && (
             <button
                className="place-button plus-button"
                onClick={() => handlePlaceCard(0)}
                aria-label="Place first card"
             >
               +
             </button>
          )}
        </div>
      </div>

      {/* Display remaining countries */}
      <div className="remaining-countries">
        <h3>Remaining Countries to Sort: ({remainingCountries.length})</h3>
        <div className="remaining-countries-grid">
          {remainingCountries.map((country) => {
            const isSelectedForPlacing = gameStateData.mode === 'placing' && currentCountry && country.id === currentCountry.id;
            return (
              <CountryCard
                key={`remaining-${country.id}`}
                country={country}
                mode={category}
                statisticValue={country[category]}
                isFlippable={false}
                isClickable={gameStateData.mode === 'choosing' && isMyTurn}
                onClick={() => gameStateData.mode === 'choosing' && isMyTurn && handleChooseCard(country)}
                customClassName={isSelectedForPlacing ? 'selected-for-placing' : ''}
              />
            );
          })}
        </div>
      </div>

      {/* Game instructions */}
      <div className="game-instructions">
        {gameStateData.mode === 'choosing' && (
          isMyTurn ? (
            <p>Choose a country from the remaining countries to place next.</p>
          ) : (
            <p>Waiting for {currentPlayerName} to choose a country...</p>
          )
        )}
        {gameStateData.mode === 'placing' && (
          isMyTurn ? (
            <p>Place {currentCountry?.name} in the correct position based on {category === 'gini' ? 'Gini index' : category}.</p>
          ) : (
            <p>Waiting for {currentPlayerName} to place {currentCountry?.name}...</p>
          )
        )}
      </div>
    </div>
  );
}

export default CooperationMode; 