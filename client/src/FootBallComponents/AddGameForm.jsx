import { useEffect, useState } from "react";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddGameForm = ({ seasonId, teams, onGameAdded }) => {
    const [homeTeam, setHomeTeam] = useState('');
    const [awayTeam, setAwayTeam] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userConfirmed = window.confirm('Ar tikrai norite pridėti šitą žaidimą?');

        if (!userConfirmed) {
          return;
        }

        try {
            const response = await fetch(`http://localhost:5050/footballSeason/${seasonId}/game`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ homeTeam, awayTeam, startTime }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Zaidimas pridėtas");
                onGameAdded(data); 
            } else {
                setMessage(data.message || 'Nepavyko pridėti zaidimo');
            }
        } catch (error) {
            setMessage(error.message || 'Nepavyko pridėti zaidimo');
        }
    };

    return (
        <>
            <div className="w-3/4 ">
                <h2 className="font-bold text-center">Pridėti nauja žaidima</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="font-medium">Namų komanda:</label>
                        <Select
                            options={teams}
                            value={teams.find(team => team.value === homeTeam)}
                            onChange={(option) => setHomeTeam(option.value)}
                            classNamePrefix={"select"}
                            placeholder="Pasirinkite namų komanda"
                            className="mb-4"
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                    </div>
                    <div>
                        <label className="font-medium">Priešininkų komanda:</label>
                        <Select
                            options={teams}
                            value={teams.find(team => team.value === awayTeam)}
                            onChange={(option) => setAwayTeam(option.value)}
                            classNamePrefix={"select"}
                            placeholder="Pasirinkite priešininkų komanda"
                            className="mb-4"
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                    </div>
                    <div className="">
                        <label className="font-medium">Pradžios laikas:</label>
                        <div>
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5
                             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                            />
                        </div>
                    </div>
                    <div>
                        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                    text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit">Pridėti žaidima </button>
                    </div>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
            <hr className="mt-4 mb-2" />
        </>
    );
};

export default AddGameForm;
