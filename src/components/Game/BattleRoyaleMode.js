import React, { useState, useEffect } from 'react';
import CountryCard from '../CountryCard'; // Adjusted path
import '../../pages/GamePage.css'; // Adjusted path
import { useNavigate } from 'react-router-dom'; // Removed useLocation
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { battleRoyaleGameService } from '../../services/battleRoyaleGameService'; // Adjusted path

// Helper function to capitalize
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

// Renamed component, accepts lobbyId and category as props
function BattleRoyaleMode({ lobbyId, category: categoryProp = 'population' }) {
  const { currentUser } = useAuth();
  const [sortedCountries, setSortedCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, completed
  const [gameStateData, setGameStateData] = useState(null); // Store full game state
  const navigate = useNavigate();
  // Removed location logic

  // Determine category primarily from gameStateData once loaded, fallback to prop
  const category = gameStateData?.category || categoryProp;

  useEffect(() => {
    // Validate lobbyId passed as prop
    if (!lobbyId) {
      console.error("BattleRoyaleMode requires a lobbyId prop.");
      navigate('/'); 
      return;
    }

    // Subscribe to the game state using the Battle Royale service
    const unsubscribe = battleRoyaleGameService.subscribeToGameState(lobbyId, (data) => {
      if (data) {
        setGameStateData(data);
        setSortedCountries(data.sortedCountries || []);
        setCurrentCountry(data.currentCountry || null);
        setRemainingCountries(data.remainingCountries || []);
        setGameState(data.status || 'waiting');
        const currentCategory = data.category || 'population'; // Get category from data

        // Handle game completion for Battle Royale
        if (data.status === 'completed') {
           let message = 'Battle Royale Over!';
           let winnerName = 'N/A';
           let winnerScore = 0;

           if (data.winner) { // Check if there is a winner object
               winnerName = data.winner.name;
               winnerScore = data.winner.score || 0;
               message = `${winnerName} is the last one standing!`;
           } else if (data.result === 'draw') {
               message = 'The Battle Royale ended in a draw!';
           }

           navigate('/gameover', { 
              state: { 
                score: winnerScore, 
                message: message,
                winnerName: winnerName, 
                category: currentCategory, 
                gameMode: `battleRoyale_${currentCategory}`, 
                finalPlayersState: data.players 
              }, 
              replace: true 
            });
        }
      } else {
        console.error("Game state not found for lobby:", lobbyId);
        navigate('/'); 
      }
    });

    return () => unsubscribe();

  }, [lobbyId, navigate]); // Dependency is now lobbyId

  // Handler for choosing a card 
  const handleChooseCard = async (country) => {
    if (!gameStateData || !currentUser) return;
    if (gameStateData.currentPlayer !== currentUser.uid) return; 
    if (gameStateData.mode !== 'choosing') return; 
    
    const me = gameStateData.players.find(p => p.id === currentUser.uid);
    if (!me || !me.isActive) {
        console.log("Cannot choose card, you are eliminated.");
        return; 
    }

    try {
      await battleRoyaleGameService.chooseCard(gameStateData.lobbyId, currentUser.uid, country);
    } catch (error) {
      console.error("Error choosing card:", error);
    }
  };

  // Handler for placing a card 
  const handlePlaceCard = async (index) => {
    if (!gameStateData || !currentUser || !currentCountry) return;
    if (gameStateData.currentPlayer !== currentUser.uid) return; 
    if (gameStateData.mode !== 'placing') return; 

    const me = gameStateData.players.find(p => p.id === currentUser.uid);
    if (!me || !me.isActive) {
        console.log("Cannot place card, you are eliminated.");
        return; 
    }

    try {
      await battleRoyaleGameService.placeCard(gameStateData.lobbyId, currentUser.uid, index);
    } catch (error) {
      console.error("Error placing card:", error);
    }
  };

  if (!gameStateData || gameState === 'waiting') {
    return <div className="game-mode-loading">Loading Battle Royale...</div>;
  }

  const myPlayerState = gameStateData.players?.find(p => p.id === currentUser?.uid);
  const isMyTurn = gameStateData.currentPlayer === currentUser?.uid && myPlayerState?.isActive;
  const amIActive = myPlayerState?.isActive;
  
  const currentPlayer = gameStateData.players?.find(p => p.id === gameStateData.currentPlayer);
  const currentPlayerName = currentPlayer?.name || 'Unknown';
  
  const canChoose = gameStateData.mode === 'choosing' && isMyTurn;
  const canPlace = gameStateData.mode === 'placing' && isMyTurn && currentCountry;

  return (
    <div className={`game-mode battle-royale-mode ${!amIActive ? 'eliminated' : ''}`}> {/* Added base class */}
      <h2>Battle Royale - {category === 'gini' ? 'Gini Index' : capitalize(category)}</h2>
      {/* Player status */}
      <div className="player-status-container">
        <h3>Players:</h3>
        <ul>
          {gameStateData.players?.map(p => (
            <li key={p.id} className={`${!p.isActive ? 'eliminated-player' : ''} ${p.id === gameStateData.currentPlayer ? 'current-turn' : ''}`}>
              {p.name} {p.id === currentUser?.uid ? '(You)' : ''} - Score: {p.score || 0} {!p.isActive ? '(Eliminated)' : ''}
            </li>
          ))}
        </ul>
      </div>
      
      {!amIActive && <p className="eliminated-message">You have been eliminated!</p>}
      
      <p>Current Turn: {currentPlayerName} {gameStateData.currentPlayer === currentUser?.uid ? '(Your Turn)' : ''}</p>

      {/* Sorted Countries */}
      <div className="sorted-countries-container">
        <h3>Sorted Countries: ({sortedCountries.length})</h3>
        <div className="sorted-countries">
          {canPlace && (
            <button
              className="place-button plus-button"
              onClick={() => handlePlaceCard(0)}
              aria-label="Place card at the beginning"
              disabled={!amIActive} 
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
                  disabled={!amIActive} 
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
                disabled={!amIActive} 
             >
               +
             </button>
          )}
        </div>
      </div>

      {/* Remaining Countries (Inventory) */}
      <div className="remaining-countries">
        <h3>Remaining Countries: ({remainingCountries.length})</h3>
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
                isClickable={canChoose}
                onClick={() => canChoose && handleChooseCard(country)}
                customClassName={`${isSelectedForPlacing ? 'selected-for-placing' : ''} ${!amIActive ? 'disabled-card' : ''}`}
              />
            );
          })}
        </div>
      </div>

      {/* Game Instructions */}
      <div className="game-instructions">
        {amIActive && gameStateData.mode === 'choosing' && (
          isMyTurn ? (
            <p>Choose a country to place next.</p>
          ) : (
            <p>Waiting for {currentPlayerName} to choose...</p>
          )
        )}
        {amIActive && gameStateData.mode === 'placing' && (
          isMyTurn ? (
            <p>Place {currentCountry?.name} in the correct position based on {category === 'gini' ? 'Gini index' : category}.</p>
          ) : (
            <p>Waiting for {currentPlayerName} to place {currentCountry?.name}...</p>
          )
        )}
        {!amIActive && gameState !== 'completed' && (
            <p>Waiting for the remaining players...</p>
        )}
      </div>
    </div>
  );
}

export default BattleRoyaleMode; 