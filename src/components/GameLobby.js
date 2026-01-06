import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userProfileService } from '../services/userProfileService';
import { lobbyService } from '../services/lobbyService';
import { cooperationGameService } from '../services/cooperationGameService';
import { battleRoyaleGameService } from '../services/battleRoyaleGameService';
import './GameLobby.css';

// Define game settings based on mode (moved outside component)
const gameSettings = {
  cooperation: {
    minPlayers: 2,
    maxPlayers: 4, // Assuming max 4 for cooperation
    service: cooperationGameService,
    name: 'Cooperation Mode'
  },
  battleRoyale: {
    minPlayers: 2,
    maxPlayers: 8,
    service: battleRoyaleGameService,
    name: 'Battle Royale Mode'
  }
};

function GameLobby({ gameMode }) {
  const { currentUser } = useAuth();
  const { category } = useParams();
  const [lobbyId, setLobbyId] = useState('');
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentLobbyId = useRef('');
  const currentPlayer = useRef(null);

  // Effect 2: Initialize lobby, join/create, and subscribe *after* gameMode prop is available
  useEffect(() => {
    // Wait for gameMode prop and user to be logged in
    if (!gameMode || !currentUser || !category) {
      if (!category) setError('Game category not specified in URL.');
      return; 
    }

    let unsubscribeFn = null;
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const initializeLobby = async () => {
      try {
        let playerName = '';
        try {
          const profile = await userProfileService.getUserProfile(currentUser.uid);
          playerName = profile?.nickname || '';
        } catch (fetchProfileError) {
          console.error('Error fetching user profile:', fetchProfileError);
        }

        const lobbyParam = searchParams.get('lobby');
        let targetLobbyId = '';
        let playerInfo = {
          id: currentUser.uid,
          name: playerName || (lobbyParam ? `Player ${Math.floor(Math.random() * 100)}` : 'Player 1'),
          email: currentUser.email
        };
        currentPlayer.current = playerInfo;

        if (lobbyParam) { // Join Lobby
          targetLobbyId = lobbyParam;
          currentLobbyId.current = targetLobbyId;
          if (isMounted) {
             setLobbyId(targetLobbyId);
             setIsHost(false); 
          }
          try {
            await lobbyService.joinLobby(targetLobbyId, playerInfo);
          } catch (joinError) {
            console.error('Error joining lobby:', joinError);
            if (isMounted) setError(joinError.message || 'Failed to join lobby');
            return; 
          }
        } else { // Create Lobby
          targetLobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();
          currentLobbyId.current = targetLobbyId;
          if (isMounted) {
              setLobbyId(targetLobbyId);
              setIsHost(true);
          }
          try {
            await lobbyService.createLobby(targetLobbyId, playerInfo, gameMode, category); 
          } catch (createError) {
            console.error('Error creating lobby:', createError);
            if (isMounted) setError(createError.message || 'Failed to create lobby');
            return; 
          }
        }

        // Subscribe to lobby changes
        unsubscribeFn = lobbyService.subscribeToLobby(targetLobbyId, (lobbyData) => {
          if (!isMounted) return; 
          
          if (lobbyData) {
            setPlayers(lobbyData.players || []);
            setIsHost(lobbyData.players && lobbyData.players[0]?.id === currentUser.uid);
            
            const dbCategory = lobbyData.category;
            if (dbCategory && dbCategory !== category) {
                 console.warn(`Lobby category (${dbCategory}) doesn't match URL category (${category})`);
            }

            if (lobbyData.status === 'playing') {
              if (gameMode && category) { 
                  const navigatePath = `/game/${category}/${gameMode}`; 
                  try {
                    console.log(`Navigating to ${navigatePath} with mode ${gameMode} and category ${category}`);
                    navigate(navigatePath, { 
                      state: { lobbyId: targetLobbyId } 
                    });
                  } catch (navError) {
                      console.error("Navigation error:", navError);
                  }
              } else {
                 console.error("Cannot navigate, gameMode prop or category param is missing.");
                 setError("Error determining game mode/category for navigation.");
              }
            }
          } else {
            setError('Lobby not found or has been closed');
          }
        });
      } catch (error) {
        console.error('Error initializing lobby:', error);
        if (isMounted) setError('Failed to initialize lobby');
      }
    };

    initializeLobby();

    // Cleanup function
    return () => {
      isMounted = false; 
      if (unsubscribeFn) {
        unsubscribeFn();
      }
      if (currentLobbyId.current && currentPlayer.current) {
        lobbyService.leaveLobby(currentLobbyId.current, currentPlayer.current.id);
      }
    };
  }, [gameMode, searchParams, currentUser, navigate, category]); 

  const copyLink = async () => {
    if (!gameMode || !currentLobbyId.current || !category) return;

    const baseUrl = window.location.origin;
    const gameLink = `${baseUrl}/#/game/${category}/${gameMode}?lobby=${encodeURIComponent(currentLobbyId.current)}`;
    
    try {
      await navigator.clipboard.writeText(gameLink);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = gameLink;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      } catch (copyErr) {
        setCopyStatus('Failed to copy');
        console.error('Fallback copy failed: ', copyErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const startGame = async () => {
    if (!isHost || !gameMode || !currentLobbyId.current || !category) return;

    const settings = gameSettings[gameMode];
    if (!settings) {
      setError('Invalid game mode configuration.');
      return;
    }
    if (players.length < settings.minPlayers) {
      setError(`Waiting for more players. Need at least ${settings.minPlayers}.`);
      return;
    }
    if (players.length > settings.maxPlayers) {
      setError(`Too many players. Maximum is ${settings.maxPlayers}.`);
      return;
    }

    try {
      setError('');
      
      await settings.service.initializeGameState(
        currentLobbyId.current, 
        players,
        category
      );

      await lobbyService.startGame(currentLobbyId.current);

    } catch (error) {
      console.error('Error starting game:', error);
      setError(error.message || 'Failed to start game');
    }
  };
  
  if (!gameMode) {
    return <div className="game-lobby">Error: Game mode not provided.</div>;
  }
  if (!category) {
      return <div className="game-lobby">Error: Game category not specified in URL. {error && <p className="error-message">{error}</p>}</div>;
  }
  if (!currentUser) {
    return <div className="game-lobby">Loading user...</div>;
  }

  const settings = gameSettings[gameMode];

  return (
    <div className="game-lobby">
      <div className="lobby-header">
        <h2>{settings?.name || 'Game Lobby'} - {category.toUpperCase()}</h2>
        {lobbyId && <p className="lobby-id-display">Lobby ID: <strong>{lobbyId}</strong></p>}
      </div>
      
      {error && <p className="error-message">{error}</p>}

      <div className="player-list-container">
        <h3>Players ({players.length} / {settings?.maxPlayers || 'N/A'}):</h3>
        <ul className="player-list">
          {players.map((player, index) => (
            <li key={player.id} className="player-item">
              <span className="player-name">{player.name || `Player ${index + 1}`}</span>
              {player.id === currentUser.uid && <span className="player-tag you-tag"> (You)</span>} 
              {index === 0 && <span className="player-tag host-tag"> (Host)</span>}
            </li>
          ))}
        </ul>
      </div>

      {lobbyId && (
        <div className="lobby-controls">
          {isHost ? (
            <>
              <button 
                className="button button-secondary" 
                onClick={copyLink} 
                disabled={copyStatus === 'Copied!' || copyStatus === 'Failed to copy'}
              >
                {copyStatus || 'Copy Invite Link'}
              </button>
              <button 
                className="button button-primary" 
                onClick={startGame} 
                disabled={players.length < (settings?.minPlayers || 2)}
              >
                Start Game
              </button>
            </>
          ) : (
            <button 
              className="button button-secondary" 
              onClick={copyLink} 
              disabled={copyStatus === 'Copied!' || copyStatus === 'Failed to copy'}
            >
              {copyStatus || 'Copy Invite Link'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default GameLobby; 