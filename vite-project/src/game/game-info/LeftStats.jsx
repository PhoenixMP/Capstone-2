import React, { useState, useContext, useEffect } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"
import GameButtons from "./GameButtons"


const LeftStats = () => {

    const { totalScore, timer } = useContext(GameContext);
    const { userBestScore, setUserBeatPersonalBest, topScore, setUserBeatTop, userBeatTop } = useContext(UserContext)





    return (

        <div className="game-left-stat-container">
            <div id="game-timer"> {timer}</div>
            <GameButtons isGameOverButton={false} />
        </div>

    );
};

export default LeftStats;