import mongoose from "mongoose";

const footballSchema = new mongoose.Schema({
    seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'footballSeason', required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    startTime: { type: Date, required: true },
    penaltiesWinner: String,
    pointsUpdated: { type: Boolean, default: false },
    winner: String,
    winnerTeamScore: Number,
    loserTeamScore: Number,
});

const footballGames = mongoose.model("footballGames", footballSchema);

export default footballGames;