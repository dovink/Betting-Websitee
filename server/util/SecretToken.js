import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createSecretToken = (id) => {
   try {
      return jwt.sign({ id }, process.env.TOKEN_KEY, {
         expiresIn: "1d", 
      });
   } catch (error) {
      console.error("Error generating token:", error);
      throw new Error("Failed to generate token");
   }
};

export default createSecretToken;
