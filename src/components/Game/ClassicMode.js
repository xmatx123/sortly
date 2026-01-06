import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed useLocation
import { fetchCountries } from '../../api/countriesApi'; // Adjusted path
import CountryCard from '../CountryCard'; // Adjusted path
import { capitalize } from '../../utils/stringUtils'; // Import from the new utility file
import '../../pages/GamePage.css'; // Adjusted path, consider a dedicated CSS?

// Renamed component, accepts category as a prop
function ClassicMode({ category = 'population' }) { // Receive category as prop, default
  const [countriesToPick, setCountriesToPick] = useState([]);
  const [sortedCountries, setSortedCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('loading'); // loading, picking, placing, ended
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Removed: const location = useLocation();
  // Removed: const category = location.state?.category || 'population'; 

  useEffect(() => {
    // loadGame logic remains largely the same, uses the category prop
    const loadGame = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCountries = await fetchCountries();
        // Filter countries that don't have the required category data?
        const validCountries = fetchedCountries.filter(c => typeof c[category] !== 'undefined' && c[category] !== null);

        if (validCountries.length < 2) {
          setError(`Not enough countries found with valid data for category: ${category}.`);
          setGameStatus('ended');
          setIsLoading(false);
          return; // Stop loading process
        }

        const shuffled = validCountries.sort(() => 0.5 - Math.random());

        // Start the game with the first country already sorted
        // Sort initial country and first to place based on the category
        const sortedInitialPair = [shuffled[0], shuffled[1]].sort((a, b) => (a[category] ?? 0) - (b[category] ?? 0));
        const initialSortedCountry = sortedInitialPair[0];
        const firstCountryToPlace = sortedInitialPair[1];

        setSortedCountries([initialSortedCountry]); // Start with the first country placed
        setCurrentCountry(firstCountryToPlace); // Set the second country as the one to place
        // Shuffle the rest
        setCountriesToPick(shuffled.slice(2).sort(() => 0.5 - Math.random()));
        setScore(1); // Start score at 1
        setGameStatus('placing');

      } catch (err) {
        console.error(`Failed to load countries for category ${category}:`, err);
        setError(err.message || `Failed to load game data for ${category}.`);
        setGameStatus('ended');
      } finally {
        setIsLoading(false);
      }
    };
    loadGame();
  }, [category]); // Dependency is now only category

  // Wrap pickNextCountry in useCallback
  const pickNextCountry = useCallback(() => {
    if (countriesToPick.length > 0) {
      const nextCountry = countriesToPick[0];
      setCurrentCountry(nextCountry);
      setCountriesToPick(countriesToPick.slice(1));
      setGameStatus('placing');
    } else {
      // All countries sorted correctly!
      setGameStatus('ended');
      navigate('/gameover', {
        state: {
          score: score,
          message: `Congratulations! You sorted all countries by ${category === 'gini' ? 'Gini index' : capitalize(category)}!`, // Adjusted message
          category: category,
          gameMode: `classic_${category}`
        },
        replace: true
      });
    }
  }, [countriesToPick, score, category, navigate]); // Add dependencies of pickNextCountry

  const handlePlaceCountry = (index) => {
    if (!currentCountry || gameStatus !== 'placing') return;

    const countryToPlace = currentCountry;
    const newSortedCountries = [...sortedCountries];
    newSortedCountries.splice(index, 0, countryToPlace);

    // Check if the new placement is correct based on the dynamic category prop
    let isCorrect = true;
    if (index > 0) { // Check predecessor
      isCorrect = isCorrect && (newSortedCountries[index - 1][category] ?? 0) <= (countryToPlace[category] ?? 0);
    }
    if (index < newSortedCountries.length - 1) { // Check successor
      isCorrect = isCorrect && (countryToPlace[category] ?? 0) <= (newSortedCountries[index + 1][category] ?? 0);
    }

    if (isCorrect) {
      setSortedCountries(newSortedCountries);
      setScore(score + 1);
      setCurrentCountry(null);
      setGameStatus('picking'); // Go to picking state first
    } else {
      // Capture state *before* navigating
      const finalSortedList = [...sortedCountries];
      const incorrectCountry = countryToPlace;
      const attemptedIndex = index;

      // Construct the user's attempted order for history/display
      const userOrder = [...sortedCountries];
      userOrder.splice(index, 0, incorrectCountry);

      setGameStatus('ended');
      navigate('/gameover', {
        state: {
          score: score,
          message: `Incorrect placement based on ${category === 'gini' ? 'Gini index' : capitalize(category)}. Game Over!`, // Adjusted message
          category: category,
          gameMode: `classic_${category}`,
          finalSortedList: finalSortedList,
          incorrectCountry: incorrectCountry,
          attemptedIndex: attemptedIndex,
          userOrder: userOrder // Pass the constructed user order
        },
        replace: true
      });
    }
  };

  // Effect to automatically pick next country when in 'picking' state
  useEffect(() => {
    if (gameStatus === 'picking') {
      pickNextCountry();
    }
  }, [gameStatus, pickNextCountry]); // Add pickNextCountry to dependencies

  if (isLoading) {
    // Use a generic class, GamePage can add wrapper styles
    return <div className="game-mode-loading">Loading Classic Game...</div>;
  }

  if (error) {
    return <div className="game-mode-error">Error: {error} <button onClick={() => window.location.reload()}>Retry</button></div>;
  }

  // Removed ended state check here, assume parent handles navigation
  // if (gameStatus === 'ended' && !isLoading) { ... }

  return (
    // Use a common class for game mode components
    <div className="game-mode classic-mode">
      <h2>Classic Mode - Sort by {category === 'gini' ? 'Gini Index' : capitalize(category)} (Lowest to Highest)</h2>
      <p>Score: {score > 0 ? score - 1 : 0}</p>


      <div className="sorted-countries-container">

        <div className="sorted-countries">
          {/* Use button for placement start */}
          {currentCountry && gameStatus === 'placing' && (
            <button
              className="place-button plus-button"
              onClick={() => handlePlaceCountry(0)}
              aria-label="Place card at the beginning"
              title={`Place ${currentCountry.name} at the beginning`}
            >
              +
            </button>
          )}
          {sortedCountries.map((country, index) => (
            <React.Fragment key={`fragment-${country.id}`}>
              <CountryCard
                country={country}
                mode={category}
                statisticValue={country[category]}
                isFlippable={true}
                isClickable={false}
              />
              {/* Use button for placement between */}
              {currentCountry && gameStatus === 'placing' && (
                <button
                  className="place-button plus-button"
                  onClick={() => handlePlaceCountry(index + 1)}
                  aria-label={`Place card after ${country.name}`}
                  title={`Place ${currentCountry.name} after ${country.name}`}
                >
                  +
                </button>
              )}
            </React.Fragment>
          ))}
          {/* If sortedCountries is empty and the player can place, show an initial place button */}
          {sortedCountries.length === 0 && currentCountry && gameStatus === 'placing' && (
            <button
              className="place-button plus-button"
              onClick={() => handlePlaceCountry(0)}
              aria-label="Place first card"
              title={`Place ${currentCountry.name} at the beginning`}
            >
              +
            </button>
          )}
        </div>
      </div>

      {gameStatus === 'placing' && currentCountry && (
        <div className="current-country">
          <h3>Place this Country:</h3>
          <div
            className="current-country-wrapper"
            title={`${currentCountry.name} - place it in the list above`}
          >
            <CountryCard
              country={currentCountry}
              mode={category}
              statisticValue={currentCountry[category]}
              isFlippable={false}
              isClickable={false}
            />
          </div>
        </div>
      )}
      {/* Instructions could be added */}
      {/* <div className="game-instructions"> ... </div> */}

    </div>
  );
}

export default ClassicMode; 