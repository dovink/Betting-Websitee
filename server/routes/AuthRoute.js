import { login, register,verify } from "../Controllers/AuthController.js";
import express, { Router } from "express";

const router = express.Router();

router.post("/register", register);
router.post('/login', login);
router.get("/:id/verify/:token", verify);

export default router;
