import React, { useState } from 'react';
import Select from 'react-select';

const UpdateWinnerForm = ({ gameId, teams, onWinnerUpdated }) => {
  const [winner, setWinner] = useState('');
  const [winningMargin, setWinningMargin] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm('Ar tikrai norite atnaujinti šį laimėtoją?');

    if (!userConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/game/${gameId}/update-winner`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winner, winningMargin }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Laimėtojas sėkmingai atnaujintas');
        onWinnerUpdated();
      } else {
        setMessage(data.message || 'Error updating winner');
      }
    } catch (error) {
      setMessage(error.message || 'Error updating winner');
    }
  };

  return (
    <div className="update-winner-form">
      <h3>Irasyti laimetoja</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Laimėtojas:</label>
          <Select
            options={teams}
            value={teams.find(team => team.value === winner)}
            onChange={(option) => setWinner(option.value)}
            classNamePrefix="select"
            placeholder="Pasirinkite laimėtoją"
            className="select"
          />
        </div>
        <div className="form-group">
          <label>Taškų skirtumas:</label>
          <input
            type="number"
            value={winningMargin}
            onChange={(e) => setWinningMargin(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button type="submit">Atnaujinti laimėtoją</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UpdateWinnerForm;
