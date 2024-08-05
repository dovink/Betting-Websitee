import mongoose from "mongoose";

const euroPointsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
      },
      points: {
        type: Number,
        default: 0,
      },
});

const euroUserPoints = mongoose.model('euroUserPoints', euroPointsSchema);

export default euroUserPoints;