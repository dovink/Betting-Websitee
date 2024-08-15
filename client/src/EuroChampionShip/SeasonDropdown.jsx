import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SeasonsDropdown = ({ onSelect, seasons, setSeasons }) => {
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
          const sortedList = data.seasons.sort((a, b) => b.year - a.year);
          setSeasons(sortedList);
      }
      } catch (error) {
        console.error('Sezonai nerasti', error);
      }
    };

    fetchSeasons();
  }, [setSeasons]);

  const handleChange = (selectedOption) => {
    setSelectedSeason(selectedOption);
    const selectedSeasonData = seasons.find(season => season._id === selectedOption.value);
    onSelect(selectedSeasonData);
};

const customStyles = {
  option: (provided, { data }) => ({
      ...provided,
      color: data.hasEnded ? 'red' : 'green',
  }),
  placeholder: (provided) => ({
      ...provided,
      color: 'black',
      fontWeight: 'bold',
  }),
  singleValue: (provided, { data }) => ({
      ...provided,
      color: data.hasEnded ? 'red' : 'green',
  }),
};

return (
  <Select
      options={seasons.map(season => ({
          value: season._id,
          label: `${season.name} - ${season.year}`,
          hasEnded: season.Top4Updated,
      }))}
      value={selectedSeason}
      onChange={handleChange}
      className="w-3/4 text-center"
      placeholder="Pasirinkite sezona"
      styles={customStyles} 
  />
);
};

export default SeasonsDropdown;
