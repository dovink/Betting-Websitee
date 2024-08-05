import mongoose from "mongoose";

const seasonSchema = mongoose.Schema({
name: {type: String, required: true, unique: true},
year: {type: Number, required: true},
participatingTeams: [{ type: String, required:true }],
Top4Winners: [{type: String}],
Top4Updated: { type: Boolean, default: false},
});

const footballSeason = mongoose.model("footballSeason", seasonSchema);

export default footballSeason;