import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import Urvas from "../../assets/urvas.jpg";
import Sidebar from "../../components/Sidebar";
import "./../../assets/CreateSeason.css";
import EuroLeagueSection from "../../EuroChampionShip/MainEuroBasketSection";
import getTeams from "../../EuroChampionShip/getTeams";
import FootBallSection from "../../FootBallComponents/MainFootBallSection";
import classes from "./index.module.css";
import cx from "classnames";

export default function HomePage() {
   const { participatingTeams, fetchTeams } = getTeams();
   const [user, setUser] = useState({});
   const [selectedOption, setSelectedOption] = useState(null);
   const navigate = useNavigate();

   const fetchUserInfo = async () => {
      try {
         const response = await fetch("http://localhost:5050/home", {
            method: "GET",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
         });

         if (!response.ok) {
            navigate("/login");
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const data = await response.json();
         setUser(data.user);
      } catch (err) {
         console.error(
            `A problem occurred with login operation: ${err.message}`
         );
      }
   };

   useEffect(() => {
      fetchUserInfo();
   }, []);

   const handleOptionClick = (option) => {
      setSelectedOption(option);
   };

   return (
      <>
         <Navigation user={user} />
         <div className={cx(classes.mainContainer, "main-container")}>
            <div className="sidebar">
               <Sidebar onOptionClick={handleOptionClick} />
            </div>
            <div className="content-container">
               {selectedOption === "Eurolyga" && (
                  <EuroLeagueSection
                     user={user}
                     participatingTeams={participatingTeams}
                     fetchTeams={fetchTeams}
                  />
               )}
               {selectedOption === "Futbolas" && (
                  <FootBallSection user={user} />
               )}
               {!selectedOption && (
                  <img
                     src={Urvas}
                     alt="octopus caricature"
                     className="urvas-image"
                  />
               )}
            </div>
         </div>
      </>
   );
}
