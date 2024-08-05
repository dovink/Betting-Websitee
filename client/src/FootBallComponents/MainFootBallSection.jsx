import React, { useState } from 'react';
import CreateSeason from './CreateSeason';
import SeasonsDropdown from './SeasonDropDownMenu';
import GameList from './GameList';
import AddGameForm from './AddGameForm';
import GetTeams from './getTeams';
import Top4Guess from './Top4GuessForm';
import UpdateTop4Winners from './UpdateTop4Winners';
import TopScoreBoard from './LeaderBoard';

const footBallSection = ({ user }) => {
    const { participatingTeams, fetchTeams } = GetTeams();
    const [showCreateSeasonForm, setShowCreateSeasonForm] = useState(false);
    const [selectedSeasonId, setSelectedSeasonId] = useState(null);
    const [showAddGameForm, setShowAddGameForm] = useState(false);
    const [games, setGames] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [showTop4GuessForm, setShowTop4GuessForm] = useState(false);
    const [showEndSeasonForm, setShowEndSeasonForm] = useState(false);

    const handleSeasonCreated = (newSeason) => {
        const updatedNewSeason = ({ value: newSeason._id, label: `${newSeason.name} - ${newSeason.year}` });
        setShowCreateSeasonForm(true);
        setSeasons((prevSeasons) => {
            const updatedSeasons = [...prevSeasons, updatedNewSeason].sort((a, b) => {
                const yearA = parseInt(a.label.split(" - ")[1], 10);
                const yearB = parseInt(b.label.split(" - ")[1], 10);
                return yearB - yearA;
            });
            return updatedSeasons;
        });
    };
    const handleSeasonSelect = (seasonId) => {
        setSelectedSeasonId(seasonId);
        setShowAddGameForm(false);
        fetchTeams(seasonId);
        setShowEndSeasonForm(false);
    };
    const handleGameAdded = (newGame) => {
        setGames((prevGames) => {
            const updatedGames = [...prevGames, newGame];
            updatedGames.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            return updatedGames;
        });
    };

    return (
        <>
            <div>
                {user.role === "user" && (
                    <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded float-right'
                        onClick={() => setShowCreateSeasonForm(!showCreateSeasonForm)}>
                        {showCreateSeasonForm ? "Paslėpti forma" : "Sukurti sezoną"}
                    </button>)}
                <SeasonsDropdown onSelect={handleSeasonSelect} seasons={seasons} setSeasons={setSeasons} />
            </div>

            {showCreateSeasonForm && user.role === "user" && (
                <CreateSeason
                    onSeasonCreated={handleSeasonCreated}
                    formVisible={showCreateSeasonForm}
                    setFormVisible={setShowCreateSeasonForm}
                />
            )}
            {selectedSeasonId && (
                <>
                <TopScoreBoard seasonId={selectedSeasonId} />
                    <hr className='mt-4' />
                    <div className='mt-2 mb-2'>
                        {user.role === 'user' && (
                            <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'
                                onClick={() => setShowAddGameForm(!showAddGameForm)}>
                                {showAddGameForm ? 'Paslėpti' : 'Pridėti naują žaidimą'}
                            </button>
                        )}
                        <button
                            className=" bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded float-left mr-5"
                            onClick={() => setShowTop4GuessForm(!showTop4GuessForm)}>
                            {showTop4GuessForm ? 'Paslėpti' : 'Top 4 spėjimas'}
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-700 rounded float-right"
                            onClick={() => setShowEndSeasonForm(!showEndSeasonForm)}
                        >
                            {showEndSeasonForm ? 'Paslėpti' : 'Pabaigti sezoną'}
                        </button>
                    </div>
                    <hr className='mt-4 mb-4' />

                    {showAddGameForm && user.role === 'user' && (
                        <AddGameForm
                            seasonId={selectedSeasonId}
                            onGameAdded={handleGameAdded}
                            teams={participatingTeams}
                        />
                    )}
                    {showTop4GuessForm && (
                        <Top4Guess
                            seasonId={selectedSeasonId}
                            participatingTeams={participatingTeams}
                        />
                    )}
                    {showEndSeasonForm && user.role === 'user' && (
                        <UpdateTop4Winners
                            seasonId={selectedSeasonId}
                            teams={participatingTeams}
                        />
                    )}

                    <GameList seasonId={selectedSeasonId} userRole={user.role} games={games} setGames={setGames} />
                </>
            )}
        </>
    );
};

export default footBallSection;