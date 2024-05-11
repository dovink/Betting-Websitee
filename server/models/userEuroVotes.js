import mongoose from "mongoose";

const EuroVotesScehma = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'euroSeason', required: true },
    top4Teams: [{ type: String }],
    hasGuessedTop4: { type: Boolean, default: false },
    gamePredictions: [{
        gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'EuroGame', required: true },
        winner: { type: String, required: true },
        margin: { type: Number },
      }],
      points: { type: Number, default: 0 },
});

const EuroVotes = mongoose.model("EuroVotes", EuroVotesScehma);

export default EuroVotes;