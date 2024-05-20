import User from "../models/userSchema.js";
import createSecretToken from "../util/SecretToken.js";
import bcrypt from "bcryptjs";
import { sendConfirmationEmail } from "../util/emailService.js";
import Token from "../models/token.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { start } from "repl";

export const register = async (req, res, next) => {
   try {
      const { name, email, phone, password, confirm_pass } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(401).send("Toks useris jau egzistuoja");
      }
      if (password != confirm_pass) {
         return res.status(401).send("Pakartotas slaptazodis neatitinka");
      }

      if (!phone) {
         return res.status(401).send("Telefono numerio laukelis negali būti tuščias.")
      } else if (phone.length != 12) {
         return res.status(401).send("Neteisingas telefono numeris.");
      }

      const user = await User.create({ name, email, phone, password });
      const token = createSecretToken(user._id);

      const tokenConfirm = await new Token({
         userId: user._id,
         token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}/${user._id}/verify/${tokenConfirm.token}`;

      await sendConfirmationEmail({
         name: user.name,
         email: user.email,
         phone: user.phone,
         userId: user._id,
         url: url,
      });

      res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
      });
      res.status(201).send({
         message: "Registracija sekminga",
         success: true,
         user,
      });
      next();
   } catch (error) {
      console.error(error);
   }
};

export const login = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(400).send("Uzpildykite visus laukelius");
      }
      const user = await User.findOne({ email });
      if (!user) {
         return res
            .status(401)
            .send("Neteisingas slaptazodis arba el.pasto adresas");
      }
      const auth = await bcrypt.compare(password, user.password);
      if (!auth) {
         return res
            .status(401)
            .send("Neteisingas slaptazodis arba el.pasto adresas");
      }
      if (!user.verified) {
         return res.status(401).send("Jusu paskyra nera patvirtinta");
      }
      const token = createSecretToken(user._id);

      // check if token is null
      if (token == null) res.status(401).send("Nepavyko sukurti tokeno.");

      res.cookie("token", token, {
         path: "/",
         expires: new Date(Date.now() + 1000 * 300000000),
         httpOnly: true,
      });
      res.status(201).send("Klientas sekmingai prisijunge");
      next();
   } catch (error) {
      console.error(error);
   }
};

export const verify = async (req, res) => {
   try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user)
         return res.status(400).send({ message: "Puslapis neegizstuoja" });
      const token = await Token.findOne({
         userId: user._id,
         token: req.params.token,
      });
      // ismeta 404 klaida, nes react puslapis persirefreshina ir tada tokenas buna jau panaikintas.
      // Atkomentuoti tada kai bus leidziama i production
      // if (!token) return res.status(400).send({message: "Puslapis neegizstuoja"});
      await User.updateOne({ _id: user._id }, { verified: true });
      await Token.findOneAndDelete({ token: req.params.token });
      res.status(200).send({ message: "El.pastas patvirtintas sekmingai" });
   } catch (error) {
      res.status(500).send({ message: "Serverio klaida" });
   }
};
export const verifyToken = (req, res, next) => {
   const cookies = req.headers.cookie;
   if (!cookies) {
      return res.status(404).send({ message: "Nerastas Token" });
   }
   const token = cookies.split("=")[1];
   if (!token) {
      return res.status(404).send({ message: "Nera Token" });
   }
   jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
         return res.status(400).send({ message: "Invalid Token" });
      }
      req.userId = decoded.id;
      next();
   });
};

export const getUser = async (req, res, next) => {
   const userId = req.userId;
   let user;
   try {
      user = await User.findById(userId, "-password");
      if (!user) {
         return res.status(404).send({ message: "User Not Found" });
      }
      return res.status(200).send({ user });
   } catch (err) {
      return next(err);
   }
};
export const logOut = async (req, res) => {
   res.clearCookie("token");
   req.cookies["token"] = "";
   return res.status(200).send({ message: "Atsijungta sekmingai" });
};
