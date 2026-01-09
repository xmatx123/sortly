import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardService } from '../services/leaderboardService'; // Use global Firestore service
import { gameHistoryService } from '../services/gameHistoryService'; // Needed to fetch details
import SEO from '../components/SEO';
import { formatDate } from '../utils/dateUtils';
import { capitalize } from '../utils/stringUtils'; // Corrected import path
import './LeaderboardPage.css';
import '../components/CountryCard.css'; // Import for potential flag styling reuse

// Define the classic categories
const CLASSIC_CATEGORIES = ['population', 'area', 'gini'];

function LeaderboardPage() {
  // State to hold leaderboards, including fetched details
  const [leaderboards, setLeaderboards] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLeaderboardsAndDetails = async () => {
      setLoading(true);
      const fetchedLeaderboards = {};
      try {
        for (const category of CLASSIC_CATEGORIES) {
          // 1. Fetch top scores (basic info + gameHistoryId) from Global Firestore Service
          const topScores = await leaderboardService.getTopScores(category, 5);

          // 2. Fetch details for each score that has a gameHistoryId
          const enrichedScores = await Promise.all(
            topScores.map(async (score) => {
              if (score.gameHistoryId) {
                try {
                  const details = await gameHistoryService.getGameDetails(score.gameHistoryId);
                  // Combine score with details (correctlySortedList, incorrectCountry)
                  return { ...score, details: details || null };
                } catch (err) {
                  console.error(`Failed to fetch details for game ${score.gameHistoryId}:`, err);
                  return { ...score, details: null }; // Keep score, mark details as failed
                }
              } else {
                return { ...score, details: null }; // No ID, no details
              }
            })
          );
          fetchedLeaderboards[category] = enrichedScores;
        }
        console.log("Enriched Leaderboards:", fetchedLeaderboards);
        setLeaderboards(fetchedLeaderboards);
      } catch (error) {
        console.error("Error loading leaderboards:", error);
        // Handle error display if needed
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboardsAndDetails();
  }, []); // Fetch only once on component mount

  // --- Game History Clicking Logic (Placeholder/Future) ---
  // To enable clicking, we'd need to:
  // 1. Modify submitScore in leaderboardApi to optionally include the gameHistoryId
  //    returned by gameHistoryService.saveGame.
  // 2. Modify LeaderboardPage to fetch data possibly from Firestore (via a service)
  //    which includes the gameHistoryId.
  // 3. Implement the handleRowClick function.

  const handleRowClick = (gameHistoryId) => {
    if (gameHistoryId) {
      console.log("Navigating to game review for ID:", gameHistoryId);
      navigate(`/game-review/${gameHistoryId}`); // Navigate to the new review page route
    } else {
      console.log("No game history ID associated with this leaderboard entry.");
      alert("Detailed game view not available for this entry (likely older data or not logged in when played).");
    }
  };

  const renderLeaderboardTable = (category, data) => {
    const title = `Classic ${capitalize(category === 'gini' ? 'Gini Index' : category)}`;
    return (
      <div className="leaderboard-section">
        <h3>{title}</h3>
        {data && data.length > 0 ? (
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th>Game Overview</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr
                    key={entry.id || index}
                    onClick={() => handleRowClick(entry.gameHistoryId)}
                    className={entry.gameHistoryId ? 'clickable-row' : ''}
                    title={entry.gameHistoryId ? 'Click to see game details' : 'Game details not available'}
                  >
                    <td>{index + 1}</td>
                    <td>{entry.playerName}</td>
                    <td>{entry.score}</td>
                    <td>{formatDate(entry.date)}</td>
                    <td className="leaderboard-flags">
                      {entry.details && entry.details.mode === 'classic' ? (
                        <>
                          {entry.details.correctlySortedList?.map(country => (
                            <img
                              key={`flag-correct-${country.id || country.name}`}
                              src={country.flagUrl}
                              alt={country.name}
                              title={country.name}
                              className="flag-image"
                            />
                          ))}
                          {entry.details.incorrectCountry && (
                            <img
                              key={`flag-incorrect-${entry.details.incorrectCountry.id || entry.details.incorrectCountry.name}`}
                              src={entry.details.incorrectCountry.flagUrl}
                              alt={`${entry.details.incorrectCountry.name} (Incorrect)`}
                              title={`${entry.details.incorrectCountry.name} (Incorrect)`}
                              className="flag-image incorrect-flag"
                            />
                          )}
                          <span role="img" aria-label="View game details" className="click-indicator" title="Click for details">🔍</span>
                        </>
                      ) : entry.gameHistoryId ? (
                        <span role="img" aria-label="View game details" className="click-indicator" title="Click for details">🔍</span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No entries yet for this category.</p>
        )}
      </div>
    );
  };

  return (
    <div className="leaderboard-page">
      <SEO
        title="Global Leaderboards"
        description="Check the top scores for Sortly. See who knows their geography best in population, area, and Gini index categories."
      />
      <h2>Classic Leaderboards</h2>
      {loading ? (
        <p>Loading leaderboards...</p>
      ) : (
        CLASSIC_CATEGORIES.map(category =>
          renderLeaderboardTable(category, leaderboards[category])
        )
      )}
      {/* Add navigation buttons if needed */}
      <button onClick={() => navigate('/')} className="button button-secondary" style={{ marginTop: '20px' }}>
        Go Home
      </button>
    </div>
  );
}

export default LeaderboardPage; 