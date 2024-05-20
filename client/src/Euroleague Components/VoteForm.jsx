import React, { useState } from 'react';
import Select from 'react-select';

const VoteForm = ({ gameId, teams, onVoteSubmitted }) => {
  const [winner, setWinner] = useState('');
  const [margin, setMargin] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5050/game/${gameId}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winner, margin }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Spėjimas atliktas sėkmingai');
        onVoteSubmitted();
      } else {
        setMessage(data.message || 'Error submitting vote');
      }
    } catch (error) {
      setMessage(error.message || 'Error submitting vote');
    }
  };

  return (
    <div className="vote-form">
      <h3>Spėti laimėtoja</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Laimėtojas:</label>
          <Select
            options={teams}
            value={teams.find(team => team.value === winner)}
            onChange={(option) => setWinner(option.value)}
            classNamePrefix="select"
            placeholder="Select winner"
            className="select"
          />
        </div>
        <div className="form-group">
          <label>Taškų skirtumas:</label>
          <input
            type="number"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button type="submit">Atlikti spėjima</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default VoteForm;
