import React, { useState } from "react";
import Select from "react-select";

const VoteForm = ({ gameId, teams, onVoteSubmitted }) => {
  const [winner, setWinner] = useState("");
  const [margin, setMargin] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm(
      "Ar tikrai norite atlikti šį spėjimą?"
    );

    if (!userConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5050/game/${gameId}/vote`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ winner, margin }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Spėjimas atliktas sėkmingai");
        onVoteSubmitted();
      } else {
        setMessage(data.message || "Error submitting vote");
      }
    } catch (error) {
      setMessage(error.message || "Error submitting vote");
    }
  };

  return (
    <div>
      <h3 className="font-bold text-center">Spėti laimėtoja</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="font-medium">Laimėtojas:</label>
            <Select
              options={teams}
              value={teams.find((team) => team.value === winner)}
              onChange={(option) => setWinner(option.value)}
              classNamePrefix="select"
              placeholder="Pasirinkite laimėtoją"
              className="w-full mt-2 mb-4"
            />
          </div>
          <div className="w-full px-3">
            <label className="font-medium">Taškų skirtumas:</label>
            <input
              type=""
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              className="mt-2 mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
            />
          </div>
          <div className="h-4 min-w-full flex flex-col items-center">
            <button
              className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Spėti laimėtoja
            </button>
          </div>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default VoteForm;
