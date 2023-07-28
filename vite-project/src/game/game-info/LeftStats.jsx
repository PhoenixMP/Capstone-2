import React, { useState, useContext, useEffect } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"
import GamePlayButtons from "./GamePlayButtons"


const LeftStats = () => {

    const { timer } = useContext(GameContext);






    return (

        <div className="game-left-stat-container">
            <div id="game-timer"> {timer}</div>
            <GamePlayButtons />
        </div>

    );
};

export default LeftStats;