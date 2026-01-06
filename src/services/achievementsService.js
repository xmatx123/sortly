import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ACHIEVEMENTS_COLLECTION = 'achievements';

const ACHIEVEMENT_DEFINITIONS = {
  population: {
    sorting: {
      bronze: { id: 'population_sorting_bronze', title: 'Population Bronze Sorter', description: 'Correctly sort 3 countries by population', icon: '🥉', requirement: 3 },
      silver: { id: 'population_sorting_silver', title: 'Population Silver Sorter', description: 'Correctly sort 7 countries by population', icon: '🥈', requirement: 7 },
      gold: { id: 'population_sorting_gold', title: 'Population Gold Sorter', description: 'Correctly sort 12 countries by population', icon: '🥇', requirement: 12 },
      platinum: { id: 'population_sorting_platinum', title: 'Population Platinum Sorter', description: 'Correctly sort 20 countries by population', icon: '👑', requirement: 20 }
    },
    gameCount: {
      id: 'population_games',
      title: 'Population Game Master',
      description: 'Complete 50 population sorting games',
      icon: '🎮',
      requirement: 50
    }
  },
  area: {
    sorting: {
      bronze: { id: 'area_sorting_bronze', title: 'Area Bronze Sorter', description: 'Correctly sort 3 countries by area', icon: '🥉', requirement: 3 },
      silver: { id: 'area_sorting_silver', title: 'Area Silver Sorter', description: 'Correctly sort 7 countries by area', icon: '🥈', requirement: 7 },
      gold: { id: 'area_sorting_gold', title: 'Area Gold Sorter', description: 'Correctly sort 12 countries by area', icon: '🥇', requirement: 12 },
      platinum: { id: 'area_sorting_platinum', title: 'Area Platinum Sorter', description: 'Correctly sort 20 countries by area', icon: '👑', requirement: 20 }
    },
    gameCount: {
      id: 'area_games',
      title: 'Area Game Master',
      description: 'Complete 50 area sorting games',
      icon: '🎮',
      requirement: 50
    }
  },
  gini: {
    sorting: {
      bronze: { id: 'gini_sorting_bronze', title: 'Gini Bronze Sorter', description: 'Correctly sort 3 countries by Gini index', icon: '🥉', requirement: 3 },
      silver: { id: 'gini_sorting_silver', title: 'Gini Silver Sorter', description: 'Correctly sort 7 countries by Gini index', icon: '🥈', requirement: 7 },
      gold: { id: 'gini_sorting_gold', title: 'Gini Gold Sorter', description: 'Correctly sort 12 countries by Gini index', icon: '🥇', requirement: 12 },
      platinum: { id: 'gini_sorting_platinum', title: 'Gini Platinum Sorter', description: 'Correctly sort 20 countries by Gini index', icon: '👑', requirement: 20 }
    },
    gameCount: {
      id: 'gini_games',
      title: 'Gini Game Master',
      description: 'Complete 50 Gini sorting games',
      icon: '🎮',
      requirement: 50
    }
  }
};

export const achievementsService = {
  // Get user achievements
  async getUserAchievements(userId) {
    try {
      const userDoc = await getDoc(doc(db, ACHIEVEMENTS_COLLECTION, userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error getting user achievements:', error);
      throw error;
    }
  },

  // Update user achievements
  async updateUserAchievements(userId, achievements) {
    try {
      await setDoc(doc(db, ACHIEVEMENTS_COLLECTION, userId), {
        ...achievements,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user achievements:', error);
      throw error;
    }
  },

  // Check and update achievements based on game results
  async checkAndUpdateAchievements(userId, category, correctCount) {
    try {
      const currentAchievements = await this.getUserAchievements(userId) || {};
      const categoryAchievements = ACHIEVEMENT_DEFINITIONS[category];
      let updated = false;

      // Check sorting achievements
      Object.values(categoryAchievements.sorting).forEach(achievement => {
        if (!currentAchievements[achievement.id] && correctCount >= achievement.requirement) {
          currentAchievements[achievement.id] = {
            unlocked: true,
            unlockedAt: serverTimestamp()
          };
          updated = true;
        }
      });

      // Check game count achievements
      const gameCountAchievement = categoryAchievements.gameCount;
      const currentCount = (currentAchievements[gameCountAchievement.id]?.count || 0) + 1;
      
      if (currentCount >= gameCountAchievement.requirement && !currentAchievements[gameCountAchievement.id]?.unlocked) {
        currentAchievements[gameCountAchievement.id] = {
          unlocked: true,
          unlockedAt: serverTimestamp(),
          count: currentCount
        };
        updated = true;
      } else {
        currentAchievements[gameCountAchievement.id] = {
          ...currentAchievements[gameCountAchievement.id],
          count: currentCount
        };
        updated = true;
      }

      if (updated) {
        await this.updateUserAchievements(userId, currentAchievements);
      }

      return currentAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  },

  // Achievement definitions
  getAchievementDefinitions() {
    return ACHIEVEMENT_DEFINITIONS;
  }
}; 