import EuroVotes from "../models/BasketBall/userEuroVotes.js";

export const addEuroPoints = async (id, winner, margin, seasonId) => {
  const votesForGame = await EuroVotes.find({ 'gamePredictions.gameId': id });
  if (votesForGame.length === 0) {
  }

  for (const vote of votesForGame) {
    const userId = vote.userId;

    for (const prediction of vote.gamePredictions) {

      if (prediction.gameId == id) {

        let points = 0;
        let yeallowGuess = 0;
        let darkGreenGuess = 0;
        let lightGreenGuess = 0;
        let orangeGuess = 0;
        let purpleGuess = 0;
        let pinkGuess = 0;
        let cyanGuess = 0;

        if (prediction.winner == winner) {
          points += 7;
          darkGreenGuess += 1;
        }
        if (prediction.margin == margin) {
          points += 8;
          yeallowGuess += 1;
        }
        if (prediction.margin - 1 == margin || prediction.margin + 1 == margin) {
          points += 5;
          lightGreenGuess += 1;
        }
        if (prediction.margin - 2 == margin || prediction.margin + 2 == margin) {
          points += 4;
          cyanGuess += 1;
        }
        if (prediction.margin - 3 == margin || prediction.margin + 3 == margin) {
          points += 3;
          orangeGuess += 1;
        }
        if (prediction.margin - 4 == margin || prediction.margin + 4 == margin) {
          points += 2;
          purpleGuess += 1;
        }
        if (prediction.margin - 5 == margin || prediction.margin + 5 == margin) {
          points += 1;
          pinkGuess += 1;
        }

        await EuroVotes.findOneAndUpdate(
          { userId, seasonId },
          {
            $inc: {
              points,
              yellowGuess: yeallowGuess,
              darkGreenGuess: darkGreenGuess,
              lightGreenGuess: lightGreenGuess,
              orangeGuess: orangeGuess,
              purpleGuess: purpleGuess,
              pinkGuess: pinkGuess,
              cyanGuess: cyanGuess,
            }
          },
          { upsert: true }
        );
      }
    }
  }
}

export const AddPointsForTop4Guess = async (seasonId, top4Teams) => {
  const votes = await EuroVotes.find({ 'seasonId': seasonId });
  if (votes.length === 0) {
    return;
  }

  for (const vote of votes) {
    let points = 0;
    let yeallowGuess = 0;
    let greyGuess = 0;
    let lightGreenGuess = 0;
    let cyanGuess = 0;
    let orangeGuess = 0;

    const userId = vote.userId;

    if (vote.top4Teams[0] == top4Teams[0]) {
      points += 8;
      yeallowGuess +=1;
    }
    if (vote.top4Teams[1] == top4Teams[1]) {
      points += 5;
      lightGreenGuess +=1;
    }
    if (vote.top4Teams[2] == top4Teams[2]) {
      points += 4;
      cyanGuess +=1;
    }
    if (vote.top4Teams[3] == top4Teams[3]) {
      points += 3;
      orangeGuess +=1;
    }


    for (let i = 0; i < vote.top4Teams.length; i++) {
      if (top4Teams.includes(vote.top4Teams[i])) {
        points += 6;
        greyGuess +=1;
      }
    }
    await EuroVotes.findOneAndUpdate(
      { userId, seasonId },
      { $inc: { points,
        yellowGuess: yeallowGuess,
        greyGuess: greyGuess,
        cyanGuess: cyanGuess,
        lightGreenGuess: lightGreenGuess,
        orangeGuess: orangeGuess,
       } },
      { upsert: true } // Create new if not exists
    );
  }
}