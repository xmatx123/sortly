import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import GameHistoryItem from './GameHistoryItem';
import './GameHistory.css';

import { useNavigate } from 'react-router-dom';

const GameHistory = ({ gameHistory }) => {
  const navigate = useNavigate();

  const topGames = useMemo(() => {
    if (!gameHistory || Object.keys(gameHistory).length === 0) {
      return [];
    }

    const entries = Object.entries(gameHistory);
    const flattenedGames = entries.flatMap(([category, games]) =>
      games.map(game => ({ ...game, category }))
    );

    const uniqueGames = flattenedGames.filter((game, index, self) =>
      index === self.findIndex((g) => g.id === game.id)
    );

    return uniqueGames
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [gameHistory]);

  const handleGameClick = (gameId) => {
    navigate(`/game-review/${gameId}`);
  };

  if (!gameHistory) {
    return (
      <div className="game-history-section">
        <h2>Best 5 Games</h2>
        <p>Loading game history...</p>
      </div>
    );
  }

  if (Object.keys(gameHistory).length === 0) {
    return (
      <div className="game-history-section">
        <h2>Best 5 Games</h2>
        <p>No games played yet. Start playing to see your best games here!</p>
      </div>
    );
  }

  return (
    <div className="game-history-section">
      <h2>Best 5 Games</h2>
      <div className="game-history-list">
        {topGames.map((game, index) => (
          <GameHistoryItem
            key={game.id}
            game={game}
            index={index}
            onClick={handleGameClick}
          />
        ))}
      </div>
    </div>
  );
};

GameHistory.propTypes = {
  gameHistory: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    timestamp: PropTypes.object,
    countries: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      flagUrl: PropTypes.string.isRequired
    }))
  })))
};

export default GameHistory; 