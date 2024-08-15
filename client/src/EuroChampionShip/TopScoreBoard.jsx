import React, { useEffect, useState } from "react";
import "./../assets/TopScoreBoard.css";

const TopScoreBoard = ({ seasonId }) => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5050/top-users/${seasonId}`,
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
          setTopUsers(data.topUsers);
        } else {
          console.error("Failed to fetch top users");
        }
      } catch (error) {
        console.error("Error fetching top users:", error);
      }
    };

    if (seasonId) {
      fetchTopUsers();
    }
  }, [seasonId]);

  if (topUsers.length === 0) {
    return (
      <div className="text-center mt-4 font-medium text-red-500">
        Nėra duomenų apie žaidėjų dalyvavimą
      </div>
    );
  }

  return (
    <div className="w-3/12 mx-auto mt-10">
      {topUsers.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 border border-gray-300 rounded-md mb-2 shadow-md"
        >
          <div className="w-8 text-center font-bold text-2xl">{index + 1}</div>
          <div className="flex-1 pl-2 text-left font-bold">{item.userName}</div>
          <div className="flex space-x-1">
            <div className="w-6 h-6 flex items-center justify-center bg-yellow-400 text-xs ">
              {item.yellowGuess}
            </div>
            <div className="w-6 h-6 flex items-center justify-center bg-green-700 text-xs">
              {item.darkGreenGuess}
            </div>
            <div className="w-6 h-6 flex items-center justify-center bg-gray-400 text-xs">
              {item.greyGuess}
            </div>
            <div className="w-6 h-6 flex items-center justify-center bg-green-400 text-xs">
              {item.lightGreenGuess}
            </div>
            <div className="w-6 h-6 flex items-center justify-center bg-cyan-400 text-xs">
              {item.cyanGuess}
            </div>
            <div className="w-6 h-6 flex items-center justify-center bg-orange-400 text-xs">
              {item.orangeGuess}
            </div>
            <div className="w-6 h-6 flex items-center justify-center bg-purple-600 text-xs">
              {item.purpleGuess}
            </div>
            <div className="w-6 h-6 flex items-center justify-center bg-pink-400 text-xs">
              {item.pinkGuess}
            </div>
          </div>
          <div className="w-12 text-right font-bold text-2xl">
            {item.points}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopScoreBoard;
