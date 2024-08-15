import {verifyToken} from "../Controllers/AuthController.js";
import {createSeason, makeTop4Guess, AddEuroGame, updateWinner, putEuroVote, updateTop4Winners, getSeasonTeams, getCurrentSeason, getSeasons, getGamesForSeason, LeaderBoard, GetUserRank } from "../Controllers/EuroChampionShip.js";
import express, { Router } from "express";

const euroRouter = express.Router();

//EuroChampion games
euroRouter.post("/season", verifyToken, createSeason);
euroRouter.post("/season/:seasonId/top4guess", verifyToken, makeTop4Guess);
euroRouter.post ("/season/:seasonId/game", verifyToken, AddEuroGame);

euroRouter.put ("/game/:gameId/update-winner", verifyToken, updateWinner);
euroRouter.put("/game/:gameId/vote", verifyToken, putEuroVote);
euroRouter.put("/season/:seasonId/end-season", verifyToken, updateTop4Winners);

euroRouter.get("/season/:seasonId/teams", verifyToken, getSeasonTeams);
euroRouter.get('/season/current',verifyToken, getCurrentSeason);
euroRouter.get('/seasons', verifyToken, getSeasons);
euroRouter.get('/season/:seasonId/games', verifyToken, getGamesForSeason);
euroRouter.get('/top-users/:seasonId', verifyToken ,LeaderBoard);
euroRouter.get('/season/:seasonId/userRank', verifyToken, GetUserRank);

export default euroRouter;