import React, { useState } from "react";
import Select from "react-select";

const UpdateWinnerForm = ({ gameId, teams, onWinnerUpdated }) => {
  const [winner, setWinner] = useState("");
  const [winningMargin, setWinningMargin] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm(
      "Ar tikrai norite įrašyti šį laimėtoją?"
    );

    if (!userConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5050/game/${gameId}/update-winner`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ winner, winningMargin }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Laimėtojas sėkmingai atnaujintas");
        onWinnerUpdated();
      } else {
        setMessage(data.message || "Error updating winner");
      }
    } catch (error) {
      setMessage(error.message || "Error updating winner");
    }
  };

  return (
    <div>
      <h3 className="font-bold text-center">Įrašykite laimėtoja</h3>
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
              type="number"
              value={winningMargin}
              onChange={(e) => setWinningMargin(e.target.value)}
              className="mt-2 mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>
          <div className="h-4 min-w-full flex flex-col items-center">
            <button
              className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              įrašyti laimėtoja
            </button>
          </div>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UpdateWinnerForm;
