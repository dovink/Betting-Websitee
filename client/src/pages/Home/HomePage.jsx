import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Urvas from '../../assets/urvas.jpg';
import Sidebar from '../../components/Sidebar';
import CreateSeason from '../../EuroChampionShip/CreateSeason';
import TopScoreBoard from '../../EuroChampionShip/TopScoreBoard';
import Top4Guess from '../../EuroChampionShip/Top4Guess';
import SeasonsDropdown from '../../EuroChampionShip/SeasonDropdown';
import GamesList from '../../EuroChampionShip/GameList';
import AddGameForm from '../../EuroChampionShip/AddGameForm';
import UpdateTop4Winners from '../../EuroChampionShip/UpdateTop4Winners';
import './../../assets/CreateSeason.css';

export default function HomePage() {
  const [user, setUser] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);
  const [participatingTeams, setParticipatingTeams] = useState([]);
  const [showAddGameForm, setShowAddGameForm] = useState(false);
  const [showCreateSeasonForm, setShowCreateSeasonForm] = useState(false);
  const [showEndSeasonForm, setShowEndSeasonForm] = useState(false);
  const [showTop4GuessForm, setShowTop4GuessForm] = useState(false);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5050/home', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        navigate('/login');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.error(`A problem occurred with login operation: ${err}`);
    }
  };

  const fetchTeams = async (seasonId) => {
    try {
      const response = await fetch(`http://localhost:5050/season/${seasonId}/teams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setParticipatingTeams(data.teams.map(team => ({ value: team, label: team })));
      } else {
        console.error('Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSeasonCreated = () => {
    setShowCreateSeasonForm(false);
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
      <Navigation user={user} />
      <div className="main-container">
        <div className="sidebar">
          <Sidebar onOptionClick={handleOptionClick} />
        </div>
        <div className="content-container">
          {selectedOption === 'Eurolyga' ? (
            <>
              <div className="top-buttons">
                {user.role === 'admin' && (
                  <button
                    className="create-button"
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
          ) : (
            <img src={Urvas} alt="octopus caricature" className="urvas-image" />
          )}
        </div>
      </div>
    </>
  );
}
