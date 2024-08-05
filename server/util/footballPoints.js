import FballVotes from "../models/FootBall/footballVotes.js";


export const addPointsForGame = async (id, winner, winnerTeamScore, loserTeamScore, seasonId, penaltiesWinner) => {
  const votesForGame = await FballVotes.find({ 'gamePredictions.gameId': id });
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

        if (prediction.winnerTeamScore == winnerTeamScore && prediction.loserTeamScore == loserTeamScore) {
          points += 8;
          yeallowGuess +=1;
        }
        if (prediction.winner == winner || prediction.winnerTeamScore == winnerTeamScore && prediction.loserTeamScore == loserTeamScore) {
          points += 7;
          darkGreenGuess += 1;
        }
        if (winnerTeamScore == loserTeamScore && prediction.penaltiesWinner == penaltiesWinner) {
          points += 5;
          lightGreenGuess +=1;
        }
        if (prediction.winner == winner && winnerTeamScore == prediction.winnerTeamScore && yeallowGuess === 0) {
          points += 3;
          orangeGuess +=1;
        }
        if (prediction.winner == winner && loserTeamScore == prediction.loserTeamScore && yeallowGuess === 0) {
          points += 2;
          purpleGuess += 1;
        }
        if (prediction.winner != winner && prediction.loserTeamScore == loserTeamScore || prediction.winner != winner && prediction.winnerTeamScore == winnerTeamScore) {
          points += 1;
          pinkGuess +=1;
        }
        await FballVotes.findOneAndUpdate(
          { userId, seasonId },
          { $inc: {
             points,
             yellowGuess: yeallowGuess,
             darkGreenGuess: darkGreenGuess,
             lightGreenGuess: lightGreenGuess,
             orangeGuess: orangeGuess,
             purpleGuess: purpleGuess,
             pinkGuess: pinkGuess,
             } },
          { upsert: true }
        );
      }
    }
  }
}
export const AddPointsForTop4Guess = async (seasonId, top4Teams) => {
  const votes = await FballVotes.find({ 'seasonId': seasonId });
  if (votes.length === 0) {
    return;
  }

  for (const vote of votes) {
    let points = 0;
    let yeallowGuess = 0;
    let greyGuess = 0;
    let cyanGuess = 0;

    const userId = vote.userId;

    if (vote.top4Teams[0] == top4Teams[0]) {
      points += 8;
      yeallowGuess +=1;
    }
    if (vote.top4Teams[1] == top4Teams[1]) {
      points += 4;
      cyanGuess +=1;
    }
    if (vote.top4Teams[2] == top4Teams[2]) {
      points += 4;
      cyanGuess +=1;
    }
    if (vote.top4Teams[3] == top4Teams[3]) {
      points += 4;
      cyanGuess +=1;
    }


    for (let i = 0; i < vote.top4Teams.length; i++) {
      if (top4Teams.includes(vote.top4Teams[i])) {
        points += 6;
        greyGuess +=1;
      }
    }
    await FballVotes.findOneAndUpdate(
      { userId, seasonId },
      { $inc: {
         points,
         yellowGuess: yeallowGuess,
         greyGuess: greyGuess,
         cyanGuess: cyanGuess,

       } },
      { upsert: true }
    );
  }
}