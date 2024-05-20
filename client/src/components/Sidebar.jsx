import Basketball from "./Basketball";
import Football from "./Football";

export default function Sidebar({ onOptionClick }) {
   return (
      <div className="flex flex-col w-2/6 gap-y-10 justify-center">
         <Basketball onOptionClick={onOptionClick} />
         <Football onOptionClick={onOptionClick} />
      </div>
   );
}
