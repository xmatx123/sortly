import React from 'react';
import PropTypes from 'prop-types';
import AchievementCard from './AchievementCard';
import { transformAchievementDefinitions } from '../../utils/achievementUtils';
import './AchievementsSection.css';

const AchievementsSection = ({ achievementDefinitions, achievements }) => {
  const transformedAchievements = transformAchievementDefinitions(achievementDefinitions);

  return (
    <div className="achievements-section">
      <h2>Achievements</h2>
      <div className="achievements-grid">
        {transformedAchievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isUnlocked={achievements?.[achievement.id]?.unlocked ?? false}
            unlockDate={achievements?.[achievement.id]?.unlockedAt}
          />
        ))}
      </div>
    </div>
  );
};

AchievementsSection.propTypes = {
  achievementDefinitions: PropTypes.object.isRequired,
  achievements: PropTypes.objectOf(PropTypes.shape({
    unlocked: PropTypes.bool,
    unlockedAt: PropTypes.object
  }))
};

export default AchievementsSection; 