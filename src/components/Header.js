// src/components/Header.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import LoginButton from './LoginButton';

// Helper function to capitalize
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Define categories and modes for dropdowns
  const categories = ['population', 'area', 'gini'];
  const modes = [
      { name: 'classic', label: 'Classic' },
      { name: 'cooperation', label: 'Cooperation' },
      { name: 'battleroyale', label: 'Battle Royale' },
  ];

  // Function to handle navigation, ensuring menu closes
  const handleNav = (path, state = {}) => {
      navigate(path, { state });
      closeMenu();
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <img src={logo} alt="Sortly Logo" className="logo-image" />
          <span className="site-name">Sortly</span>
        </Link>
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          
          {/* Generate Dropdowns from categories */}
          {categories.map(category => (
            <div key={category} className="nav-dropdown">
              <button className="nav-link dropdown-toggle">{capitalize(category)}</button>
              <div className="dropdown-menu">
                {modes.map(mode => (
                  <button 
                    key={mode.name} 
                    className="dropdown-item" 
                    onClick={() => handleNav(`/game/${category}/${mode.name}`, mode.name === 'classic' ? { category } : {}) }
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <Link to="/leaderboard" className="nav-link" onClick={closeMenu}>Leaderboard</Link>
          <div className="nav-login">
            <LoginButton />
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
