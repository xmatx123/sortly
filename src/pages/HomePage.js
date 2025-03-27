// src/pages/HomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4'; // Import ReactGA
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  // Define the handler functions
  const handlePlayPopulation = () => {
    // Track the event in Google Analytics
    ReactGA.event({
      category: 'Game',
      action: 'Clicked Play Population Game',
    });
    // Navigate to the population game page
    navigate('/game/population');
  };

  const handlePlayArea = () => {
    // Track the event in Google Analytics
    ReactGA.event({
      category: 'Game',
      action: 'Clicked Play Area Game',
    });
    // Navigate to the area game page
    navigate('/game/area');
  };

  return (
    <div className="homepage">
      {/* Section 1: Sort by Population */}
      <div className="section population-section">
        <div className="overlay">
          <h2>Sort by Population</h2>
          <button
            className="button button-primary"
            onClick={handlePlayPopulation} // Use the handler function
          >
            Play Now
          </button>
        </div>
      </div>

      {/* Section 2: Sort by Area */}
      <div className="section area-section">
        <div className="overlay">
          <h2>Sort by Area</h2>
          <button
            className="button button-primary"
            onClick={handlePlayArea} // Use the handler function
          >
            Play Now
          </button>
        </div>
      </div>

      {/* Section 3: Coming Soon */}
      <div className="section coming-soon-section">
        <div className="overlay">
          <h2>New Game Mode</h2>
          <p>Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
