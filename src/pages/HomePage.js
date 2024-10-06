// src/pages/HomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Section 1: Sort by Population */}
      <div className="section population-section">
        <div className="overlay">
          <h2>Sort by Population</h2>
          <button
            className="button button-primary"
            onClick={() => navigate('/game/population')}
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
            onClick={() => navigate('/game/area')}
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
