import { login, register } from "../Controllers/AuthController.js";
import express from "express";

const router = express.Router();

router.post("/", register);
//router.post('/', login);

export default router;
