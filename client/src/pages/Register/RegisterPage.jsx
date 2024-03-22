import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const validation = (form, setErrorMsg, setDisplayError) => {
   // https://stackoverflow.com/a/12019115
   const usernameRegex =
      /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
   // https://stackoverflow.com/a/46181
   const emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   // https://stackoverflow.com/a/21456918
   const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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

   if (!usernameRegex.test(form.name)) {
      setDisplayError(true);
      setErrorMsg(
         "Neteisingas vardas. Vardą turi sudaryti bent 5 simboliai, turi prasidėti ir baigtis raidėmis."
      );
      return false;
   }
   if (!emailRegex.test(form.email)) {
      setDisplayError(true);
      setErrorMsg("El. pašto adresas nėra teisingas.");
      return false;
   }
   if (!passwordRegex.test(form.password)) {
      setDisplayError(true);
      setErrorMsg(
         "Neteisingas slaptažodis. Slaptažodžio ilgis sudaromas bent iš 8 simbolių, iš jų viena raidė turi būti didžioji, kita mažoji, vienas skaičius ir vienas specialus simbolis."
      );
      return false;
   }
   if (form.password !== form["confirm_pass"]) {
      setDisplayError(true);
      setErrorMsg("Slaptažodžiai nesutampa.");
      return false;
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
      setDisplayError(true);
      setErrorMsg("Prašome pasirinkti tinkamą miestą.");
      return false;
   }

   // returns true jeigu sekmingai pereina validacija
   return true;
};

export default function RegisterPage() {
   // formos duomenys
   const [form, setForm] = useState({
      name: "",
      email: "",
      city: "",
      password: "",
      "confirm_pass": "",
   });
   // Error message for UI
   const [errorMsg, setErrorMsg] = useState("Error message");
   const [displayError, setDisplayError] = useState(false);
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

      // jeigu nepraeina validacijos, grazina false ir programa sustabdo darba
      const success = validation(form, setErrorMsg, setDisplayError);
      if (!success) {
         return;
      }

      console.log("validacija yra sekminga");

      try {
         let response = await fetch("http://localhost:5050/", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         console.log("User was created successfully!");
      } catch (err) {
         console.error("A problem occurred with register operation: ", err);
      } finally {
         // resetina formos useState
         setForm({
            name: "",
            email: "",
            city: "",
            password: "",
            "confirm_pass": "",
         });
         // hide error message
         setDisplayError(false);
         // resetint error message
         setErrorMsg("");
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
                  onChange={(e) =>
                     updateForm({ "confirm_pass": e.target.value })
                  }
               />
            </div>
            <input
               type="submit"
               value="Prisiregistruoti"
               className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
            />
         </form>
         {displayError && (
            <p className="mt-5 text-center text-sm text-red-600">{errorMsg}</p>
         )}
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
