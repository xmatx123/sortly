// src/components/CountryCard.js

import React, { useState } from 'react';
import './CountryCard.css';

function CountryCard({ country, isClickable, highlight, mode }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (isClickable) {
      setIsFlipped(!isFlipped);
    }
  };

  const highlightClass = highlight ? `highlighted-${highlight}` : '';

  const getDetailText = () => {
    if (mode === 'population') {
      return `Population: ${country.population.toLocaleString()}`;
    } else if (mode === 'area') {
      return `Area: ${country.area.toLocaleString()} km²`;
    }
    return '';
  };

  return (
    <div
      className={`country-card ${isFlipped ? 'flipped' : ''} ${
        isClickable ? 'clickable' : ''
      }`}
      onClick={handleClick}
    >
      <div className="card-inner">
        {/* Front Side */}
        <div className={`card-face card-front ${highlightClass}`}>
          <img
            src={country.flagUrl}
            alt={`Flag of ${country.name}`}
            className="country-flag"
          />
          <div className="country-info">
            <h3 className="country-name">{country.name}</h3>
          </div>
        </div>
        {/* Back Side */}
        <div className={`card-face card-back ${highlightClass}`}>
          <div className="country-info">
            <h3 className="country-name">{country.name}</h3>
            <p className="country-detail">
              {getDetailText()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryCard;
