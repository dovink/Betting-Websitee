import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SeasonsDropdown = ({ onSelect }) => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch('http://localhost:5050/seasons', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          const sortedSeasons = data.seasons.sort((a, b) => b.year - a.year);
          setSeasons(sortedSeasons.map(season => ({ value: season._id, label: `${season.name} - ${season.year}` })));
        }
      } catch (error) {
        console.error('Sezonai nerasti', error);
      }
    };

    fetchSeasons();
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedSeason(selectedOption);
    onSelect(selectedOption.value);
  };

  return (
    <Select
      options={seasons}
      value={selectedSeason}
      onChange={handleChange}
      className="w-3/4 text-center"
      placeholder="Pasirinkite sezona"
    />
  );
};

export default SeasonsDropdown;
