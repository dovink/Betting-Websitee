import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const app = express();
import cookieParser from "cookie-parser";
import router from "./routes/AuthRoute.js";
import euroRouter from "./routes/basketEuroRoute.js";

const ATLAS_URL = process.env.ATLAS_URI;

// How To Set DB Name - https://stackoverflow.com/a/74673686
mongoose
   .connect(ATLAS_URL, {})
   .then(() => console.log("Prisijungta prie duombazes"))
   .catch((err) => console.error(err));

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());

app.use("/", router);
app.use("/", euroRouter);
