// src/pages/Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import '../components/Buttons.css'; // Import the buttons CSS

function Dashboard() {
  // Mock user data
  const user = {
    username: 'JohnDoe',
    highScore: 10,
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {user.username}</h2>
      <p>Your High Score: {user.highScore}</p>
      <Link to="/game">
        <button className="button button-primary">Play Again</button>
      </Link>
    </div>
  );
}

export default Dashboard;
