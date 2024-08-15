import { isBefore, parseISO, format } from "date-fns";
import { useEffect, useState } from "react";
import { lt } from "date-fns/locale";
import UpdateWinnerForm from "./UpdateWinnerForm";
import VoteForm from "./VoteForm";

const GameList = ({ season, userRole, games, setGames }) => {
   const [showUpdateWinnerForm, setShowUpdateWinnerForm] = useState(null);
   const [selectedGame, setSelectedGame] = useState(null);

   useEffect(() => {
      const fetchGames = async () => {
         try {
            const response = await fetch(
               `http://localhost:5050/footballSeason/${season._id}/games`,
               {
                  method: "GET",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  credentials: "include",
               }
            );
            const data = await response.json();
            if (response.ok) {
               setGames(data.games);
            }
         } catch (error) {
            console.error("Nepavyko rasti žaidimų", error);
         }
      };
      fetchGames();
   }, [season._id, setGames]);

   const handleVoteSubmitted = () => {};

   const handleOnWinnerClick = (id) => {
      setShowUpdateWinnerForm(id);
      setSelectedGame(null);
   };

   const handleOnGuessWinnerClick = (id) => {
      setShowUpdateWinnerForm(null);
      setSelectedGame(id);
   };

   const handlerWinnerUpdated = () => {
      setShowUpdateWinnerForm(null);
      setSelectedGame(null);
   };
   return (
      <div className="space-y-9 ">
                 <hr />
         <h3 className="text-2xl font-bold mb-6 text-center mt-4">Visi šio sezono žaidimai:</h3>
         <ul>
            {games.map((game) => {
               const gameStartTime = parseISO(game.startTime);
               const gameHasStarted = isBefore(gameStartTime, new Date());
               const gameHasEnded = game.pointsUpdated;
     
                    return (
                        <li
                            className="flex flex-col ml-44 mb-1 p-2 border border-indigo-600 rounded-lg w-3/4 "
                            key={game._id}
                        >
                            <div className="flex items-center justify-between">
                                {gameHasEnded ? (
                                    <div className="flex items-center">
                                        <span className="text-green-900 font-bold py-2">{game.winner}</span>
                                        <span>({game.winnerTeamScore})</span>
                                        <span className="font-bold px-2 text-red-900">vs</span>
                                        <span className="text-red-700 font-bold py-2">{game.awayTeam === game.winner ? game.homeTeam : game.awayTeam}</span>
                                        <span>({game.loserTeamScore})</span>
                                    </div>


                                ) : (
                                    <div className="flex items-center">
                                        <span className="text-gray-500 font-bold py-2">{game.homeTeam}</span>
                                        <span className="font-bold px-2 text-red-900">vs</span>
                                        <span className="text-gray-500 font-bold py-2">{game.awayTeam}</span>
                                    </div>
                                )}

                                <div className="absolute ml-96">
                                    {userRole === 'user' && !gameHasEnded && !season.Top4Updated && (
                                        <button className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " onClick={() => handleOnWinnerClick(game._id)}>
                                            Įrašyti laimėtoją
                                        </button>
                                    )}
                                </div>
                                <div className="absolute ml-64">
                                    {userRole === 'user' && !gameHasEnded && !season.Top4Updated && (
                                        <button className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " onClick={() => handleOnGuessWinnerClick(game._id)}>
                                            Spėti laimėtoja
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium pr-1 ">{format(gameStartTime, 'yyyy-MM-dd HH:mm', { locale: lt })}</span>
                                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 6 12 12 16 14" /></svg>
                                    <span
                                        className={`ml-2 py-1 rounded text-xs font-bold ${gameHasEnded ? 'bg-red-700 text-black px-6' : gameHasStarted ? 'bg-yellow-400 text-black px-10' : 'bg-green-500 text-black px-8'}`}
                                    >
                                       {gameHasEnded ? 'Žaidimas pasibaige' : gameHasStarted ? 'Jau prasidėjo' : 'Dar neprasidėjo'}
                                    </span>
                                </div>
                            </div>
                            {showUpdateWinnerForm === game._id && (
                                <div className="mt-4">
                                    <hr className="mb-2" />
                                    <UpdateWinnerForm
                                        gameId={game._id}
                                        teams={[game.homeTeam, game.awayTeam].map(team => ({ value: team, label: team }))}
                                        onWinnerUpdated={handlerWinnerUpdated}
                                    />
                                </div>

                            )}
                            {selectedGame === game._id && (
                                <div className="mt-4">
                                    <hr className="mb-2" />
                                    <VoteForm
                                        gameId={game._id}
                                        teams={[game.homeTeam, game.awayTeam].map(team => ({ value: team, label: team }))}
                                        onVoteSubmitted={handleVoteSubmitted}
                                    />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default GameList;
