import React, { useState, useContext, useEffect } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"



/**
 * @component
 * Component displaying a score bar indicating user's progress towards the top score.
 * If the user beats the top score, a special message is shown.
 * 
 * @returns {JSX.Element} The ScoreBar component.
 */

const ScoreBar = () => {

    const { userBestScore, topScore, currentUser, totalScore, userBeatTop } = useContext(UserContext)
    const { getGameResults } = useContext(GameContext)
    const [percentage, setPercentage] = useState(0)


    // Calculate the percentage and update the fill based on the total score
    useEffect(() => {
        const percentage = (totalScore / topScore.score) * 100;
        if (percentage < 100) {
            setPercentage(percentage)
        } else {
            setPercentage(100)
            getGameResults()
        }
    }, [totalScore])


    // Determine the style of the score bar based on user's performance
    const scoreBarStyle = () => {
        if (!userBeatTop) {
            return { width: `${percentage}%`, backgroundColor: 'green' }
        } else {
            return { width: '100%', backgroundColor: 'blue' }
        }
    }

    // Generate the message displayed below the score bar
    const scoreBarMessage = () => {
        if (!userBeatTop) {
            return (`Top Score: ${topScore.score}`)
        } else {
            return ("🏆You beat the top score!")
        }
    }




    return (
        <div className="score-bar">
            <div className={`score-fill ${userBeatTop ? "user-beat-top" : ""}`} style={scoreBarStyle()}><div className="score-bar-score">{totalScore}</div></div>
            {scoreBarMessage()}
        </div>
    );
};

export default ScoreBar;