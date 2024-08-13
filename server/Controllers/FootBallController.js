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

  export const LeaderBoard = async (req, res) => {
    const { seasonId } = req.params;
    
    try {
      let topUsers = await FballVotes.find({ seasonId });
  
      topUsers.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.yellowGuess !== a.yellowGuess) return b.yellowGuess - a.yellowGuess;
        if (b.darkGreenGuess !== a.darkGreenGuess) return b.darkGreenGuess - a.darkGreenGuess;
        if (b.greyGuess !== a.greyGuess) return b.greyGuess - a.greyGuess;
        if (b.lightGreenGuess !== a.lightGreenGuess) return b.lightGreenGuess - a.lightGreenGuess;
        if (b.cyanGuess !== a.cyanGuess) return b.cyanGuess - a.cyanGuess;
        if (b.orangeGuess !== a.orangeGuess) return b.orangeGuess - a.orangeGuess;
        if (b.purpleGuess !== a.purpleGuess) return b.purpleGuess - a.purpleGuess;
        if (b.pinkGuess !== a.pinkGuess) return b.pinkGuess - a.pinkGuess;
        return 0;
      });
  
      topUsers = topUsers.slice(0, 5);
  
      const populatedTopUsers = await Promise.all(topUsers.map(async (vote) => {
        const user = await User.findById(vote.userId).select('name');
        return {
          ...vote.toObject(),
          userName: user ? user.name : 'Nezinomas',
        };
      }));
  
      if (!topUsers || topUsers.length === 0) {
        return res.status(404).json({ message: "Nera priskirtu tasku uz si sezona" });
      }
  
      res.status(200).json({ topUsers: populatedTopUsers });
    } catch (error) {
      return res.status(500).json({ message: "Nepavyko gauti rezultatu" });
    }
  };
  export const GetUserRank = async (req, res) => {
    const { seasonId } = req.params;
    const userId = req.userId;

  
    try {
      let allUsers = await FballVotes.find({ seasonId });

      allUsers.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.yellowGuess !== a.yellowGuess) return b.yellowGuess - a.yellowGuess;
        if (b.darkGreenGuess !== a.darkGreenGuess) return b.darkGreenGuess - a.darkGreenGuess;
        if (b.greyGuess !== a.greyGuess) return b.greyGuess - a.greyGuess;
        if (b.lightGreenGuess !== a.lightGreenGuess) return b.lightGreenGuess - a.lightGreenGuess;
        if (b.cyanGuess !== a.cyanGuess) return b.cyanGuess - a.cyanGuess;
        if (b.orangeGuess !== a.orangeGuess) return b.orangeGuess - a.orangeGuess;
        if (b.purpleGuess !== a.purpleGuess) return b.purpleGuess - a.purpleGuess;
        if (b.pinkGuess !== a.pinkGuess) return b.pinkGuess - a.pinkGuess;
        return 0;
      });
  
      const userIndex = allUsers.findIndex(vote => vote.userId.toString() === userId.toString());
      if (userIndex === -1) {
        return res.status(404).json({ message: "Vartotojas nerastas" });
      }
  
      const userRank = userIndex + 1;
      const userVote = allUsers[userIndex];
  
      const user = await User.findById(userId).select('name');
  
      const userInfo = {
        userId: userVote.userId,
        userName: user ? user.name : 'Nežinomas',
        seasonId: userVote.seasonId,
        top4Teams: userVote.top4Teams,
        hasGuessedTop4: userVote.hasGuessedTop4,
        gamePredictions: userVote.gamePredictions,
        points: userVote.points,
        yellowGuess: userVote.yellowGuess,
        darkGreenGuess: userVote.darkGreenGuess,
        greyGuess: userVote.greyGuess,
        lightGreenGuess: userVote.lightGreenGuess,
        cyanGuess: userVote.cyanGuess,
        orangeGuess: userVote.orangeGuess,
        purpleGuess: userVote.purpleGuess,
        pinkGuess: userVote.pinkGuess,
        rank: userRank
      };
  
      res.status(200).json({ userInfo });
  
    } catch (error) {
      return res.status(500).json({ message: "Nepavyko gauti vartotojo reitingo" });
    }
  };