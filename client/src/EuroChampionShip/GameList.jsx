import React, { useState, useEffect } from 'react';
import { format, parseISO, isBefore } from 'date-fns';
import { lt } from 'date-fns/locale'; // Import Lithuanian locale
import VoteForm from './VoteForm';
import UpdateWinnerForm from './UpdateWinnerForm';
import io from 'socket.io-client';
import './../assets/GameList.css';

const GamesList = ({ seasonId, teams = [], userRole }) => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showUpdateWinnerForm, setShowUpdateWinnerForm] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5050');
    setSocket(newSocket);

    newSocket.on('gameAdded', (newGame) => {
      setGames((prevGames) => [newGame, ...prevGames]);
    });

    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`http://localhost:5050/season/${seasonId}/games`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          const sortedGames = data.games.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
          setGames(sortedGames);
        }
      } catch (error) {
        console.error('Nepavyko rasti žaidimų', error);
      }
    };

    fetchGames();
  }, [seasonId]);

  const handleVoteSubmitted = () => {};

  const handleWinnerUpdated = () => {
    setShowUpdateWinnerForm(null);
    setSelectedGame(null);
  };

  return (
    <div className="games-list">
      <h3>Visi šio sezono žaidimai:</h3>
      <ul className="game-list">
        {games.map(game => {
          const gameStartTime = parseISO(game.startTime);
          const gameHasStarted = isBefore(gameStartTime, new Date());

          return (
            <li key={game._id} className="game-item">
              <div className="game-details">
                <span>{game.homeTeam}</span>
                <span className="vs-separator">vs</span>
                <span>{game.awayTeam}</span>
                <span>{format(gameStartTime, 'yyyy-MM-dd HH:mm', { locale: lt })}</span>
                <span className={`game-status ${gameHasStarted ? 'started' : 'not-started'}`}>
                  {gameHasStarted ? 'Jau prasidėjo' : 'Dar neprasidėjo'}
                </span>
              </div>
              <button className="vote-button" onClick={() => setSelectedGame(game._id)}>Balsuoti</button>
              {selectedGame === game._id && (
                <div className="vote-form-container">
                  <VoteForm
                    gameId={game._id}
                    teams={[game.homeTeam, game.awayTeam].map(team => ({ value: team, label: team }))}
                    onVoteSubmitted={handleVoteSubmitted}
                  />
                </div>
              )}
              {userRole === 'admin' && (
                <>
                  <button className="update-winner-button" onClick={() => setShowUpdateWinnerForm(game._id)}>
                    Irasyti laimetoja
                  </button>
                  {showUpdateWinnerForm === game._id && (
                    <div className="update-winner-form-container">
                      <UpdateWinnerForm
                        gameId={game._id}
                        teams={[game.homeTeam, game.awayTeam].map(team => ({ value: team, label: team }))}
                        onWinnerUpdated={handleWinnerUpdated}
                      />
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GamesList;
