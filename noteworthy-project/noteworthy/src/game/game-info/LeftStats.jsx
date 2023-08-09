import React, { useContext } from 'react';
import GameContext from "../GameContext";
import GamePlayButtons from "./GamePlayButtons"

/**
 * Component that displays the timer and game play buttons.
 *
 * @component
 * @return {JSX.Element} The left stats container JSX
 */

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