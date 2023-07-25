import React, { useContext } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"


const ScoreBar = () => {

    const { totalScore } = useContext(GameContext);
    const { topScore } = useContext(UserContext)

    const percentage = (totalScore / topScore.score) * 100;
    console.log(totalScore)
    console.log(topScore)
    console.log(percentage)
    const scoreBarStyle = {
        width: `${percentage}%`,
    };

    return (
        <div className="score-bar">
            <div className="score-fill" style={scoreBarStyle}>{totalScore}</div>
            Top Score: {topScore.score}
        </div>
    );
};

export default ScoreBar;