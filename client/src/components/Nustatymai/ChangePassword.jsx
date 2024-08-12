import React, { useState } from 'react'

const ChangePassword = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(newPassword !== confirmPassword)
        {
            setError("Pakartotas slaptažodis nesutampa")
        }

        if (!passwordRegex.test(newPassword)) {
            setError(
               "Naujas slaptažodis privalo turėti bent vieną skaičių, vieną specialų simbolį ir būti sudarytas iš 8 simbolių."
            );
         }
        try{
            setError("")
            setSuccess("")

            const response = await fetch ("http://localhost:5050/changePassword", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                })
            })
            if(!response.ok){
                const errorMessage = await response.text();
                setError(errorMessage);
                return;
            }
            setSuccess('Slaptažodis pakeistas sėkmingai!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
        }catch(error){
            setError("Nepavyko pakeisti slaptažodžio")
        }
    }


    return (
        <div className="w-2/3 mx-auto mt-5 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Pakeiskite slaptažodį</h2>
    
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
    
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                Dabartinis slaptažodis
              </label>
              <input
                type="password"
                id="currentPassword"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                Naujas slaptažodis
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Patvirtinkite naują slaptažodį
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
    
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Pakeisti slaptažodį
            </button>
          </form>
        </div>
      );
    }

export default ChangePassword