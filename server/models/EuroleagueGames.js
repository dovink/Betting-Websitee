import mongoose from "mongoose";

const EuroSchema = new mongoose.Schema({
    seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'euroSeason', required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    startTime: { type: Date, required: true },
    pointsUpdated: {
        type: Boolean,
        default: false,
    },
    winner: String,
    winningMargin: Number
});

const EuroGames = mongoose.model("EuroGames", EuroSchema);

export default EuroGames;