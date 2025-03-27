// src/App.js

import React, { useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Header from './components/Header';
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import GameOverPage from './pages/GameOverPage';
import LeaderboardPage from './pages/LeaderboardPage';
import './App.css';

function App() {
  const location = useLocation();

  // Initialize Google Analytics only once
  useEffect(() => {
    ReactGA.initialize('G-9679TPXEBR'); // Replace with your Measurement ID
  }, []);

  // Send pageview whenever the pathname changes
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location.pathname]);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:mode" element={<GamePage />} />
          <Route path="/gameover" element={<GameOverPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </div>
      <Footer /> 
    </div>
  );
}

export default App;
