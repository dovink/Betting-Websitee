import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import './../assets/CreateSeason.css'; 
import countriesLT from '../assets/countriesLT';

const CreateSeason = ({ onSeasonCreated, formVisible, setFormVisible }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState(null);
  const [participatingTeams, setParticipatingTeams] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(year=== null){
      setMessage("Pasirinkite sezono metus")
      return
    }

    if(participatingTeams.length === 0)
    {
      setMessage("Pasirinkite dalyvaujančias šalis")
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/footballSeason", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          year: year ? year.getFullYear() : null,
          participatingTeams: participatingTeams.map(team => team.label),
        }),
        credentials: 'include',
      });
      const data = await response.json()
      console.log(data.newSeason)
      if (response.ok) {
        setMessage("Sezonas sukurtas sekmingai");
        setName('');
        setYear(null);
        setParticipatingTeams([]);
        onSeasonCreated(data.newSeason);
        setFormVisible(true);
      } else {
        setMessage('Nepavyko sukurti sezono(patikrinkite ar sezono vardas yra unikalus)');
      }
    } catch (error) {
      setMessage('Nepavyko sukurti sezono');
    }
  };

  return (
    <div className="form-container">
      {formVisible && (
        <>
          <h2 className='font-bold'>Naujas sezonas</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Pavadinimas:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Metai:</label>
              <DatePicker
                selected={year}
                onChange={(date) => setYear(date)}
                showYearPicker
                dateFormat="yyyy"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Dalyvaujančios šalys:</label>
              <Select
                isMulti
                options={countriesLT}
                value={participatingTeams}
                onChange={(selectedOptions) => setParticipatingTeams(selectedOptions)}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder = "Pasirinkite..."
              />
            </div>
            <div className="form-group">
              <button type="submit">Sukurti sezona</button>
            </div>
          </form>
          {message && <p className="text-red-700 text-center font-medium">{message}</p>}
        </>
      )}
    </div>
  );
};

export default CreateSeason;
