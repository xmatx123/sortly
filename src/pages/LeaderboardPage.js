import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../api/leaderboardApi';
import './LeaderboardPage.css';

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);

  useEffect(() => {
    const loadLeaderboard = () => {
      const data = getLeaderboard(selectedMode);
      setLeaderboard(data);
    };
    loadLeaderboard();
  }, [selectedMode]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="leaderboard-page">
      <h2>Leaderboard</h2>
      
      <div className="mode-filters">
        <button 
          className={`button ${!selectedMode ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setSelectedMode(null)}
        >
          All Modes
        </button>
        <button 
          className={`button ${selectedMode === 'population' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setSelectedMode('population')}
        >
          Population
        </button>
        <button 
          className={`button ${selectedMode === 'area' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setSelectedMode('area')}
        >
          Area
        </button>
      </div>

      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Mode</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{entry.playerName}</td>
                <td>{entry.score}</td>
                <td>{entry.mode.charAt(0).toUpperCase() + entry.mode.slice(1)}</td>
                <td>{formatDate(entry.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardPage; 