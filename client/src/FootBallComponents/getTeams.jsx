import { useState } from "react"
import { useNavigate } from "react-router-dom"


const GetTeams = () => {
    const [participatingTeams, setParticipatingTeams] = useState([])

    const fetchTeams = async (seasonId) => {
        try{
        const response = await fetch(`http://localhost:5050/footballSeason/${seasonId}/teams`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        })
        const data = await response.json()
        if(response.ok){
            setParticipatingTeams(data.teams.map(team => ({value:team, label:team})))
        }else{
            console.error("Nepavyko rasti komandu")
        }
    } catch(error){
        console.error("Nepavyko gauti komandu", error)
    }
    }
    return {participatingTeams, fetchTeams}
}

export default GetTeams;