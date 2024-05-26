import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import io from 'socket.io-client';
import './../assets/CreateSeason.css';

const AddGameForm = ({ seasonId, teams }) => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5050');
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm('Ar tikrai norite pridėti šį žaidimą?');

    if (!userConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/season/${seasonId}/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ homeTeam, awayTeam, startTime }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Žaidimas pridėtas');
        socket.emit('gameAdded', data);
      } else {
        setMessage(data.message || 'Nepavyko pridėti žaidimo');
      }
    } catch (error) {
      setMessage(error.message || 'Nepavyko pridėti žaidimo');
    }
  };

  return (
    <div className="form-container">
      <h2>Pridėti nauja žaidima</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Namų komanda:</label>
          <Select
            options={teams}
            value={teams.find(team => team.value === homeTeam)}
            onChange={(option) => setHomeTeam(option.value)}
            classNamePrefix="select"
            placeholder="Pasirinkite namų komanda"
            className="select"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
        <div className="form-group">
          <label>Priešininkų komanda:</label>
          <Select
            options={teams}
            value={teams.find(team => team.value === awayTeam)}
            onChange={(option) => setAwayTeam(option.value)}
            classNamePrefix="select"
            placeholder="Pasirinkite priešininkų komanda"
            className="select"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
        <div className="form-group date-picker-wrapper">
          <label>Pradžios laikas:</label>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            dateFormat="Pp"
            popperPlacement="bottom-start"
            portalId="root-portal"
            popperContainer={({ children }) => (
              <div className="react-datepicker-popper">{children}</div>
            )}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button type="submit">Pridėti žaidima</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddGameForm;
