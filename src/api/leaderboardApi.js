// src/api/leaderboardApi.js

// Use localStorage for simplicity, replace with backend API calls in production
const LEADERBOARD_KEY_PREFIX = 'sortly_leaderboard_'; // Use a prefix for category-specific keys

// Submit score for a specific category, optionally link to game history
export const submitScore = (playerName, score, category, gameHistoryId = null) => {
  if (!category || typeof category !== 'string') {
    console.error("Invalid category provided to submitScore:", category);
    return null;
  }
  const leaderboardKey = `${LEADERBOARD_KEY_PREFIX}${category.toLowerCase()}`;
  const leaderboard = getLeaderboard(category); // Get the specific category leaderboard
  const newEntry = {
    id: Date.now(), // Simple ID, consider UUID in production
    playerName,
    score,
    // Removed 'mode', using category-specific storage
    date: new Date().toISOString(),
    gameHistoryId: gameHistoryId, // Link to detailed game history entry ID if provided
  };

  leaderboard.push(newEntry);
  // Sort by score (descending)
  leaderboard.sort((a, b) => b.score - a.score);
  // Keep only top N entries (e.g., top 100)
  const topEntries = leaderboard.slice(0, 100);

  try {
      localStorage.setItem(leaderboardKey, JSON.stringify(topEntries));
      console.log(`Score submitted to ${leaderboardKey}`, newEntry);
      return newEntry;
  } catch (error) {
      console.error(`Error saving leaderboard to localStorage for ${category}:`, error);
      // Handle potential storage limits or errors
      return null;
  }

};

// Get all entries for a specific category leaderboard
export const getLeaderboard = (category) => {
  if (!category || typeof category !== 'string') {
    console.error("Invalid category provided to getLeaderboard:", category);
    return [];
  }
  const leaderboardKey = `${LEADERBOARD_KEY_PREFIX}${category.toLowerCase()}`;
  try {
      const storedData = localStorage.getItem(leaderboardKey);
      return JSON.parse(storedData || '[]');
  } catch (error) {
      console.error(`Error reading leaderboard from localStorage for ${category}:`, error);
      return [];
  }
};

// Get top N scores for a specific category
export const getTopScores = (category, limit = 5) => { // Default limit to 5
  if (!category || typeof category !== 'string') {
    console.error("Invalid category provided to getTopScores:", category);
    return [];
  }
  const leaderboard = getLeaderboard(category);
  // Already sorted by getLeaderboard (or submitScore implicitly sorts)
  return leaderboard.slice(0, limit);
}; 