import footballSeason from "../models/FootBall/footBallSeason.js";
import FballVotes from "../models/FootBall/footballVotes.js";
import footballGames from "../models/FootBall/footballGames.js";
import {addPointsForGame, AddPointsForTop4Guess} from "../util/footballPoints.js";
import User from "../models/userSchema.js";

export const createFootBallSeason = async (req, res) => {
    try {
        const { name, year, participatingTeams } = req.body;
        const newSeason = new footballSeason({ name, year, participatingTeams });
        await newSeason.save();
        res.status(200).json({ newSeason});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
export const getAllSeasons = async (req, res) => {
    try {
        const seasons = await footballSeason.find();
        res.status(200).send({ seasons });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
export const getCurrentSeason = async (req, res) => {
    try {
        const currentSeason = await footballSeason.findOne({ current: true });
        if (!currentSeason) {
            return res.status(404).send({ message: 'Sezonas nerastas' });
        }
        res.status(200).send({ season: currentSeason });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
export const getSeasonTeams = async (req, res) => {
    try {
        const { seasonId } = req.params;
        const season = await footballSeason.findById(seasonId);
        if (!season) {
            return res.status(404).send({ message: 'Season not found' });
        }
        res.status(200).send({ teams: season.participatingTeams });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const makeTop4Guess = async (req, res) => {
    try {
      const { seasonId } = req.params;
      const { top4Teams } = req.body;
      const userId = req.userId;
  
      const existingGuess = await FballVotes.findOne({ userId, seasonId });
      if (existingGuess && existingGuess.hasGuessedTop4) {
        return res.status(400).send({ message: 'Spejimas kas pateks i TOP4 jau atliktas' });
      }
  
      if (!existingGuess) {
        const newGuess = new FballVotes({ userId, seasonId, top4Teams, hasGuessedTop4: true });
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
  export const getGamesForSeason = async (req, res) => {
    try {
      const { seasonId } = req.params;
      const games = await footballGames.find({ seasonId }).sort({startTime: -1});
      if (!games) {
        return res.status(404).send({ message: "Nerasta zaidimu" });
      }
      res.status(200).send({ games });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  export const AddGame = async (req, res) => {
    try {
      const { seasonId } = req.params;
      const { homeTeam, awayTeam, startTime } = req.body;
  
  
      const startTimeDate = new Date(startTime);
  
      const game = new footballGames({ seasonId, homeTeam, awayTeam, startTime: startTimeDate });
  
      await game.save();
      return res.status(201).send(game);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  export const voteForFootballGame = async (req, res) => {
    try {
      const { gameId } = req.params;
      const userId = req.userId;
      const { winner, winnerTeamScore, loserTeamScore, penaltiesWinner } = req.body;
  
      // ar zaidimas egzistuoja
      const game = await footballGames.findById(gameId).populate('seasonId');
      if (!game) {
        return res.status(404).json({ message: 'Zaidimas nerastas' });
      }
  
      const seasonId = game.seasonId._id;
  
      // Patikrinti ar zaidimas jau prasidejo
      const currentTime = new Date();
      if (currentTime >= game.startTime) {
        return res.status(400).json({ message: 'Zaidimas jau prasidejo' });
      }
  
      const existingVote = await FballVotes.findOne({ userId, 'gamePredictions.gameId': gameId });
      if (existingVote) {
        return res.status(400).send({ message: 'Uz si zaidima jau balsavote' });
      }
  
      // Sukurti nauja balsa
      const updatedVote = await FballVotes.findOneAndUpdate(
        { userId, seasonId },
        { $push: { gamePredictions: { gameId, winner, winnerTeamScore, loserTeamScore, penaltiesWinner } } },
        { new: true, upsert: true }
      );
      await updatedVote.save();
      res.status(201).send(updatedVote);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  export const updateWinner = async (req, res) => {
    try {
      const { gameId } = req.params;
      const { winner, winnerTeamScore, loserTeamScore, penaltiesWinner } = req.body;
      const game = await footballGames.findById(gameId).populate('seasonId');
      if (!game) {
        return res.status(404).send({ message: 'Zaidimas nerastas' });
      }
      if (game.pointsUpdated) {
        return res.status(404).send({ message: "Zaidimo rezultatai jau irasyti" })
      }
  
      const seasonId = game.seasonId._id;
  
      game.winner = winner;
      game.winnerTeamScore = winnerTeamScore;
      game.loserTeamScore = loserTeamScore;
      game.penaltiesWinner = penaltiesWinner;
      game.pointsUpdated = true;
      await game.save();
  
      await addPointsForGame(gameId, winner, winnerTeamScore, loserTeamScore, seasonId, penaltiesWinner);
  
      return res.send(game);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  export const updateTop4Winners = async (req, res) => {
    try {
      const { seasonId } = req.params;
      const { top4Teams } = req.body;
  
      const season = await footballSeason.findById(seasonId);
  
      if (!season) {
        return res.status(404).send({ message: "Sezonas nerastas" });
      }
  
      if (season.Top4Updated) {
        season.Top4Updated = false;
        return res.status(409).send({ message: "Sezono laimetojai jau irasyti" });
      }
  
      season.Top4Winners = top4Teams;
      season.Top4Updated = true;
  
      await season.save();
  
      await AddPointsForTop4Guess(seasonId, top4Teams);
  
      return res.status(200).send({ message: "Laimetojai sekmingai irasyti" });
  
    } catch (error) {
      return res.status(500).send({ message: "Nepavyko irasyti laimetoju" });
    }
  };

  export const LeaderBoard = async (req,res) => {
    const {seasonId} = req.params;
    try{
      const topUsers = await FballVotes.find({ seasonId })
      .sort({ points: -1 })
      .limit(5);

      const populatedTopUsers = await Promise.all(topUsers.map(async (vote) => {
        const user = await User.findById(vote.userId).select('name');
        return {
          ...vote.toObject(),
          userName: user ? user.name : 'Nezinomas',
        };
      }));
  
      if (!topUsers) {
        return res.status(404).json({ message: "Nera priskirtu tasku uz si sezona" });
      }
      res.status(200).json({ topUsers: populatedTopUsers });

    }catch(error){
      return res.status(500).json({message: "Nepavyko gauti rezultatu"})
    }
  }