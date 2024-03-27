import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const validation = (
   form,
   setNameErr,
   setEmailErr,
   setCityErr,
   setPasswordErr,
   setConfirmPassErr
) => {
   // https://stackoverflow.com/a/12019115
   const usernameRegex =
      /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
   // https://stackoverflow.com/a/46181
   const emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   // https://stackoverflow.com/a/21456918
   const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
   // sarasas miestu kuriuos galima pasirinkti
   const validCities = [
      "alytus",
      "kaunas",
      "klaipeda",
      "marijampole",
      "panevezys",
      "siauliai",
      "taurage",
      "telsiai",
      "utena",
      "vilnius",
   ];

   // resetina input border spalvas
   document.getElementById("name").classList.remove("ring-red-600");
   document.getElementById("email").classList.remove("ring-red-600");
   document.getElementById("password").classList.remove("ring-red-600");
   document.getElementById("confirm_password").classList.remove("ring-red-600");
   document.getElementById("city-select").classList.remove("ring-red-600");
   // resetina error messages
   setNameErr("");
   setEmailErr("");
   setPasswordErr("");
   setConfirmPassErr("");
   setCityErr("");

   let noError = true;
   if (!usernameRegex.test(form.name)) {
      // jeigu noError yra false, tai validacija nesekminga ir nebus POST requesto
      noError = false;
      // Error message for UI
      setNameErr("Neteisingas vardas. Vardas sudaromas bent iš 5 raidžių.");
      // Pakeicia input border i raudona spalva
      document.getElementById("name").classList.add("ring-red-600");
   }
   if (!emailRegex.test(form.email)) {
      noError = false;
      setEmailErr("El. pašto adresas nėra teisingas.");
      document.getElementById("email").classList.add("ring-red-600");
   }
   if (!passwordRegex.test(form.password)) {
      noError = false;
      setPasswordErr(
         "Neteisingas slaptažodis. Slaptažodis privalo turėti bent vieną skaičių, vieną specialų simbolį ir būti sudarytas iš 8 simbolių."
      );
      document.getElementById("password").classList.add("ring-red-600");
   }
   if (!form["confirm_pass"]) {
      noError = false;
      setConfirmPassErr("Laukelis negali būti tuščias.");
      document.getElementById("confirm_password").classList.add("ring-red-600");
   } else if (form.password !== form["confirm_pass"]) {
      noError = false;
      setConfirmPassErr("Slaptažodžiai nesutampa.");
      document.getElementById("confirm_password").classList.add("ring-red-600");
   }

   // jeigu parinktas miestas neieina i sarasa, grazina klaida
   let found = false;
   for (const city of validCities) {
      if (form.city === city) {
         found = true;
         break;
      }
   }

   if (!found) {
      noError = false;
      setCityErr("Prašome pasirinkti tinkamą miestą.");
      document.getElementById("city-select").classList.add("ring-red-600");
   }

   // returns true jeigu sekmingai pereina validacija
   return noError;
};

export default function index() {
   // formos duomenys
   const [form, setForm] = useState({
      name: "",
      email: "",
      city: "",
      password: "",
      confirm_pass: "",
   });
   // Error messages for UI
   const [nameErr, setNameErr] = useState("");
   const [emailErr, setEmailErr] = useState("");
   const [cityErr, setCityErr] = useState("");
   const [passwordErr, setPasswordErr] = useState("");
   const [confirmPassErr, setConfirmPassErr] = useState("");
   // server-side response message
   const [serverErr, setServerErr] = useState("");
   // skirta puslapio navigacijai
   const navigate = useNavigate();

   // skirta onChange formai
   function updateForm(value) {
      return setForm((prev) => {
         return { ...prev, ...value };
      });
   }

   // HTTP POST request'as
   // issiuncia uzpildytus formos duomenis
   async function onSubmit(e) {
      // nerefreshina puslapio po submit mygtuko paspaudimo
      e.preventDefault();
      setServerErr("");

      // jeigu nepraeina validacijos, grazina false ir programa sustabdo darba
      const success = validation(
         form,
         setNameErr,
         setEmailErr,
         setCityErr,
         setPasswordErr,
         setConfirmPassErr
      );
      if (!success) {
         return;
      }

      // console.log("validacija yra sekminga");

      try {
         let response = await fetch("http://localhost:5050/", {
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

         console.log("User was created successfully!");
         navigate("/login");
      } catch (err) {
         console.error("A problem occurred with register operation: ", err);
      } finally {
         // resetina formos useState
         setForm({
            name: "",
            email: "",
            city: "",
            password: "",
            confirm_pass: "",
         });
      }
   }

   // puslapio UI
   return (
      <div className="max-w-md mx-auto mt-40">
         <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-10">
            Registracija
         </h1>
         <form onSubmit={onSubmit} className="grid gap-3" noValidate>
            <div>
               <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
               >
                  Vardas:
               </label>
               <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
               />
               {nameErr && (
                  <p className="mt-2 text-sm text-red-600">{nameErr}</p>
               )}
            </div>
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
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.email}
                  onChange={(e) => updateForm({ email: e.target.value })}
               />
               {emailErr && (
                  <p className="mt-2 text-sm text-red-600">{emailErr}</p>
               )}
            </div>
            <div>
               <label className="block text-sm font-medium leading-6 text-gray-900">
                  Miestas (apskritis):
               </label>
               <select
                  name="cities"
                  id="city-select"
                  value={form.city}
                  onChange={(e) => updateForm({ city: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
               >
                  <option value="" disabled={true}>
                     --Prašome pasirinkti miestą--
                  </option>
                  <option value="alytus">Alytus</option>
                  <option value="kaunas">Kaunas</option>
                  <option value="klaipeda">Klaipėda</option>
                  <option value="marijampole">Marijampolė</option>
                  <option value="panevezys">Panevėžys</option>
                  <option value="siauliai">Šiauliai</option>
                  <option value="taurage">Tauragė</option>
                  <option value="telsiai">Telšiai</option>
                  <option value="utena">Utena</option>
                  <option value="vilnius">Vilnius</option>
               </select>
               {cityErr && (
                  <p className="mt-2 text-sm text-red-600">{cityErr}</p>
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
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.password}
                  onChange={(e) => updateForm({ password: e.target.value })}
               />
               {passwordErr && (
                  <p className="mt-2 text-sm text-red-600">{passwordErr}</p>
               )}
            </div>
            <div>
               <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium leading-6 text-gray-900"
               >
                  Pakartokite slaptažodį:
               </label>
               <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form["confirm_pass"]}
                  onChange={(e) => updateForm({ confirm_pass: e.target.value })}
               />
               {confirmPassErr && (
                  <p className="mt-2 text-sm text-red-600">{confirmPassErr}</p>
               )}
            </div>
            <input
               type="submit"
               value="Prisiregistruoti"
               className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
            />
         </form>
         {serverErr && <p className="mt-2 text-sm text-red-600">{serverErr}</p>}
         <p className="mt-10 text-center text-sm text-gray-500">
            Jau prisiregistravę?
            <Link
               to="/login"
               className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
            >
               Prisijungti
            </Link>
         </p>
      </div>
   );
}