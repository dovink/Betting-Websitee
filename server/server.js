import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const app = express();
import cookieParser from "cookie-parser";
//const cookieParser = require("cookie-parser");
import router from "./routes/AuthRoute.js";
//const authRoute = require("./routes/AuthRoute");
//import users from "./routes/users.js";

const ATLAS_URL = process.env.ATLAS_URI;

mongoose.connect
(ATLAS_URL, {
})
.then(() => console.log("Prisijungta prie duombazes"))
.catch((err) => console.error(err));

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", router);