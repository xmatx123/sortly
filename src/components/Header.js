// src/components/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png'; // Ensure you have a logo image in your assets folder

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <img src={logo} alt="Sortly Logo" className="logo-image" />
          <span className="site-name">Sortly - The Sorting Game</span>
        </Link>
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/game/population" className="nav-link" onClick={closeMenu}>Population</Link>
          <Link to="/game/area" className="nav-link" onClick={closeMenu}>Area</Link>
          <Link to="/leaderboard" className="nav-link" onClick={closeMenu}>Leaderboard</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
