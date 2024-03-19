import express from "express";
import cors from "cors";
// import records from "./routes/record.js";
import users from "./routes/users.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", users);

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});