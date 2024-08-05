import { useEffect, useState } from "react"
import Select from "react-select";

const SeasonsDropdown = ({ onSelect, seasons, setSeasons }) => {
    const [selectedSeason, setSelectedSeason] = useState(null);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch("http://localhost:5050/footballSeasons", {
                    method: "GET",
                    headers: {
                        'content-type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    const sortedList = data.seasons.sort((a, b) => b.year - a.year);
                    setSeasons(sortedList.map(season => ({ value: season._id, label: `${season.name} - ${season.year}` })));
                }
            } catch (error) {
                console.log("sezonai nerasti", error);
            }
        }
        fetchSeasons();
    }, [setSeasons])
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