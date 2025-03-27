// src/pages/GameOverPage.js

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CountryCard from '../components/CountryCard';
import { submitScore } from '../api/leaderboardApi';
import './GameOverPage.css';
import '../components/Buttons.css';

function GameOverPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, message, incorrectCountry, userOrder, correctOrder, mode } = location.state || {};
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    try {
      submitScore(playerName, score - 1, mode);
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit score. Please try again.');
    }
  };

  return (
    <div className="game-over-page">
      <h2>Game Over</h2>
      <p>{message}</p>
      <p>Your final score: {score - 1}</p>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="score-submission">
          <div className="input-group">
            <label htmlFor="playerName">Enter your name:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={20}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button button-primary">
            Submit Score
          </button>
        </form>
      ) : (
        <div className="submission-success">
          <p>Score submitted successfully!</p>
        </div>
      )}

      {userOrder && incorrectCountry && (
        <div className="user-order">
          <h3>Your order was:</h3>
          <div className="country-list">
            {userOrder.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                isClickable={true}
                highlight={country.id === incorrectCountry.id ? 'incorrect' : ''}
                mode={mode}
              />
            ))}
          </div>
        </div>
      )}

      {correctOrder && incorrectCountry && (
        <div className="correct-order">
          <h3>The correct order was:</h3>
          <div className="country-list">
            {correctOrder.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                isClickable={true}
                highlight={country.id === incorrectCountry.id ? 'correct' : ''}
                mode={mode}
              />
            ))}
          </div>
        </div>
      )}

      <div className="game-over-buttons">
        <button className="button button-primary" onClick={() => navigate(`/game/${mode}`)}>
          Play Again
        </button>
        <button className="button button-secondary" onClick={() => navigate('/')}>
          Go to Home Page
        </button>
        <button className="button button-secondary" onClick={() => navigate('/leaderboard')}>
          View Leaderboard
        </button>
      </div>
    </div>
  );
}

export default GameOverPage;
