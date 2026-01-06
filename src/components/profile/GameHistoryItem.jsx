import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';
import './GameHistoryItem.css';

const GameHistoryItem = ({ game, index }) => (
  <div className="game-history-item">
    <div className="game-rank">#{index + 1}</div>
    <div className="game-score">Score: {game.score}</div>
    <div className="game-mode">{game.category.charAt(0).toUpperCase() + game.category.slice(1)} Mode</div>
    <div className="game-date">
      {game.timestamp?.toDate ? formatDate(game.timestamp) : 'Date unavailable'}
    </div>
    <div className="game-countries">
      {game.countries?.map((country, idx) => (
        <div key={idx} className="country-item">
          <img src={country.flagUrl} alt={country.name} className="country-flag" />
          <span>{country.name}</span>
        </div>
      ))}
    </div>
  </div>
);

GameHistoryItem.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    timestamp: PropTypes.object,
    countries: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      flagUrl: PropTypes.string.isRequired
    }))
  }).isRequired,
  index: PropTypes.number.isRequired
};

export default GameHistoryItem; 