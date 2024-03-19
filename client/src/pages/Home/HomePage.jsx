import { Link } from "react-router-dom";

export default function HomePage() {
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
      </div>
   );
}
