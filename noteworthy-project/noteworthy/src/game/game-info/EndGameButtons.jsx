import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import NoteworthyAPI from "../../api/api"
import GameContext from "../GameContext";
import UserContext from '../../auth/UserContext';



/**
 * Component that displays end game buttons and handles their functionalities.
 * Provides options to restart the game, exit the game, and save the player's score.
 * Uses context to access game-related and user-related states and functions.
 * @component
 * @return { JSX.Element } EndGameButtons component
 */
const EndGameButtons = () => {

    const [resetPrompt, setResetPrompt] = useState(false);
    const [exitPrompt, setExitPrompt] = useState(false);

    const navigate = useNavigate();

    const { handleStop, handleRestartGame, handlePlay, } = useContext(GameContext);
    const { setShowLogin, currentUser, totalScore, userBeatTop, userBeatPersonalBest, setOnGamePage } = useContext(UserContext)

    const { mp3Id } = useParams()

    //Function to save the player's score to the server.
    async function addScore() {
        await NoteworthyAPI.saveScore({ mp3Id: `${mp3Id}`, username: currentUser.username, score: totalScore })
    }

    /**
       * Function to handle the submission of the player's score.
       * It saves the score, restarts the game, and navigates back to the song details page.
       */
    function handleSubmitScore() {
        addScore();
        handleRestartGame();
        setOnGamePage(false)
        navigate(`/song/${mp3Id}`);
    }


    //Function to handle exiting the game.
    const handleExit = () => {
        setOnGamePage(false)
        handleRestartGame()
        navigate(`/song/${mp3Id}`);
    }


    //Function to handle restarting the game.
    const handleRestart = () => {
        handleStop();
        handleRestartGame();
        setResetPrompt(false)
        handlePlay();
    }

    //Function to display the exit prompt.
    const handleExitPrompt = () => {
        setExitPrompt(true)
        setResetPrompt(false)
    }

    //Function to display the restart prompt.
    const handleRestartPrompt = () => {
        setResetPrompt(true)
        setExitPrompt(false)
    }

    //Function to show the login/signup form.
    const handleShowLogin = () => {
        setShowLogin(true)
        setResetPrompt(false)
        setExitPrompt(false)
    }

    //Function to render the restart button JSX.
    const getRestartButtonJSX = () => {
        if (!resetPrompt) {
            return (
                <button className="save-btn  restart" onClick={((currentUser && userBeatPersonalBest) || userBeatTop) ? handleRestartPrompt : handleRestart}>Restart Game</button>
            )

        } else {
            return (
                <button className="save-btn restart prompt" onClick={handleRestart}>Confirm Restart Without Saving</button>
            )
        }

    }

    //Function to render the exit button JSX.
    const getExitButtonJSX = () => {

        if (!exitPrompt) {
            return (<button className="save-btn  exit" onClick={((currentUser && userBeatPersonalBest) || userBeatTop) ? handleExitPrompt : handleExit}>Exit Game</button>)

        } else {
            return (<button className="save-btn  prompt" onClick={handleExit}>Confirm Exit Without Saving?</button>)
        }
    }


    //Function to render the save score button JSX.
    const getSaveScoreButtonJSX = () => {
        if (currentUser && (userBeatPersonalBest || userBeatTop)) {
            return (<button className="save-btn save" onClick={handleSubmitScore}>Save Score</button>)

        } else if (!currentUser) {
            return (<button className="save-btn save" onClick={handleShowLogin}>Login/Signup</button>)
        }
    }


    return (
        <div id="save-game-buttons">
            {getSaveScoreButtonJSX()}
            {getRestartButtonJSX()}
            {getExitButtonJSX()}
        </div>
    );
};

export default EndGameButtons;



