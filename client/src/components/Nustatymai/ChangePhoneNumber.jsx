import React, { useState } from 'react'
import UserInfo from '../UserInfo';
import PhoneInput from "react-phone-number-input/input";

const ChangePhoneNumber = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const user = UserInfo();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phoneNumber.length !== 12) {
            setError("Telefono numeris per trumpas")
            setSuccess('')
            return;
        }
        try{
            setError("");
            setSuccess("");
            const response = await fetch ("http://localhost:5050/changePhoneNumber",{
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber }),
            })
            if(!response.ok){
                const errorMessage = await response.text();
                setError(errorMessage);
                return;
            }
            setSuccess("Telefono numeris pakeistas sėkmingai")
            setPhoneNumber('');            
        }catch(error){
            setError(error)
        }
    }

    return (
        <div className="w-2/3 mx-auto mt-5 bg-white p-8 rounded-md shadow-md">
            <p className='mb-6 font-medium'>Dabartinis telefono numeris: <strong className='text-slate-950'>{user.phone}</strong></p>
            <h2 className="text-2xl font-semibold mb-6 text-center">Pakeiskite telefono numerį</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                        Naujas telefono numeris:
                    </label>
                     <PhoneInput
                     id="phoneNumber"
                     country="LT"
                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     value={phoneNumber}
                     onChange={setPhoneNumber}
                     placeholder="370 6XX XXXXX"
                     maxLength="13"
                  />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Pakeisti telefono numerį
                </button>
            </form>
        </div>
    );
}

export default ChangePhoneNumber