import { Link } from "react-router-dom";
import Urvas from "../../assets/urvas.jpg";
import "../../assets/index-page.css";

export default function IndexPage() {
   return (
      <>
         <header className="shadow-md">
            <nav className="max-w-screen-xl mx-auto flex justify-between">
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
         <main className="mt-28">
            <div className="max-w-screen-xl mx-auto">
               <img src={Urvas} alt="octopus caricature" />
            </div>
         </main>
      </>
   );
}
