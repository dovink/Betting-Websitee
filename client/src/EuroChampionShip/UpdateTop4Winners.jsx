import React, { useState } from 'react';
import Select from 'react-select';
import './../assets/CreateSeason.css';

const UpdateTop4Winners = ({ seasonId, teams }) => {
  const [top4Teams, setTop4Teams] = useState([]);
  const [rankedTeams, setRankedTeams] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (selectedOptions) => {
    if (selectedOptions.length <= 4) {
      setTop4Teams(selectedOptions);
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
      const response = await fetch(`http://localhost:5050/season/${seasonId}/end-season`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ top4Teams: rankedTeams.map(team => team.value) }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTop4Teams([]);
        setRankedTeams([]);
      } else {
        setMessage(data.message || 'Nepavyko atnaujinti sezono');
      }
    } catch (error) {
      setMessage(error.message || 'Nepavyko atnaujinti sezono');
    }
  };

  return (
    <div className="form-container">
      <h2>Irašykite TOP4 komandas ir pabaikite sezoną</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>TOP 4 komandos:</label>
          <Select
            isMulti
            options={teams}
            value={top4Teams}
            onChange={handleChange}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Pasirinkite 4 komandas"
          />
        </div>
        {top4Teams.length === 4 && (
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
          <button type="submit">Pabaigti sezoną</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UpdateTop4Winners;
