import express from "express";

// This will help us connect to the database
import db from "../db/connections.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// get all data
router.get("/", async (req, res) => {
   // records - database collection pavadinimas
   let collection = await db.collection("records");
   let results = await collection.find({}).toArray();
   res.send(results).status(200);
});

// user POST data to db
// TODO: encryptinti passworda, server-side validacija,
// patikrinti ar password yra toks pat kaip confirm-password (atitinka slaptazodziai)
router.post("/", async (req, res) => {
   try {
      let newDocument = {
         name: req.body.name,
         email: req.body.email,
         city: req.body.city,
         password: req.body.password,
      };

      let collection = await db.collection("records");
      let result = await collection.insertOne(newDocument);
      res.send(result).status(200);
   } catch (err) {
      console.error(err);
      res.status(500).send("Error creating a new user");
   }
});

export default router;
