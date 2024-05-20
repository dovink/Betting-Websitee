import EuroGames from "../models/EuroleagueGames.js";
import Season from "../models/euroBasketChampionSeason.js"
import EuroVotes from "../models/userEuroVotes.js";
import {addEuroPoints, AddPointsForTop4Guess} from "../util/pointsCal.js";


export const createSeason = async (req, res) => {
  try {
    const { name, year, participatingTeams } = req.body;
    const newSeason = new Season({ name, year, participatingTeams });
    await newSeason.save();

    res.status(201).send({ message: 'Sezonas sukurtas sekmingai', season: newSeason });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getCurrentSeason = async(req,res) => {
  try {
    const currentSeason = await Season.findOne({ current: true }); 
    if (!currentSeason) {
      return res.status(404).send({ message: 'Sezonas nerastas' });
    }
    res.status(200).send({ season: currentSeason });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getSeasons = async (req,res) => {
  try {
    const seasons = await Season.find();
    res.status(200).send({ seasons });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getSeasonTeams = async(req,res) =>{
  try {
    const { seasonId } = req.params;
    const season = await Season.findById(seasonId);
    if (!season) {
      return res.status(404).send({ message: 'Season not found' });
    }
    res.status(200).send({ teams: season.participatingTeams });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const makeTop4Guess = async (req,res) => {
  try{
    const {seasonId} = req.params;
    const {top4Teams} = req.body;
    const userId = req.userId;
    
    const existingGuess = await EuroVotes.findOne({ userId, seasonId });
    if (existingGuess && existingGuess.hasGuessedTop4) {
      return res.status(400).send({ message: 'Spejimas kas pateks i TOP4 jau atliktas' });
    }

    if (!existingGuess) {
      const newGuess = new EuroVotes({ userId, seasonId, top4Teams, hasGuessedTop4: true });
      await newGuess.save();
    } else {
      existingGuess.top4Teams = top4Teams;
      existingGuess.hasGuessedTop4 = true;
      await existingGuess.save();
    }
    res.status(201).send({ message: 'Sekmingai atliktas top 4 komandu spejimas' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getGamesForSeason = async (req,res) => {
  try {
    const { seasonId } = req.params;
    const games = await EuroGames.find({seasonId});
    if(!games){
      return res.status(404).send({message: "Nerasta zaidimu"});
    }
    res.status(200).send({ games });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const AddEuroGame = async (req, res) => {
    try {
      const {seasonId} = req.params;
      const {homeTeam, awayTeam, startTime } = req.body;


      const startTimeDate = new Date(startTime);

      const game = new EuroGames({ seasonId, homeTeam, awayTeam, startTime: startTimeDate });
      console.log(game);
      await game.save();
      return res.status(201).send(game);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };
 export const updateWinner =  async (req, res) => {
    try {
      const { gameId } = req.params;
      const { winner, winningMargin } = req.body;
      const game = await EuroGames.findById(gameId).populate('seasonId');
      if (!game) {
        return res.status(404).send({ message: 'Zaidimas nerastas' });
      }
      if(game.pointsUpdated)
      {
        return res.status(404).send({message: "Zaidimo rezultatai jau irasyti"})
      }

      const seasonId = game.seasonId._id;

      game.winner = winner;
      game.winningMargin = winningMargin;
      game.pointsUpdated = true;
      await game.save();
 
      await addEuroPoints(gameId, winner, winningMargin, seasonId);

      return res.send(game);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };
 
  export const putEuroVote = async (req,res) => {
    try{
     const { gameId } = req.params;
     const userId = req.userId;
     const { winner, margin } = req.body;
 
     // ar zaidimas egzistuoja
     const game = await EuroGames.findById(gameId).populate('seasonId');
     if (!game) {
       return res.status(404).json({ message: 'Zaidimas nerastas' });
     }

     const seasonId = game.seasonId._id;
 
     // Patikrinti ar zaidimas jau prasidejo
     const currentTime = new Date();
     if (currentTime >= game.startTime) {
       return res.status(400).json({ message: 'Zaidimas jau prasidejo' });
     }
 
     const existingVote = await EuroVotes.findOne({ userId, 'gamePredictions.gameId': gameId });
     if (existingVote) {
       return res.status(400).send({ message: 'Uz si zaidima jau balsavote' });
     }
 
     // Sukurti nauja balsa
     const updatedVote = await EuroVotes.findOneAndUpdate(
      { userId,seasonId },
      { $push: { gamePredictions: { gameId, winner, margin} } },
      { new: true, upsert: true }
  );
     await updatedVote.save();
     res.status(201).send(updatedVote);
   } catch (error) {
     res.status(500).send({ message: error.message });
   }
 };

 export const updateTop4Winners = async (req,res) => {
try{
  const { seasonId } = req.params;
  const { top4Teams } = req.body;
  
  const season = await Season.findById(seasonId);

  if(!season) {
    return res.status(404).send({message: "Sezonas nerastas"});
  }

  if(season.Top4Updated)
    {
      season.Top4Updated = false;
      return res.status(409).send({message: "Sezono laimetojai jau irasyti"});
    }

    season.Top4Winners = top4Teams;
    season.Top4Updated = true;

    await season.save();

    await AddPointsForTop4Guess(seasonId, top4Teams);

    return res.status(200).send({message: "Laimetojai sekmingai irasyti"});

 } catch(error){
  return res.status(500).send({message: "Nepavyko irasyti laimetoju"});
 }
};