import User from "../models/userSchema.js";
import createSecretToken from "../util/SecretToken.js";
import  bcrypt from "bcryptjs";
import { sendConfirmationEmail } from "../util/emailService.js";
import Token from "../models/token.js";
import crypto from "crypto";

export const register = async (req, res, next) => {
  try {
    const { name, email, city, password, confirm_pass} = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).send("Toks useris jau egzistuoja");
    }
    if(password != confirm_pass){
      return res.status(401).send("Pakartotas slaptazodis neatitinka")
    }
    const user = await User.create({name, email,city,password});
    const token = createSecretToken(user._id);


    const tokenConfirm = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex")
    }).save();
    const url = `${process.env.BASE_URL}/${user._id}/verify/${tokenConfirm.token}`;


    await sendConfirmationEmail({
      name: user.name,
      email: user.email,
      city: user.city,
      userId: user._id,
      url: url,
    });
    
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .send({ message: "User signed in successfully", success: true, user });
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

export const verify = async(req,res) => {
  try {
    const user = await User.findOne({_id: req.params.id});
    if (!user) return res.status(400).send({message: "Invalid link"});
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({message: "Invalid link"});
    await User.updateOne({ _id: user._id }, { verified: true });
	  //await token.remove();
    res.status(200).send({message: "Email verified succesfully"});
  } catch(error){
    res.status(500).send({message: "Internal server error"});
  }
};
