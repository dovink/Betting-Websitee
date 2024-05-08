import { useState } from "react";
import Nustatymai from "../../components/Nustatymai";
import Pasiekimai from "../../components/Pasiekimai";
import Speliones from "../../components/Speliones";
import Navigation from "../../components/Navigation";
import classes from "./index.module.css";

export default function Settings() {
   const [selectedNav, setSelectedNav] = useState("nustatymai");
   const [navigateOptions, setNavigateOptions] = useState([
      { value: "mano-speliones", label: "Mano spėlionės", isActive: false },
      { value: "pasiekimai", label: "Pasiekimai", isActive: false },
      { value: "nustatymai", label: "Nustatymai", isActive: true },
   ]);

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
                  <button>Atsijungti</button>
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
