import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch('http://localhost:5050/home', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            navigate('/login');
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          setUser(data.user);
        } catch (err) {
          console.error(`A problem occurred with login operation: ${err.message}`);
        }
      };
  
      fetchUserInfo();
    }, [navigate]);
    return user;
  };
  
  export default UserInfo;