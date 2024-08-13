import React, { useEffect, useState } from 'react'
import yeallowOctupus from "../assets/geltonas.svg";
import darkGreenOctupus from "../assets/tamsiai žalias.svg";
import greyOctupus from "../assets/pilkas.svg";
import lightGreenOctupus from "../assets/šviesiai žalias.svg";
import cyanOctupus from "../assets/mėlynas.svg";
import orangeOctupus from "../assets/oranžinis.svg";
import purpleOctupus from "../assets/violetinis.svg";
import pinkOctupus from "../assets/rožinis.svg";


const UserRank = ({season}) => {
    const [UserInfo, setUserInfo] = useState(null);


    useEffect(() => {
        const fetchUserRank = async () => {
            try {
                const response = await fetch(`http://localhost:5050/footballSeason/${season._id}/userRank`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'content-type': 'application/json',
                    },
                })
                if (response.ok) {
                    const data = await response.json()
                    setUserInfo(data.userInfo);
                }else{
                    setUserInfo(null);
                }
            } catch (error) {
            }
        }
        if (season) {
            fetchUserRank();
        }

    }, [season])
    if (!UserInfo) {
        return <div>Šiame sezone nedalyvavot</div>;
    }
    const guesses = [
        { color: "bg-yellow-400", count: UserInfo.yellowGuess, img: yeallowOctupus },
        { color: "bg-green-900", count: UserInfo.darkGreenGuess, img: darkGreenOctupus },
        { color: "bg-gray-400", count: UserInfo.greyGuess, img: greyOctupus },
        { color: "bg-green-500", count: UserInfo.lightGreenGuess, img: lightGreenOctupus },
        { color: "bg-cyan-500", count: UserInfo.cyanGuess, img: cyanOctupus },
        { color: "bg-orange-500", count: UserInfo.orangeGuess, img: orangeOctupus },
        { color: "bg-purple-600", count: UserInfo.purpleGuess, img: purpleOctupus },
        { color: "bg-pink-400", count: UserInfo.pinkGuess, img: pinkOctupus },
    ];
    return (
        <div className="flex flex-col items-center bg-white p-4 w-96">
            {/* User Name */}
            <div className="text-center font-bold text-2xl mb-4 border-2 border-black w-full h-12 ">{UserInfo.userName}</div>

            {/* Championship */}
            <div className="flex justify-between w-full mb-4">
                <div className="text-center border-2 border-black rounded-lg p-2 bg-white w-1/2 mr-2 block">
                <span>{season.year}</span><br></br>
                <span className='block text-left break-words'>{season.name}</span>
                </div>
                <div className="text-center border-2 border-black bg-yellow-500 rounded-lg p-2 w-1/2 mr-2">
                    <span className="text-xl">Vieta:</span> <br></br>
                    <span className="font-bold text-3xl ml-2">{UserInfo.rank}</span>
                </div>
            </div>

            {/* Points */}
            <div className="text-center font-bold text-4xl mb-1 border-2 border-black w-full">{UserInfo.points}</div>

            {/* Guess Indicators */}
            <div className="flex justify-between border-2 border-black h-16 w-full">
                {guesses.map((guess, index) => (
                    <div key={index} className="flex flex-col items-center mt-1">
                        <div className={`w-8 h-8 ${guess.color} border-2 border-black rounded-lg mb-1 flex items-center justify-center`}>
                            <img src={guess.img} alt='' className='w-full h-full rounded'></img>
                        </div>
                        <div className="text-sm font-bold">{guess.count}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserRank