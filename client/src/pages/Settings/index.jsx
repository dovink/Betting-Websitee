import { useState } from "react";
import Nustatymai from "../../components/Nustatymai/Nustatymai";
import Pasiekimai from "../../components/Pasiekimai";
import Speliones from "../../components/Speliones";
import Navigation from "../../components/Navigation";
import classes from "./index.module.css";
import { useNavigate } from "react-router-dom";

export default function Settings() {
   const [selectedNav, setSelectedNav] = useState("nustatymai");
   const [navigateOptions, setNavigateOptions] = useState([
      { value: "mano-speliones", label: "Mano spėlionės", isActive: false },
      { value: "pasiekimai", label: "Pasiekimai", isActive: false },
      { value: "nustatymai", label: "Nustatymai", isActive: true },
   ]);
   const navigate = useNavigate();

   const handleNavigationChange = (e) => {
      const newNavigateOptions = navigateOptions.map((element) => {
         return {
            ...element,
            isActive: element.value === e.target.value,
         };
      });
      setSelectedNav(e.target.value);
      setNavigateOptions(newNavigateOptions);
   };

   const handleLogout = async () => {
      try {
         const response = await fetch("http://localhost:5050/logout", {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         navigate("/");
      } catch (err) {
         console.error(
            `A problem occurred with login operation: ${err.message}`
         );
      }
   };

   return (
      <>
         <Navigation />
         <main className="max-w-screen-xl mx-auto px-10 mt-20">
            <div>
               <h1 className="text-6xl font-normal">Mano Urvas</h1>
               <div className="flex gap-x-8">
                  <nav className={classes.profileNav}>
                     {navigateOptions.map((element) => (
                        <button
                           key={element.value}
                           value={element.value}
                           onClick={handleNavigationChange}
                           className={element.isActive ? classes.active : ""}
                        >
                           {element.label}
                        </button>
                     ))}
                  </nav>
                  <button onClick={handleLogout}>Atsijungti</button>
               </div>
            </div>
            <div>
               {selectedNav === "mano-speliones" && <Speliones />}
               {selectedNav === "pasiekimai" && <Pasiekimai />}
               {selectedNav === "nustatymai" && <Nustatymai />}
            </div>
         </main>
      </>
   );
}
