// src/components/CountryCard.js

import React, { useState } from 'react';
import './CountryCard.css';

function CountryCard({ country, isClickable, highlight }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (isClickable) {
      setIsFlipped(!isFlipped);
    }
  };

  const highlightClass = highlight ? `highlighted-${highlight}` : '';

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
              Population: {country.population.toLocaleString()}
            </p>
            <p className="country-detail">
              Area: {country.area.toLocaleString()} km²
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryCard;
