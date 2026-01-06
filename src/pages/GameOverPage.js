// src/pages/GameOverPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CountryCard from '../components/CountryCard';
import { submitScore } from '../api/leaderboardApi';
import { gameHistoryService } from '../services/gameHistoryService';
import { userProfileService } from '../services/userProfileService';
import { useAuth } from '../contexts/AuthContext';
import { capitalize } from '../utils/stringUtils'; // Corrected import path
import './GameOverPage.css';
import '../components/Buttons.css';

// Helper function to parse category and mode
const parseGameMode = (modeString) => {
  if (!modeString || typeof modeString !== 'string') return { mode: 'unknown', category: 'unknown' };
  const parts = modeString.split('_');
  if (parts.length === 2) {
    // Handle potential mode name changes if needed (e.g., battleRoyale)
    const mode = parts[0].toLowerCase();
    const category = parts[1].toLowerCase();
    return { mode, category };
  } else if (parts.length === 1) {
    // Fallback for older/simpler modes if necessary?
    return { mode: parts[0].toLowerCase(), category: 'unknown' }; // Or maybe default to population?
  }
  return { mode: 'unknown', category: 'unknown' };
};

function GameOverPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const {
    score = 0,
    message = 'Game Over!',
    gameMode: gameModeString = 'unknown', // Get the combined string
    // Classic mode specific:
    incorrectCountry,
    userOrder,
    finalSortedList, // The correctly sorted list *before* the mistake
    // Battle Royale specific:
    winnerName,
    finalPlayersState
  } = location.state || {};

  // Parse the mode and category from the combined string
  const { mode, category } = parseGameMode(gameModeString);

  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [savedGameId, setSavedGameId] = useState(null); // Store the ID from gameHistoryService
  const hasAttemptedSave = useRef(false); // Track if save attempt was made

  // Fetch user profile for potential nickname
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await userProfileService.getUserProfile(currentUser.uid);
          if (profile?.nickname) {
            setPlayerName(profile.nickname);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };
    fetchUserProfile();
  }, [currentUser]);

  // Save game history automatically when the component mounts and data is available
  useEffect(() => {
    const saveGameHistory = async () => {
      // Only run if data is present and category/mode are known
      if (hasAttemptedSave.current || category === 'unknown' || mode === 'unknown') {
        if (hasAttemptedSave.current) console.log("Save skipped: Already attempted.");
        if (category === 'unknown' || mode === 'unknown') console.log("Save skipped: Unknown category or mode.");
        return;
      }

      hasAttemptedSave.current = true; // Mark as attempted regardless of login status

      if (!currentUser) {
        console.log("Firestore save skipped: No user logged in.");
        return;
      }

      console.log("Attempting to save game history...");

      let historyScore = 0;
      let historyDataPayload = null; // For the user's attempt list or BR state
      let correctlySortedForSave = null; // For classic mode: the list before mistake
      let incorrectCountryForSave = null; // For classic mode: the wrongly placed country

      if (mode === 'classic' || mode === 'cooperation') {
        historyScore = score > 0 ? score - 1 : 0;
        // User's final order (payload)
        if (userOrder) {
          historyDataPayload = userOrder.map(country => ({
            id: country.id,
            name: country.name,
            flagUrl: country.flagUrl,
            [category]: country[category]
          }));
        }
        // Classic specific data
        if (mode === 'classic') {
          if (finalSortedList) { // Use finalSortedList passed from ClassicMode
            correctlySortedForSave = finalSortedList.map(c => ({
              id: c.id, name: c.name, flagUrl: c.flagUrl, [category]: c[category]
            }));
          }
          if (incorrectCountry) {
            incorrectCountryForSave = {
              id: incorrectCountry.id,
              name: incorrectCountry.name,
              flagUrl: incorrectCountry.flagUrl,
              [category]: incorrectCountry[category]
            };
          }
        }
      } else if (mode === 'battleroyale') {
        historyScore = score;
        if (finalPlayersState) {
          historyDataPayload = finalPlayersState.map(p => ({
            name: p.name, score: p.score, isActive: p.isActive
          }));
        }
      } else {
        console.log("Save skipped: Unrecognized game mode:", mode);
        return; // Don't save if mode isn't recognized
      }

      // Save only if ... (allow 0 score to be saved if we have payload)
      if (historyScore >= 0 || (historyDataPayload && historyDataPayload.length > 0)) { // Changed > 0 to >= 0
        try {
          console.log('Calling gameHistoryService.saveGame with:', { userId, category, mode, historyScore });
          const gameId = await gameHistoryService.saveGame(
            userId,
            category,
            mode,
            historyScore,
            historyDataPayload, // Pass the user's attempt list or BR state
            correctlySortedForSave, // Pass classic mode's correct list (before mistake)
            incorrectCountryForSave // Pass classic mode's incorrect country
          );
          setSavedGameId(gameId); // Store the returned ID
          console.log('Game history saved successfully with ID:', gameId);
        } catch (err) {
          console.error('Error saving game history:', err);
          setError('Failed to save game details. Score submission may not link correctly.');
          // Still allow score submission, just won't be linked
        }
      } else {
        console.log('Skipping game history save: Score is zero and no other data to save.');
      }
    };

    saveGameHistory();
    // Dependencies: Ensure all relevant state pieces trigger this effect appropriately.
  }, [currentUser, mode, category, score, userOrder, finalSortedList, incorrectCountry, finalPlayersState]);

  // Handle score submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    let submitScoreValue = 0;
    if (mode === 'classic' || mode === 'cooperation') {
      submitScoreValue = score > 0 ? score - 1 : 0;
    } else if (mode === 'battleroyale') {
      submitScoreValue = score;
    }

    if (submitScoreValue < 0) { // Changed <= 0 to < 0 to allow 0 score
      setError('Only scores of 0 or greater can be submitted.');
      return;
    }
    if (category === 'unknown') {
      setError('Cannot submit score for unknown category.');
      return;
    }

    try {
      // Pass category and the savedGameId (if available) to submitScore API
      console.log(`Submitting score: ${playerName}, ${submitScoreValue}, ${category}, History ID: ${savedGameId}`);
      const submissionResult = submitScore(playerName, submitScoreValue, category, savedGameId);
      if (submissionResult) {
        setIsSubmitted(true);
        setError('');
      } else {
        setError('Failed to submit score (API error). Please try again.');
      }
    } catch (err) {
      console.error("Error during score submission:", err);
      setError('Failed to submit score. Please try again.');
    }
  };

  // Function to determine the correct path for "Play Again"
  const getPlayAgainPath = () => {
    if (category === 'unknown' || mode === 'unknown') return '/';

    // Use parsed mode and category to construct path
    if (mode === 'classic') {
      return `/game/${category}/classic`;
    } else if (mode === 'cooperation') {
      return `/game/${category}/cooperation`; // Link back to lobby
    } else if (mode === 'battleroyale') {
      return `/game/${category}/battleroyale`; // Link back to lobby
    } else {
      return '/';
    }
  };

  // Determine score display text based on mode
  const getScoreDisplay = () => {
    // Use parsed mode
    if (mode === 'classic' || mode === 'cooperation') {
      return `Your final score: ${score > 0 ? score - 1 : 0}`;
    } else if (mode === 'battleroyale') {
      return winnerName ? `${winnerName}'s winning score: ${score}` : `Final Score: ${score}`;
    } else {
      return `Final Score: ${score}`;
    }
  };

  return (
    <div className={`game-over-page game-over-${mode}-${category}`}> {/* Add mode and category class */}
      <h2>Game Over</h2>
      <p>{message}</p>
      <p>{getScoreDisplay()}</p>

      {/* Display final player standings for Battle Royale (uses parsed mode) */}
      {mode === 'battleroyale' && finalPlayersState && (
        <div className="final-player-standings">
          <h3>Final Standings:</h3>
          <ul>
            {finalPlayersState.sort((a, b) => (b.score || 0) - (a.score || 0)).map(player => (
              <li key={player.id || player.name} className={!player.isActive ? 'eliminated-player' : ''}>
                {player.name}: {player.score || 0} points {!player.isActive ? '(Eliminated)' : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score Submission Form (uses parsed mode) */}
      {!isSubmitted && (mode === 'classic' || mode === 'cooperation' || (mode === 'battleroyale' && score > 0)) && (
        <form onSubmit={handleSubmit} className="score-submission">
          <div className="input-group">
            <label htmlFor="playerName">Enter your name for Leaderboard:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={20}
              disabled={!currentUser} // Disable if not logged in?
            />
          </div>
          {!currentUser && <p className="info-text">Log in to save game details and submit scores!</p>}
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button button-primary" disabled={!playerName.trim() || !hasAttemptedSave.current}>
            Submit Score
          </button>
        </form>
      )}
      {isSubmitted && (
        <div className="submission-success">
          <p>Score submitted successfully!</p>
        </div>
      )}

      {/* Display for Classic Mode incorrect placement (uses parsed mode/category) */}
      {mode === 'classic' && userOrder && incorrectCountry && (
        <div className="user-order">
          {/* This shows the order the user *attempted* including the wrong one */}
          <h3>Your final attempt ({category === 'gini' ? 'Gini' : capitalize(category)}):</h3>
          <div className="country-list">
            {userOrder.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                isClickable={false}
                // Highlight the one they got wrong in their attempt
                highlight={country.id === incorrectCountry.id ? 'incorrect' : ''}
                mode={category} // Pass parsed category
                statisticValue={country[category]} // Show stat
                isFlippable={true} // Allow flipping to see stat
              />
            ))}
          </div>
        </div>
      )}
      {/* Show the correct order up until the mistake */}
      {mode === 'classic' && finalSortedList && incorrectCountry && (
        <div className="correct-order-display">
          {/* This shows the list *before* the mistake */}
          <h3>Correctly sorted before mistake:</h3>
          <div className="country-list">
            {finalSortedList.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                isClickable={false}
                highlight={'correct'} // Mark all these as correct
                mode={category} // Pass parsed category
                statisticValue={country[category]} // Show stat
                isFlippable={true}
              />
            ))}
            {/* Optionally indicate where the incorrect one *should* have gone,
                 or just show the incorrect one separately */}
            <p style={{ textAlign: 'center', width: '100%', margin: '10px 0' }}>...then you incorrectly placed:</p>
            <div className="country-list" style={{ justifyContent: 'center' }}>
              <CountryCard
                key={incorrectCountry.id}
                country={incorrectCountry}
                isClickable={false}
                highlight={'incorrect-standalone'} // Special highlight maybe?
                mode={category}
                statisticValue={incorrectCountry[category]}
                isFlippable={true}
              />
            </div>
          </div>
        </div>
      )}

      <div className="navigation-buttons">
        <button
          onClick={() => navigate(getPlayAgainPath())}
          className="button button-secondary"
        >
          Play Again
        </button>
        <button onClick={() => navigate('/')} className="button button-secondary">
          Go Home
        </button>
        <button onClick={() => navigate('/leaderboard')} className="button button-secondary">
          Leaderboard
        </button>
      </div>
    </div>
  );
}

export default GameOverPage;
