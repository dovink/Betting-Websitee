import React, { useEffect, useState } from 'react';
import './../assets/TopScoreBoard.css';

const TopScoreBoard = ({ seasonId }) => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5050/top-users/${seasonId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setTopUsers(data.topUsers);
        } else {
          console.error('Failed to fetch top users');
        }
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    if (seasonId) {
      fetchTopUsers();
    }
  }, [seasonId]);

  return (
    <div className="top-score-board">

      <table>
        <tbody>
          {topUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopScoreBoard;
