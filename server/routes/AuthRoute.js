import { getUser, login, register, verify, verifyToken, logOut, changePassword, changePhoneNumber } from "../Controllers/AuthController.js";
import express from "express";

const router = express.Router();
// UserAuth
router.post("/register", register);
router.post('/login', login);
router.post('/changePassword', verifyToken, changePassword);
router.post('/changePhoneNumber' ,verifyToken, changePhoneNumber)
router.get("/:id/verify/:token/", verify);
router.get("/home", verifyToken, getUser); // need to add verifyToken to each page that user must be logged in to access
router.post("/logout", logOut);
export default router;