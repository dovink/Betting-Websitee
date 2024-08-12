import { useState } from "react";
import UserInfo from "../UserInfo";
import ChangePassword from "./ChangePassword";
import ChangePhoneNumber from "./ChangePhoneNumber";


const Nustatymai = () => {
   const user = UserInfo();

   const [changeForm, setChangeForm] = useState(false);
   const [numberForm, setNumberForm] = useState(false);

   const onClickToChangePassword = () => {
      setChangeForm(!changeForm);
      setNumberForm(false);
   }
   const onClickToChangePhoneNumber = () => {
      setNumberForm(!numberForm);
      setChangeForm(false);
   }
   return (
      <>
         <div className="mt-4">
            <p className="mb-4">Prisijungimo vardas: <strong> {user.name}</strong></p>
            <p className="mb-2">Elektroninis paštas: <strong>{user.email}</strong></p>
            <button onClick={onClickToChangePassword} className={`border-2 border-black w-80 h-10 relative hover:border-dotted ${changeForm && "border-dotted bg-slate-500"}`}>Slaptažodžio keitimas</button>
            <button onClick={onClickToChangePhoneNumber} className={`border-2 border-black w-80 h-10 relative hover:border-dotted ml-12 ${numberForm && "border-dotted bg-slate-500"}`}> Telefonas </button>
            {changeForm &&
               <ChangePassword />
            }
            {numberForm && 
            <ChangePhoneNumber />}

         </div>
      </>
   );
}

export default Nustatymai