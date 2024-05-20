import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Urvas from '../../assets/urvas.jpg';
import Sidebar from '../../components/Sidebar';
import CreateSeason from '../../Euroleague Components/CreateSeason';
import Top4Guess from '../../Euroleague Components/Top4Guess';
import SeasonsDropdown from '../../Euroleague Components/SeasonDropdown';
import GamesList from '../../Euroleague Components/GameList';
import AddGameForm from '../../Euroleague Components/AddGameForm';
import UpdateTop4Winners from '../../Euroleague Components/UpdateTop4Winners';
import './../../assets/CreateSeason.css';


export default function HomePage() {
  const [user, setUser] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);
  const [participatingTeams, setParticipatingTeams] = useState([]);
  const [showAddGameForm, setShowAddGameForm] = useState(false);
  const [showCreateSeasonForm, setShowCreateSeasonForm] = useState(false);
  const [showEndSeasonForm, setShowEndSeasonForm] = useState(false);
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
  };

  const handleGameAdded = () => {};

  return (
    <>
      <Navigation user={user} />
      <div className="relative-container">
        <div className="max-w-screen-xl mx-auto mt-20 flex px-10">
          <Sidebar onOptionClick={handleOptionClick} />
          <div className="w-4/6 relative">
            {selectedOption === 'Eurolyga' ? (
              <>
                <button
                  className="create-button"
                  onClick={() => setShowCreateSeasonForm(!showCreateSeasonForm)}
                >
                  {showCreateSeasonForm ? 'Paslėpti formą' : 'Sukurti sezoną'}
                </button>
                {showCreateSeasonForm && (
                  <CreateSeason
                    onSeasonCreated={handleSeasonCreated}
                    formVisible={showCreateSeasonForm}
                    setFormVisible={setShowCreateSeasonForm}
                  />
                )}
                <div className="season-selection-container">
                  <SeasonsDropdown onSelect={handleSeasonSelect} />
                  {selectedSeasonId && (
                    <button
                      className="end-season-button"
                      onClick={() => setShowEndSeasonForm(!showEndSeasonForm)}
                    >
                      {showEndSeasonForm ? 'Paslėpti' : 'Pabaigti sezoną'}
                    </button>
                  )}
                </div>
                {selectedSeasonId && (
                  <>
                    <GamesList seasonId={selectedSeasonId} teams={participatingTeams} />
                    <button onClick={() => setShowAddGameForm(!showAddGameForm)}>
                      {showAddGameForm ? 'Paslėpti' : 'Pridėti naują žaidimą'}
                    </button>
                    {showAddGameForm && (
                      <AddGameForm seasonId={selectedSeasonId} onGameAdded={handleGameAdded} teams={participatingTeams} />
                    )}
                    {showEndSeasonForm && (
                      <div className="end-season-form-container">
                        <UpdateTop4Winners seasonId={selectedSeasonId} teams={participatingTeams} />
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <img src={Urvas} alt="octopus caricature" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
