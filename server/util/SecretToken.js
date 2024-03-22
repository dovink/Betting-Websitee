import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const createSecretToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
      expiresIn: 3 * 24 * 60 * 60,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return null; // or handle the error in another way
  }
};

export default createSecretToken;