import React, { useContext } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"

/**
 * Component for displaying right-side game statistics, including current score,
 * score messages, and an option to save the score early.
 *
 * @component
 * @return {JSX.Element} The right-side game statistics JSX.
 */
const RightStats = () => {


    const { userBestScore, topScore, userHasTop, totalScore, userBeatTop, userBeatPersonalBest, currentUser } = useContext(UserContext)
    const { handleSaveEarlyPrompt } = useContext(GameContext);


    /**
     * Determines the score message based on game outcomes.
     * @returns {string} The score message.
     */
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


    /**
 * Generates JSX for the save score button based on conditions.
 * @returns {JSX.Element|null} The save score button JSX, or null.
 */
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