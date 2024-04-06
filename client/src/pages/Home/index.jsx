import axios from "axios";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Index() {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();
   const fetchUserInfo = async () => {
         
   try {
      let response = await fetch("http://localhost:5050/", {
         method: "GET",
         withCredentials: true,
         credentials: 'include',
         headers: {
            "Content-Type": "application/json",
         },
      });

      if (!response.ok) {
         navigate("/login");
         const responseText = await response.text();
         setServerErr(responseText);
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data.user);
   } catch (err) {
      console.error(`A problem occured with log in operation: ${err}`);
   }}

   useEffect(() => {
      fetchUserInfo();
   }, []);

   return (
      <div className="mt-20">
         <h1 className="text-center">This is Home page</h1>
         <div className="flex justify-center mt-10 gap-x-10">
            <Link
               to="/register"
               className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
               Registracijos puslapis
            </Link>
            <Link
               to="/login"
               className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
               Prisijungimo puslapis
            </Link>
         </div>
         {user && <p>Welcome, {user.name}, {user.email} </p>} {/* Show user's name if available */}
      </div>
   );
}
