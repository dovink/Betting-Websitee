import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const getTeams = () => {
    const [participatingTeams, setParticipatingTeams] = useState([]);
    const navigate = useNavigate();

    const fetchTeams = async(seasonId) => {
        try{
            const response = await fetch(`http://localhost:5050/season/${seasonId}/teams`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                });
                const data = await response.json();
                if(response.ok){
                    setParticipatingTeams(data.teams.map(team=>({value: team, label: team})))
                }else{
                    console.error('failed to fetch teams')
                }
        }catch(error){
            console.error("Error fetching teams", error);
        }
    };
    return{participatingTeams, fetchTeams};
}

export default getTeams;