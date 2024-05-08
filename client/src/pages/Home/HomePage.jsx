import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import Urvas from "../../assets/urvas.jpg";
import Sidebar from "../../components/Sidebar";

export default function HomePage() {
   const [user, setUser] = useState("");
   const navigate = useNavigate();

   const fetchUserInfo = async () => {
      try {
         let response = await fetch("http://localhost:5050/home", {
            method: "GET",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
         });

         if (!response.ok) {
            navigate("/login");
            const responseText = await response.text();
            // setServerErr(responseText);
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json();
         setUser(data.user);
      } catch (err) {
         console.error(`A problem occured with log in operation: ${err}`);
      }
   };

   useEffect(() => {
      fetchUserInfo();
   }, []);

   return (
      <>
         <Navigation user={user} />
         <div className="max-w-screen-xl mx-auto mt-20 flex px-10">
            <Sidebar />
            <div className="w-4/6">
               <img src={Urvas} alt="octopus caricature" />
            </div>
         </div>
      </>
   );
}
