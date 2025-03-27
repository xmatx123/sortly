// src/api/leaderboardApi.js

// For now, we'll use localStorage to store leaderboard data
// In a real application, this would be replaced with actual API calls to a backend

const LEADERBOARD_KEY = 'sortly_leaderboard';

export const submitScore = (playerName, score, mode) => {
  const leaderboard = getLeaderboard();
  const newEntry = {
    id: Date.now(),
    playerName,
    score,
    mode,
    date: new Date().toISOString(),
  };
  
  leaderboard.push(newEntry);
  // Sort by score (descending) and keep only top 100 entries
  leaderboard.sort((a, b) => b.score - a.score);
  const top100 = leaderboard.slice(0, 100);
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top100));
  return newEntry;
};

export const getLeaderboard = (mode = null) => {
  const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
  if (mode) {
    return leaderboard.filter(entry => entry.mode === mode);
  }
  return leaderboard;
};

export const getTopScores = (mode = null, limit = 10) => {
  const leaderboard = getLeaderboard(mode);
  return leaderboard.slice(0, limit);
}; 