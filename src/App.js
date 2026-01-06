// src/App.js

import React, { useEffect } from 'react';
// Import useMatch for extracting route params outside Routes
import { useLocation, Routes, Route, useMatch } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga4';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UnifiedGamePage from './pages/GamePage';
import GameOverPage from './pages/GameOverPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import GameLobby from './components/GameLobby';
import { AuthProvider } from './contexts/AuthContext';
import { FirebaseTest } from './components/FirebaseTest';
import GameReviewPage from './pages/GameReviewPage';
import './App.css';

function App() {
  const location = useLocation();

  // Check if the current path matches a game route pattern
  const gameRouteMatch = useMatch('/game/:category/:mode');
  const lobbyRouteMatch = useMatch('/game/:category/:mode/*'); // Match lobby routes too

  // Extract category if we are on a game or lobby page
  const gameCategory = gameRouteMatch?.params?.category || lobbyRouteMatch?.params?.category;

  // Determine background class based on category
  let backgroundClass = '';
  if (gameCategory === 'population') {
    backgroundClass = 'bg-population';
  } else if (gameCategory === 'area') {
    backgroundClass = 'bg-area';
  } else if (gameCategory === 'gini') {
    backgroundClass = 'bg-gini';
  }

  // Initialize Google Analytics only once
  useEffect(() => {
    ReactGA.initialize('G-9679TPXEBR'); // Replace with your Measurement ID
  }, []);

  // Send pageview whenever the pathname changes
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location.pathname]);

  return (
    <AuthProvider>
      {/* Apply dynamic background class */}
      <div className={`App ${backgroundClass}`}>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Updated lobby route path to match useMatch */}
            <Route path="/game/:category/cooperation" element={<GameLobby gameMode="cooperation" />} />
            <Route path="/game/:category/battleroyale" element={<GameLobby gameMode="battleRoyale" />} />
            <Route path="/game/:category/:mode" element={<UnifiedGamePage />} />
            <Route path="/gameover" element={<GameOverPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/test" element={<FirebaseTest />} />
            <Route path="/game-review/:gameId" element={<GameReviewPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
    </HelmetProvider >
  );
}

export default App;
