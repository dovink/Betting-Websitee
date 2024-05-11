import EuroVotes from "../models/userEuroVotes.js";

const addEuroPoints = async (id, winner, margin, seasonId) => {
    const votesForGame = await EuroVotes.find({ 'gamePredictions.gameId': id });
    if (votesForGame.length === 0) {
      }

      for (const vote of votesForGame) {
        const userId = vote.userId;

        for(const prediction of vote.gamePredictions){

          if(prediction.gameId == id){

            let points = 0;
              if (prediction.winner == winner) {
                points += 7;
              }
                if (prediction.margin == margin) {
                  points += 8;
                }
                if(prediction.margin -1  == margin || prediction.margin + 1  == margin)
                {
                    points+=5;
                }
                if(prediction.margin -2  == margin || prediction.margin + 2  == margin)
                {
                    points+=4;
                }
                if(prediction.margin -3  == margin || prediction.margin + 3  == margin)
                {
                    points+=3;
                }
                if(prediction.margin -4  == margin || prediction.margin + 4  == margin)
                {
                    points+=2;
                }
                if(prediction.margin -5  == margin || prediction.margin + 5  == margin)
                {
                    points+=1;
                }

      await EuroVotes.findOneAndUpdate(
        { userId, seasonId },
        { $inc: { points } },
        { upsert: true } // Create new if not exists
      );
      }
    }
  }
}
export default addEuroPoints;