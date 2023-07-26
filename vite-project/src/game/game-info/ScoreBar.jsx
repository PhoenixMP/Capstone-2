import React, { useState, useContext, useEffect } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"


const ScoreBar = () => {

    const { totalScore, setUserBeatTop, setUserBeatPersonalBest, userBeatTop } = useContext(GameContext);
    const { userBestScore, topScore, currentUser } = useContext(UserContext)
    const [percentage, setPercentage] = useState(0)

    console.log


    useEffect(() => {
        const percentage = (totalScore / topScore.score) * 100;
        if (percentage < 100) {
            setPercentage(percentage)
        } else {
            setUserBeatTop(true)
            setPercentage(100)
        }
        if (totalScore > topScore.score) setUserBeatTop(true);
        if (currentUser && (totalScore > userBestScore.score)) setUserBeatPersonalBest(true)
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
            <div className={`score-fill ${userBeatTop ? "user-beat-top" : ""}`} style={scoreBarStyle()}>{totalScore}</div>
            {scoreBarMessage()}
        </div>
    );
};

export default ScoreBar;