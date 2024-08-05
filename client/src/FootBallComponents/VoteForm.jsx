import React, { useState } from 'react';
import Select from 'react-select';

const VoteForm = ({ gameId, teams, onVoteSubmitted }) => {
    const [winner, setWinner] = useState('');
    const [winnerTeamScore, setWinnerTeamScore] = useState(0);
    const [loserTeamScore, setLoserTeamScore] = useState(0);
    const [penaltiesWinner, setPenaltiesWinner] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userConfirmed = window.confirm('Ar tikrai norite atlikti šį spėjimą?');

        if (!userConfirmed) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5050/footballSeason/${gameId}/voteGame`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ winner, winnerTeamScore, loserTeamScore, penaltiesWinner: winnerTeamScore === loserTeamScore ? penaltiesWinner : "" }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Spėjimas atliktas sėkmingai');
                onVoteSubmitted();
            } else {
                setMessage(data.message || 'Error submitting vote');
            }
        } catch (error) {
            setMessage(error.message || 'Error submitting vote');
        }
    };

    return (
        <div>
            <h3 className="font-bold text-center">Spėti laimėtoja</h3>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="font-medium">Pasirinkite laimėtoja:</label>
                        <Select
                            options={teams}
                            value={teams.find(team => team.value === winner)}
                            onChange={(option) => setWinner(option.value)}
                            classNamePrefix="select"
                            placeholder="Laimėtojas"
                            className="w-full mt-2 mb-4"
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="font-medium">Laimėjusios komandos taškai:</label>
                        <div>
                            <input
                                type=""
                                value={winnerTeamScore}
                                onChange={(e) => setWinnerTeamScore(e.target.value)}
                                className="mt-2 mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                            >
                            </input>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="font-medium">Pralaimėjusios komandos taškai:</label>
                        <div>
                            <input
                                type=""
                                value={loserTeamScore}
                                onChange={(e) => setLoserTeamScore(e.target.value)}
                                className="mt-2 mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            >
                            </input>
                        </div>
                    </div>
                    {winnerTeamScore === loserTeamScore && (
                        <div className="w-full px-3">
                            <label className="font-medium">Baudų laimėtojas</label>
                            <Select
                                options={teams}
                                value={teams.find(team => team.value === penaltiesWinner)}
                                onChange={(option) => setPenaltiesWinner(option.value)}
                                classNamePrefix="select"
                                placeholder="Pasirinkite baudų laimėtoją"
                                className="mt-2 mb-4 w-full "
                            />
                        </div>
                    )}
                    <div className="h-4 min-w-full flex flex-col items-center">
                        <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                            Spėti laimėtoja
                        </button>
                    </div>
                </div>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    )
}

export default VoteForm;
