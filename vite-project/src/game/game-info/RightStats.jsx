import React, { useState, useContext, useEffect } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"



const RightStats = () => {


    const { userBestScore, topScore, userHasTop, totalScore, userBeatTop, userBeatPersonalBest, currentUser } = useContext(UserContext)
    const { handleSaveEarlyPrompt } = useContext(GameContext);






    const getScoreMessage = () => {
        if (userBestScore && !userBeatPersonalBest) {
            return `Your Best Score:${userBestScore.score} `
        } else if (userBeatPersonalBest) {
            return 'You Beat Your Best Score!'
        } else if (userBeatTop) {
            return `You've Beat The Top Score!`
        } else if (userHasTop) {
            return `You Hold the Top Record of ${topScore.score}`
        } else {
            return `You Have No Saved Score`
        }

    }

    const getSaveScoreButtonJSX = () => {
        if (((!topScore && (totalScore > 0)) ||
            (currentUser && (totalScore > userBestScore.score)) ||
            ((totalScore > 0) && (!userBestScore)) ||
            (currentUser && (totalScore > topScore.score)))) {
            return (<button className="game-play-button" onClick={handleSaveEarlyPrompt}>Save Score Now</button>)
        }
    }

    return (
        <div className="game-right-stat-container">
            <div className="game-user-score"> Score: {totalScore}</div>
            <div className="game-score-message">{getScoreMessage()}</div>
            {getSaveScoreButtonJSX()}


        </div>
    );
};

export default RightStats;