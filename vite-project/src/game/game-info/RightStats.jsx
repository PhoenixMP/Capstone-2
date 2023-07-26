import React, { useState, useContext, useEffect } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"



const RightStats = () => {

    const { totalScore, setUserBeatTop, userBeatTop, userBeatPersonalBest } = useContext(GameContext);
    const { userBestScore, topScore, userHasTop, currentUser, toggleLoginForm } = useContext(UserContext)




    const getScoreMessage = () => {
        if (userBestScore && !userBeatPersonalBest) {
            return `Your Best Score:${userBestScore.score} `
        } else if (userBeatTop) {
            return `You've Beat The Top Score`
        } else if (userHasTop) {
            return `You Hold the Top Record of ${topScore.score}`
        }

    }

    const checkUserScore = () => {

        if (userBestScore || userHasTop) {
            return (
                <div className="game-score-message">{getScoreMessage()}</div>
            )
        }
    }




    return (
        <div className="game-right-stat-container">
            <div className="game-user-score"> Score: {totalScore}</div>
            {checkUserScore()}

        </div>
    );
};

export default RightStats;