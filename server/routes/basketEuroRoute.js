import {verifyToken} from "../Controllers/AuthController.js";
import {createSeason, makeTop4Guess, AddEuroGame, updateWinner, putEuroVote } from "../Controllers/EuroChampionShip.js";
import express, { Router } from "express";

const euroRouter = express.Router();

//EuroChampion games
euroRouter.post("/season", verifyToken, createSeason);
euroRouter.post("/makeTop4Guess", verifyToken, makeTop4Guess);
euroRouter.post ("/EuroGame", verifyToken, AddEuroGame);
euroRouter.put ("/EuroGame/:id", verifyToken, updateWinner);
euroRouter.put("/EuroGames/:gameId/vote", verifyToken, putEuroVote);

export default euroRouter;