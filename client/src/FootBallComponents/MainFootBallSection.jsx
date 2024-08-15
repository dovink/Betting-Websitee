import React, { useState } from 'react';
import CreateSeason from './CreateSeason';
import SeasonsDropdown from './SeasonDropDownMenu';
import GameList from './GameList';
import AddGameForm from './AddGameForm';
import GetTeams from './getTeams';
import Top4Guess from './Top4GuessForm';
import UpdateTop4Winners from './UpdateTop4Winners';
import TopScoreBoard from './LeaderBoard';
import Urvas from "../assets/pilkas.svg";
import UserRank from './UserRank';


const footBallSection = ({ user }) => {
    const { participatingTeams, fetchTeams } = GetTeams();
    const [showCreateSeasonForm, setShowCreateSeasonForm] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [showAddGameForm, setShowAddGameForm] = useState(false);
    const [games, setGames] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [showTop4GuessForm, setShowTop4GuessForm] = useState(false);
    const [showEndSeasonForm, setShowEndSeasonForm] = useState(false);

    const handleSeasonCreated = (newSeason) => {
        setShowCreateSeasonForm(true);
        setSeasons((prevSeasons) => {
            const updatedSeasons = [...prevSeasons, newSeason];
            const sortedUpdatedSeason = updatedSeasons.sort((a,b) => b.year - a.year)
            return sortedUpdatedSeason;
        });
    };
    const handleSeasonSelect = (season) => {
        setSelectedSeason(season);
        setShowAddGameForm(false);
        fetchTeams(season._id);
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
            {selectedSeason && (
                <>
                    <TopScoreBoard seasonId={selectedSeason._id} />
                    <hr className='mt-4' />
                    <div className='mt-2 mb-2'>
                        {user.role === 'user' && !selectedSeason.Top4Updated && (
                            <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'
                                onClick={() => setShowAddGameForm(!showAddGameForm)}>
                                {showAddGameForm ? 'Paslėpti' : 'Pridėti naują žaidimą'}
                            </button>
                        )}
                        {!selectedSeason.Top4Updated && (
                            <button
                                className=" bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded float-left mr-5"
                                onClick={() => setShowTop4GuessForm(!showTop4GuessForm)}>
                                {showTop4GuessForm ? 'Paslėpti' : 'Top 4 spėjimas'}
                            </button>
                        )}
                        {!selectedSeason.Top4Updated && (
                            <button
                                className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-700 rounded float-right"
                                onClick={() => setShowEndSeasonForm(!showEndSeasonForm)}
                            >
                                {showEndSeasonForm ? 'Paslėpti' : 'Pabaigti sezoną'}
                            </button>
                        )}
                    </div>

                    {!selectedSeason.Top4Updated && (
                        <hr className='mt-4 mb-4' />
                    )}

                    {showAddGameForm && user.role === 'user' && (
                        <AddGameForm
                            seasonId={selectedSeason._id}
                            onGameAdded={handleGameAdded}
                            teams={participatingTeams}
                        />
                    )}
                    {showTop4GuessForm && (
                        <Top4Guess
                            seasonId={selectedSeason._id}
                            participatingTeams={participatingTeams}
                        />
                    )}
                    {showEndSeasonForm && user.role === 'user' && (
                        <UpdateTop4Winners
                            seasonId={selectedSeason._id}
                            teams={participatingTeams}
                        />
                    )}

                    {selectedSeason.Top4Updated && (
                        <div>


                            <div className="flex justify-center items-center mb-5">
                            <UserRank season= {selectedSeason} />
                            </div>


                            <div className="flex justify-center items-center ">
                                <div className=" p-4 bg-white w-96">
                                    <div className="text-center text-xl font-bold mb-4 border-2 border-black rounded h-12">TOP 4 šio sezono komandos</div>
                                    {selectedSeason.Top4Winners.map((team, index) => (
                                        <div key={index} className="flex items-center justify-between border-2 border-black rounded-lg p-2 mb-2">
                                            <div className="bg-green-700 text-white font-bold rounded-lg px-2 py-1">
                                                {index + 1} vieta
                                            </div>
                                            <div className="text-center flex-grow text-lg font-bold">
                                                {team}
                                            </div>
                                            <div className="w-8 h-8 border-2 border-black rounded-lg bg-white">
                                                <img src={Urvas} alt={team} className='rounded' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <GameList season={selectedSeason} userRole={user.role} games={games} setGames={setGames} />
                </>
            )}
        </>
    );
};

export default footBallSection;