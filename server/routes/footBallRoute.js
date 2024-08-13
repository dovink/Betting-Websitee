import express, { Router } from "express";
import {verifyToken} from "../Controllers/AuthController.js";
import {createFootBallSeason, getAllSeasons,getSeasonTeams, makeTop4Guess, getGamesForSeason, AddGame, updateWinner, voteForFootballGame, updateTop4Winners, LeaderBoard, GetUserRank } from "../Controllers/FootBallController.js";


const footBallRouter = express.Router();

footBallRouter.post("/footballSeason", verifyToken, createFootBallSeason);
footBallRouter.post("/footballSeason/:seasonId/makeTop4Guess", verifyToken, makeTop4Guess);
footBallRouter.post("/footballSeason/:seasonId/game", verifyToken, AddGame);

footBallRouter.put("/footballSeason/:gameId/updateWinner", verifyToken,updateWinner);
footBallRouter.put("/footballSeason/:gameId/voteGame", verifyToken, voteForFootballGame);
footBallRouter.put("/footballSeason/:seasonId/updateTop4Winners", verifyToken, updateTop4Winners);

footBallRouter.get("/footballSeasons", verifyToken, getAllSeasons);
footBallRouter.get("/footballSeason/:seasonId/teams",verifyToken, getSeasonTeams);
footBallRouter.get("/footballSeason/:seasonId/games", verifyToken, getGamesForSeason);
footBallRouter.get('/footballSeason/:seasonId/leaders', verifyToken ,LeaderBoard);
footBallRouter.get('/footballSeason/:seasonId/userRank', verifyToken, GetUserRank);


export default footBallRouter;