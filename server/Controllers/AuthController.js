import User from "../models/userSchema.js";
import createSecretToken from "../util/SecretToken.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
   try {
      const { name, email, city, password, confirm_pass } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(401).send("Toks useris jau egzistuoja");
      }
      if (password != confirm_pass) {
         return res.status(401).send("Pakartotas slaptazodis neatitinka");
      }
      const user = await User.create({ name, email, city, password });
      const token = createSecretToken(user._id);

      // check if token is null
      if (token == null) {
         return res.status(401).send("Nepavyko sukurti tokeno.");
      }

      console.log(token);
      res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
      });
      res.status(201).send("Vartotojas buvo sukurtas sėkmingai.");
      // res.status(201).send({
      //    message: "User signed in successfully",
      //    success: true,
      //    user,
      // });
      next();
   } catch (error) {
      console.error(error);
   }
};

export const login = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(400).send("All fields are required");
      }
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(401).send("Incorrect password or email");
      }
      const auth = await bcrypt.compare(password, user.password);
      if (!auth) {
         return res.status(401).send("Incorrect password or email");
      }
      const token = createSecretToken(user._id);

      // check if token is null
      if (token == null) res.status(401).send("Nepavyko sukurti tokeno.");

      res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
      });
      res.status(201).send("User logged in successfully");
      next();
   } catch (error) {
      console.error(error);
   }
};