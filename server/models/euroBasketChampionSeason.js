import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  year: { type: Number, required: true, unique: true },
  participatingTeams: [{ type: String }],
  Top4Winners: [{type: String}],
});


const euroSeason = mongoose.model("euroSeason", seasonSchema);

export default euroSeason;