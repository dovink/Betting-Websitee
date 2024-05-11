import { Link, NavLink } from "react-router-dom";

export default function Navigation({ user }) {
   return (
      <header className="shadow-md">
         <nav className="max-w-screen-xl mx-auto flex justify-between px-10">
            <div className="flex gap-x-20">
               <Link to="/home">
                  <h1>Aštuonkojo urvas</h1>
               </Link>
               <div className="flex items-center">
                  <ul className="flex h-full">
                     <li>
                        <NavLink
                           to="#"
                           className="px-5 inline-block h-full content-center hover:bg-neutral-200"
                        >
                           Pradžia
                        </NavLink>
                     </li>
                     <li>
                        <NavLink
                           to="#"
                           className="px-5 inline-block h-full content-center hover:bg-neutral-200"
                        >
                           Spėlionė
                        </NavLink>
                     </li>
                     <li>
                        <NavLink
                           to="#"
                           className="px-5 inline-block h-full content-center hover:bg-neutral-200"
                        >
                           Dirbtuvės
                        </NavLink>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="flex items-center gap-x-10">
               {user && <p className="font-bold">{user.name}</p>}
               <Link to="/settings">Mano urvas</Link>
            </div>
         </nav>
      </header>
   );
}