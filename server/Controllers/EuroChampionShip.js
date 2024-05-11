import EuroGames from "../models/EuroleagueGames.js";
import Season from "../models/euroBasketChampionSeason.js"
import EuroVotes from "../models/userEuroVotes.js";
import addEuroPoints from "../util/pointsCal.js";


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

export const makeTop4Guess = async (req,res) => {
  try{
    const {seasonId, top4Teams} = req.body;
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

export const AddEuroGame = async (req, res) => {
    try {
      const { seasonId, homeTeam, awayTeam, startTime } = req.body;


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
      const { id } = req.params;
      const { winner, winningMargin } = req.body;
      const game = await EuroGames.findById(id).populate('seasonId');
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
 
      addEuroPoints(id, winner, winningMargin, seasonId);

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

  
 }