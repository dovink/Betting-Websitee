import { Link, NavLink } from "react-router-dom";

export default function Navigation({ user }) {

   return (
      <header className="shadow-md">
         <nav className="max-w-screen-xl mx-auto flex justify-between">
            <div className="flex gap-x-20">
               <Link to="/home">
                  <h1>Aštuonkojo urvas</h1>
               </Link>
               <div className="flex items-center">
                  <ul className="flex gap-x-16">
                     <li>
                        <NavLink to="#">Pradžia</NavLink>
                     </li>
                     <li>
                        <NavLink to="#">Spėlionė</NavLink>
                     </li>
                     <li>
                        <NavLink to="#">Dirbtuvės</NavLink>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="flex items-center gap-x-10">
               <p className="font-bold">{user.name}</p>
               <Link to="#">Mano urvas</Link>
            </div>
         </nav>
      </header>
   );
}
