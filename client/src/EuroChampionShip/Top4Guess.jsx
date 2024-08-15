import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './../assets/CreateSeason.css';

const Top4Guess = ({ seasonId, participatingTeams }) => {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [rankedTeams, setRankedTeams] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (selectedOptions) => {
    if (selectedOptions.length <= 4) {
      setSelectedTeams(selectedOptions);
      setRankedTeams(selectedOptions.map((team, index) => ({
        ...team,
        rank: index + 1,
      })));
    }
  };

  const handleRankChange = (index, rank) => {
    const updatedRanks = [...rankedTeams];
    updatedRanks[index] = { ...updatedRanks[index], rank: parseInt(rank, 10) };
    updatedRanks.sort((a, b) => a.rank - b.rank);
    setRankedTeams(updatedRanks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm('Ar tikrai norite pateikti šį spėjimą?');

    if (!userConfirmed) {
      return;
    }

    if (rankedTeams.length !== 4 || new Set(rankedTeams.map(t => t.rank)).size !== 4) {
      setMessage('Pasirinkite savo TOP4 šio sezono komandas');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/season/${seasonId}/top4guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ top4Teams: rankedTeams.map(team => team.value) }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setSelectedTeams([]);
        setRankedTeams([]);
      } else {
        setMessage(data.message || 'Error making guess');
      }
    } catch (error) {
      setMessage(error.message || 'Error making guess');
    }
  };

  return (
    <div className="form-container">
      <h2>Pasirinkite savo TOP4 šio sezono komandas</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mano TOP4 komandos:</label>
          <Select
            isMulti
            options={participatingTeams}
            value={selectedTeams}
            onChange={handleChange}
            className="mb-4 mt-2"
            classNamePrefix="select"
            placeholder="Pasirinkite top 4 komandas"
          />
        </div>
        {selectedTeams.length === 4 && (
          <div className="ranking">
            {rankedTeams.map((team, index) => (
              <div key={team.value} className="rank-item">
                <label>{team.label}</label>
                <select
                  value={team.rank}
                  onChange={(e) => handleRankChange(index, e.target.value)}
                >
                  {[1, 2, 3, 4].map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        <div className="form-group">
          <button type="submit">Pateikti savo spėjima</button>
        </div>
      </form>
      {message && <p className="font-bold text-red-700 text-center">{message}</p>}
    </div>
  );
};

export default Top4Guess;
