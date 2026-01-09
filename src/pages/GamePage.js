// src/pages/GamePage.js

import React from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

// Import the reusable game mode components
import ClassicMode from '../components/Game/ClassicMode';
import CooperationMode from '../components/Game/CooperationMode';
import BattleRoyaleMode from '../components/Game/BattleRoyaleMode';
import './GamePage.css'; // Assuming common styles

// List of valid categories and modes
const VALID_CATEGORIES = ['population', 'area', 'gini'];
// Mode names should match component names (lowercase)
const VALID_MODES = ['classic', 'cooperation', 'battleroyale'];

function UnifiedGamePage() {
  const { category, mode } = useParams();
  const location = useLocation(); // Needed for Coop/BR lobbyId

  // --- Validation ---
  const isValidCategory = VALID_CATEGORIES.includes(category?.toLowerCase());
  const isValidMode = VALID_MODES.includes(mode?.toLowerCase());

  if (!isValidCategory || !isValidMode) {
    console.error(`Invalid category (${category}) or mode (${mode}) accessed.`);
    // Redirect to home page or show a 404 component
    return <Navigate to="/" replace />;
  }

  // Multiplayer modes require lobbyId from location state
  const lobbyId = location.state?.lobbyId;
  if ((mode === 'cooperation' || mode === 'battleroyale') && !lobbyId) {
    console.error(`${mode} mode requires a lobbyId in location state.`);
    // Redirect or show an error message specific to needing a lobby
    // Might redirect to a lobby page or home
    return <Navigate to="/" replace state={{ error: "Lobby ID missing for multiplayer game." }} />;
  }

  // --- Component Rendering ---
  const renderGameMode = () => {
    switch (mode.toLowerCase()) {
      case 'classic':
        // Classic mode only needs the category
        return <ClassicMode category={category} />;
      case 'cooperation':
        // Cooperation mode needs category and lobbyId
        return <CooperationMode category={category} lobbyId={lobbyId} />;
      case 'battleroyale':
        // Battle Royale mode needs category and lobbyId
        return <BattleRoyaleMode category={category} lobbyId={lobbyId} />;
      default:
        // This case should ideally be caught by validation, but acts as a fallback
        console.error('Reached default case in renderGameMode - should not happen!');
        return <Navigate to="/" replace />;
    }
  };

  return (
    <div className="game-page-container">
      <SEO
        title={`Sort by ${category.charAt(0).toUpperCase() + category.slice(1)} (${mode})`}
        description={`Play Sortly: Sort countries by ${category} in ${mode} mode.`}
      />
      {/* This container can hold styles common to all game pages */}
      {renderGameMode()}
    </div>
  );
}

export default UnifiedGamePage;


