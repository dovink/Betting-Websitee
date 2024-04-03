import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const validation = (form, setEmailErr, setPasswordErr) => {
   // resetina input border spalvas
   document.getElementById("email").classList.remove("ring-red-600");
   document.getElementById("password").classList.remove("ring-red-600");
   // resetina error messages
   setEmailErr("");
   setPasswordErr("");

   let noError = true;
   if (!form.email) {
      noError = false;
      setEmailErr("El. pašto laukelis negali būti tuščias.");
      document.getElementById("email").classList.add("ring-red-600");
   }
   if (!form.password) {
      noError = false;
      setPasswordErr("Slaptažodžio laukelis negali būti tuščias.");
      document.getElementById("password").classList.add("ring-red-600");
   }

   // jeigu validacija sekminga - grazina true
   return noError;
};

export default function index() {
   const [form, setForm] = useState({
      email: "",
      password: "",
   });
   const [emailErr, setEmailErr] = useState("");
   const [passwordErr, setPasswordErr] = useState("");
   // server-side response message
   const [serverErr, setServerErr] = useState("");
   const navigate = useNavigate();

   function updateForm(value) {
      return setForm((prev) => {
         return { ...prev, ...value };
      });
   }

   async function onSubmit(e) {
      e.preventDefault();
      // resetinti error message
      setServerErr("");

      const success = validation(form, setEmailErr, setPasswordErr);
      if (!success) return;

      try {
         let response = await fetch("http://localhost:5050/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
         });

         if (!response.ok) {
            const responseText = await response.text();
            setServerErr(responseText);
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         console.log("User logged in successfully!");
         navigate("/");
      } catch (err) {
         console.error(`A problem occured with log in operation: ${err}`);
      } finally {
         setForm({
            email: "",
            password: "",
         });
      }
   }

   return (
      <div className="bg-slate-100 h-lvh pt-52">
         <div className="max-w-md mx-auto bg-white px-12 py-10 rounded-lg shadow-md">
            <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-10">
               Prisijungimas
            </h1>
            <form onSubmit={onSubmit} className="grid gap-3" noValidate>
               <div>
                  <label
                     htmlFor="email"
                     className="block text-sm font-medium leading-6 text-gray-900"
                  >
                     El. paštas:
                  </label>
                  <input
                     type="email"
                     name="email"
                     id="email"
                     className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none"
                     value={form.email}
                     onChange={(e) => updateForm({ email: e.target.value })}
                  />
                  {emailErr && (
                     <p className="mt-2 text-sm text-red-600">{emailErr}</p>
                  )}
               </div>
               <div>
                  <label
                     htmlFor="password"
                     className="block text-sm font-medium leading-6 text-gray-900"
                  >
                     Slaptažodis:
                  </label>
                  <input
                     type="password"
                     name="password"
                     id="password"
                     className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none"
                     value={form.password}
                     onChange={(e) => updateForm({ password: e.target.value })}
                  />
                  {passwordErr && (
                     <p className="mt-2 text-sm text-red-600">{passwordErr}</p>
                  )}
               </div>
               <input
                  type="submit"
                  value="Prisijungti"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
               />
            </form>
            {serverErr && (
               <p className="mt-2 text-sm text-red-600">{serverErr}</p>
            )}
            <p className="mt-8 text-center text-sm text-gray-500">
               Nesate prisiregistravę?
               <Link
                  to="/register"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
               >
                  Registruotis
               </Link>
            </p>
         </div>
      </div>
   );
}
