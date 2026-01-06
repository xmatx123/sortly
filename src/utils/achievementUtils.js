export const transformAchievementDefinitions = (definitions) => {
  const achievements = [];
  
  // Process each category (population, area)
  Object.entries(definitions).forEach(([category, categoryData]) => {
    // Process sorting achievements
    Object.entries(categoryData.sorting).forEach(([level, achievement]) => {
      achievements.push({
        ...achievement,
        category,
        type: 'sorting'
      });
    });
    
    // Process game count achievement
    if (categoryData.gameCount) {
      achievements.push({
        ...categoryData.gameCount,
        category,
        type: 'gameCount'
      });
    }
  });
  
  return achievements;
}; 