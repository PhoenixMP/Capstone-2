import React, { useContext } from 'react';
import GameContext from "../GameContext";
import UserContext from '../../auth/UserContext';
import LoadingSpinner from '../../common/LoadingSpinner';

/**
 * Component that displays game play buttons for restarting or exiting the game.
 *
 * @component
 * @return {JSX.Element} GamePlayButtons
 */

const GamePlayButtons = () => {

    const { isAnimationStarted, handleRestartPrompt, handleExitPrompt, gameOver } = useContext(GameContext);
    const { userBestScore, currentUser, } = useContext(UserContext)


    /**
     * Returns JSX for the restart button based on game animation status.
     * 
     * @returns {JSX.Element} Restart button JSX
     */
    const getRestartButtonJSX = () => {

        if (isAnimationStarted) {
            return (
                <button className="game-restart-button game-play-button" onClick={handleRestartPrompt}>Restart Game</button>
            )
        }
    }

    /**
     * Returns JSX for the exit button based on game animation and game over status.
     * 
     * @returns {JSX.Element} Exit button JSX
     */
    const getExitButtonJSX = () => {

        if ((isAnimationStarted && !gameOver)) {
            return (<button className="game-play-button" onClick={handleExitPrompt}>Exit Game</button>)
        }
    }



    if (currentUser && userBestScore === null) return (<LoadingSpinner />)

    return (
        <div id="game-play-buttons" >
            {getRestartButtonJSX()}
            {getExitButtonJSX()}
        </div>
    );
};

export default GamePlayButtons;



