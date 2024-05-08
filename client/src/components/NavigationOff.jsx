import { Link } from "react-router-dom";

export default function NavigationOff() {
   return (
      <header className="shadow-md">
         <nav className="max-w-screen-xl mx-auto flex justify-between px-10">
            <Link to="/">
               <h1>Aštuonkojo urvas</h1>
            </Link>
            <div className="flex gap-x-6 items-center">
               <Link
                  to="/login"
                  className="border-solid border-2 border-neutral-700 px-4 py-1 rounded-full hover:bg-slate-700 hover:text-slate-50 transition duration-200"
               >
                  Prisijungti
               </Link>
               <Link
                  to="/register"
                  className="border-solid border-2 border-neutral-700 px-4 py-1 rounded-full hover:bg-slate-700 hover:text-slate-50 transition duration-200"
               >
                  Registruotis
               </Link>
            </div>
         </nav>
      </header>
   );
}
