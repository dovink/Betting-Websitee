import { Link } from "react-router-dom";
import Urvas from "../../assets/urvas.jpg";
import "../../assets/index-page.css";
import NavigationOff from "../../components/NavigationOff";

export default function IndexPage() {
   return (
      <>
         <NavigationOff />
         <main className="mt-28">
            <div className="max-w-screen-xl mx-auto">
               <img src={Urvas} alt="octopus caricature" />
            </div>
         </main>
      </>
   );
}
