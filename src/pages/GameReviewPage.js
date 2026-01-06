// src/pages/GameReviewPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gameHistoryService } from '../services/gameHistoryService';
import CountryCard from '../components/CountryCard';
import { formatDate } from '../utils/dateUtils';
import { capitalize } from '../utils/stringUtils';
import './GameReviewPage.css'; // Create this CSS file for styling
import '../components/Buttons.css';

function GameReviewPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId) {
        setError('No game ID provided.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        console.log(`Fetching game details for ID: ${gameId}`);
        const data = await gameHistoryService.getGameDetails(gameId);
        if (data) {
          console.log("Fetched game data:", data);
          // Ensure nested arrays/objects exist before accessing
          if (!data.correctlySortedList) data.correctlySortedList = [];
          if (!data.incorrectCountry) data.incorrectCountry = null;
          setGameData(data);
        } else {
          setError(`Game with ID ${gameId} not found.`);
        }
      } catch (err) {
        console.error("Error fetching game details:", err);
        setError('Failed to load game details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchGameData();
  }, [gameId]);

  if (loading) {
    return <div className="game-review-page loading">Loading game review...</div>;
  }

  if (error) {
    return (
      <div className="game-review-page error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/leaderboard')} className="button button-secondary">
          Back to Leaderboard
        </button>
      </div>
    );
  }

  if (!gameData) {
    // This case should ideally be covered by the error state if not found
    return <div className="game-review-page">Game data could not be loaded.</div>;
  }

  // Ensure we only show classic mode details if applicable
  const isClassicReview = gameData.mode === 'classic' && gameData.correctlySortedList && gameData.incorrectCountry;
  const categoryDisplay = gameData.category === 'gini' ? 'Gini Index' : capitalize(gameData.category || 'Unknown');

  return (
    <div className="game-review-page">
      <h2>Game Review - {capitalize(gameData.mode || 'Game')} ({categoryDisplay})</h2>
      <p>Score: {gameData.score}</p>
      <p>Played on: {gameData.timestamp ? formatDate(gameData.timestamp) : 'Date unknown'}</p>

      {isClassicReview ? (
        <div className="review-section final-order-display">
          <h3>Your Final Correct Sequence & Mistake:</h3>
          <div className="country-list combined-list">
            {gameData.correctlySortedList.map((country) => (
              <CountryCard
                key={`correct-${country.id || country.name}`}
                country={country}
                isClickable={false}
                highlight={'correct'}
                mode={gameData.category}
                statisticValue={country.value}
                isFlippable={true}
              />
            ))}

            {gameData.incorrectCountry && (
              <CountryCard
                key={`incorrect-${gameData.incorrectCountry.id || gameData.incorrectCountry.name}`}
                country={gameData.incorrectCountry}
                isClickable={false}
                highlight={'incorrect'}
                mode={gameData.category}
                statisticValue={gameData.incorrectCountry.value}
                isFlippable={true}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="general-game-info review-section">
          <h3>Game Summary</h3>
          {gameData.userAttemptList && gameData.userAttemptList.length > 0 ? (
            <div className="country-list">
              {gameData.userAttemptList.map(item => (
                <CountryCard
                  key={`attempt-${item.id || item.name}`}
                  country={item}
                  isClickable={false}
                  mode={gameData.category}
                  statisticValue={item.value}
                  isFlippable={true}
                />
              ))}
            </div>
          ) : (
            <p>Basic game data is available, but detailed review for this mode might not be fully implemented.</p>
          )}
        </div>
      )}

      <div className="navigation-buttons" style={{ marginTop: '30px' }}>
        <button onClick={() => navigate('/leaderboard')} className="button button-secondary">
          Back to Leaderboard
        </button>
        <Link to="/" className="button button-secondary">Go Home</Link>
      </div>
    </div>
  );
}

export default GameReviewPage; 