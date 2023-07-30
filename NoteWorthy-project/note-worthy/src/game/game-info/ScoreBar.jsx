import React, { useState, useContext, useEffect } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"


const ScoreBar = () => {

    const { userBestScore, topScore, currentUser, totalScore, userBeatTop } = useContext(UserContext)
    const { getGameResults } = useContext(GameContext)
    const [percentage, setPercentage] = useState(0)

    console.log


    useEffect(() => {
        const percentage = (totalScore / topScore.score) * 100;
        if (percentage < 100) {
            setPercentage(percentage)
        } else {
            setPercentage(100)
            getGameResults()
        }

    }, [totalScore])

    const scoreBarStyle = () => {
        if (!userBeatTop) {
            return { width: `${percentage}%`, backgroundColor: 'green' }
        } else {
            return { width: '100%', backgroundColor: 'blue' }
        }
    }


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