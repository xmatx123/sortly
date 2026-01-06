// src/components/CountryCard.js

import React, { useState } from 'react';
import './CountryCard.css';

function CountryCard({ 
  country, 
  mode, // category: population, area, gini
  statisticValue, // The actual value for the current mode
  isFlippable, // Can this card be flipped? (For sorted cards)
  isClickable, // Can this card be clicked to choose/place? (For remaining/current cards)
  highlight, 
  onClick, // Function to call when choosing/placing
  customClassName 
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (isFlippable) {
      // If it's flippable, just toggle the flip state
      setIsFlipped(!isFlipped);
    } else if (isClickable && onClick) {
      // Otherwise, if it's clickable for choosing/placing, call the onClick prop
      onClick();
    }
    // If neither flippable nor clickable, do nothing
  };

  const highlightClass = highlight ? `highlighted-${highlight}` : '';

  // Format numbers nicely
  const formatNumber = (num) => {
    if (typeof num !== 'number') return '';
    // Gini usually shown to 1 decimal place, others as integers
    return mode === 'gini' ? num.toFixed(1) : num.toLocaleString();
  };

  const getDetailText = () => {
    const value = formatNumber(statisticValue);
    switch (mode) {
      case 'population':
        return `Population: ${value}`;
      case 'area':
        return `Area: ${value} km²`;
      case 'gini':
        // Assuming Gini is passed as a number like 35.1
        return `Gini Index: ${value}`;
      default:
        return '';
    }
  };

  return (
    <div
      // Add 'flippable' class if applicable for styling cursor etc.
      className={`country-card ${isFlippable ? 'flippable' : ''} ${isFlipped ? 'flipped' : ''} ${
        isClickable ? 'clickable' : '' // Keep clickable for remaining cards styling
      } ${highlightClass} ${customClassName || ''}`}
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
            {/* Display the formatted detail text */}
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
