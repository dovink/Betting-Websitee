import React, { useState } from 'react';
import CreateSeason from './CreateSeason';
import TopScoreBoard from './TopScoreBoard';
import Top4Guess from './Top4Guess';
import SeasonsDropdown from './SeasonDropdown';
import GamesList from './GameList';
import AddGameForm from './AddGameForm';
import UpdateTop4Winners from './UpdateTop4Winners';

const EuroLeagueSection = ({ user, participatingTeams, fetchTeams }) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);
  const [showAddGameForm, setShowAddGameForm] = useState(false);
  const [showCreateSeasonForm, setShowCreateSeasonForm] = useState(false);
  const [showEndSeasonForm, setShowEndSeasonForm] = useState(false);
  const [showTop4GuessForm, setShowTop4GuessForm] = useState(false);

  const handleSeasonCreated = () => {
    setShowCreateSeasonForm(true);
  };

  const handleSeasonSelect = (seasonId) => {
    setSelectedSeasonId(seasonId);
    fetchTeams(seasonId);
    setShowAddGameForm(false);
    setShowTop4GuessForm(false);
    setShowEndSeasonForm(false);
  };

  const handleGameAdded = () => {};

  return (
    <>
      <div>
        {user.role === 'admin' && (
          <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded float-right'
            onClick={() => setShowCreateSeasonForm(!showCreateSeasonForm)}
          >
            {showCreateSeasonForm ? 'Paslėpti formą' : 'Sukurti sezoną'}
          </button>
        )}
        <SeasonsDropdown onSelect={handleSeasonSelect} />
      </div>
      {showCreateSeasonForm && user.role === 'admin' && (
        <CreateSeason
          onSeasonCreated={handleSeasonCreated}
          formVisible={showCreateSeasonForm}
          setFormVisible={setShowCreateSeasonForm}
        />
      )}
      {selectedSeasonId && (
        <>
          <TopScoreBoard seasonId={selectedSeasonId} />
          <GamesList seasonId={selectedSeasonId} teams={participatingTeams} userRole={user.role} />
          <div className="buttons-container">
            {user.role === 'admin' && (
              <button
                className="add-game-button"
                onClick={() => setShowAddGameForm(!showAddGameForm)}
              >
                {showAddGameForm ? 'Paslėpti' : 'Pridėti naują žaidimą'}
              </button>
            )}
            <button
              className="top4-guess-button"
              onClick={() => setShowTop4GuessForm(!showTop4GuessForm)}
            >
              {showTop4GuessForm ? 'Paslėpti' : 'Top 4 spėjimas'}
            </button>
            {user.role === 'admin' && (
              <button
                className="end-season-button"
                onClick={() => setShowEndSeasonForm(!showEndSeasonForm)}
              >
                {showEndSeasonForm ? 'Paslėpti' : 'Pabaigti sezoną'}
              </button>
            )}
          </div>
          {showAddGameForm && user.role === 'admin' && (
            <AddGameForm
              seasonId={selectedSeasonId}
              onGameAdded={handleGameAdded}
              teams={participatingTeams}
            />
          )}
          {showTop4GuessForm && (
            <Top4Guess
              seasonId={selectedSeasonId}
            />
          )}
          {showEndSeasonForm && user.role === 'admin' && (
            <UpdateTop4Winners
              seasonId={selectedSeasonId}
              teams={participatingTeams}
            />
          )}
        </>
      )}
    </>
  );
};

export default EuroLeagueSection;
