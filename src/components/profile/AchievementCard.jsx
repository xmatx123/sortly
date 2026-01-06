import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';
import './AchievementCard.css';

const AchievementCard = ({ achievement, isUnlocked, unlockDate }) => (
  <div className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
    <div className="achievement-content">
      <div className="achievement-icon">{achievement.icon}</div>
      <div className="achievement-info">
        <h3>{achievement.title}</h3>
        <p>{achievement.description}</p>
        {isUnlocked && unlockDate && (
          <div className="achievement-date">
            Unlocked: {formatDate(unlockDate)}
          </div>
        )}
      </div>
    </div>
    <div className="achievement-status">
      {isUnlocked ? '✓' : '🔒'}
    </div>
  </div>
);

AchievementCard.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }).isRequired,
  isUnlocked: PropTypes.bool.isRequired,
  unlockDate: PropTypes.object
};

export default AchievementCard; 