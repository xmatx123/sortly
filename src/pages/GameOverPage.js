// src/pages/GameOverPage.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CountryCard from '../components/CountryCard';
import './GameOverPage.css';
import '../components/Buttons.css';

function GameOverPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, message, incorrectCountry, userOrder, correctOrder } = location.state || {};

  return (
    <div className="game-over-page">
      <h2>Game Over</h2>
      <p>{message}</p>
      <p>Your final score: {score - 1}</p>

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
              />
            ))}
          </div>
        </div>
      )}

      <div className="game-over-buttons">
        <button className="button button-primary" onClick={() => navigate('/')}>
          Play Again
        </button>
        <button className="button button-secondary" onClick={() => navigate('/')}>
          Go to Home Page
        </button>
      </div>
    </div>
  );
}

export default GameOverPage;
