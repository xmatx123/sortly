// src/pages/GamePage.js

import React, { useState, useEffect } from 'react';
import CountryCard from '../components/CountryCard';
import './GamePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCountries } from '../api/countriesApi'; // As previously set up

function GamePage() {
  const [sortedCountries, setSortedCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [score, setScore] = useState(0);
  const { mode } = useParams(); // Get the game mode from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const initializeGame = async () => {
      const data = await fetchCountries();
      // Filter countries with missing data if necessary
      const validCountries = data.filter(
        (country) => country.population && country.area && country.flagUrl
      );
      startNewGame(validCountries);
    };

    initializeGame();
  }, []);

  // Determine the comparison property based on the game mode
  const compareProperty = mode === 'area' ? 'area' : 'population';

  const startNewGame = (data) => {
    const availableCountries = [...data];

    // Pick a random starting country
    const randomIndex = Math.floor(Math.random() * availableCountries.length);
    const firstCountry = availableCountries.splice(randomIndex, 1)[0];

    // Now pick the next country from the remaining
    const nextIndex = Math.floor(Math.random() * availableCountries.length);
    const nextCountry = availableCountries.splice(nextIndex, 1)[0];

    setSortedCountries([firstCountry]);
    setRemainingCountries(availableCountries);
    setScore(1);
    setCurrentCountry(nextCountry);
  };

  const pickNextCountry = () => {
    if (remainingCountries.length === 0) {
      navigate('/gameover', {
        state: { score, message: 'Congratulations! You sorted all countries correctly.' },
      });
      return;
    }

    const countriesCopy = [...remainingCountries];
    const randomIndex = Math.floor(Math.random() * countriesCopy.length);
    const nextCountry = countriesCopy.splice(randomIndex, 1)[0];

    setCurrentCountry(nextCountry);
    setRemainingCountries(countriesCopy);
  };

  const handleInsert = (index) => {
    const newSortedCountries = [...sortedCountries];
    newSortedCountries.splice(index, 0, currentCountry);

    if (isCorrectOrder(newSortedCountries)) {
      setSortedCountries(newSortedCountries);
      setScore((prevScore) => prevScore + 1);
      setCurrentCountry(null);
      pickNextCountry();
    } else {
      const allCountries = [...sortedCountries, currentCountry];
      const correctOrder = [...allCountries].sort((a, b) => a[compareProperty] - b[compareProperty]);

      navigate('/gameover', {
        state: {
          score,
          message: 'Incorrect placement!',
          incorrectCountry: currentCountry,
          userOrder: newSortedCountries,
          correctOrder: correctOrder,
        },
      });
    }
  };

  const isCorrectOrder = (countriesList) => {
    for (let i = 0; i < countriesList.length - 1; i++) {
      if (countriesList[i][compareProperty] > countriesList[i + 1][compareProperty]) {
        return false;
      }
    }
    return true;
  };

  // Build the array of components to render
  const renderComponents = [];

  if (currentCountry) {
    renderComponents.push(
      <button
        key={`insert-0`}
        className="insert-button lower-button"
        onClick={() => handleInsert(0)}
      >
        Lower
      </button>
    );
  }

  sortedCountries.forEach((country, index) => {
    renderComponents.push(
      <CountryCard key={`country-${country.id}`} country={country} isClickable={true} />
    );

    if (currentCountry) {
      let buttonText = '';
      if (index === sortedCountries.length - 1) {
        buttonText = 'Higher';
        renderComponents.push(
          <button
            key={`insert-${index + 1}`}
            className="insert-button higher-button"
            onClick={() => handleInsert(index + 1)}
          >
            {buttonText}
          </button>
        );
      } else {
        buttonText = 'Here';
        renderComponents.push(
          <button
            key={`insert-${index + 1}`}
            className="insert-button here-button"
            onClick={() => handleInsert(index + 1)}
          >
            {buttonText}
          </button>
        );
      }
    }
  });

  return (
    <div className="game-page">
      <h2>Sort Countries by {mode === 'area' ? 'Area' : 'Population'} (Ascending)</h2>
      <p>Score: {score - 1}</p>
      <div className="sorted-countries-container">
        {currentCountry && (
          <div className="instructions">
            <p>
              Where does <strong>{currentCountry.name}</strong> fit among the sorted countries?
            </p>
          </div>
        )}
        <div className="sorted-countries">{renderComponents}</div>
      </div>
      {currentCountry && (
        <div className="current-country">
          <h3>Current Country:</h3>
          <CountryCard country={currentCountry} isClickable={false} />
        </div>
      )}
    </div>
  );
}

export default GamePage;
