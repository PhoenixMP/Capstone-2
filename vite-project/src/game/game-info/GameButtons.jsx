import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Melodic2API from "../../api/api"
import GameContext from "../GameContext";
import UserContext from '../../auth/UserContext';
import base64 from 'react-native-base64';

const GameButtons = ({ isGameOverButton, saving }) => {

    const [resetPrompt, setResetPrompt] = useState(false);
    const [exitPrompt, setExitPrompt] = useState(false);
    const [saveEarlyPrompt, setSaveEarlyPrompt] = useState(false)

    const navigate = useNavigate();

    const { isAnimationStarted, handleStop, handleRestartGame, handlePlay, setGameOver, gameOver, totalScore } = useContext(GameContext);
    const { topScore, userBestScore, userHasTop, setShowLogin, currentUser } = useContext(UserContext)

    const { mp3Id } = useParams()




    async function addScore() {
        await Melodic2API.saveScore({ mp3Id: `${mp3Id}`, username: currentUser.username, score: totalScore })
    }

    function handleSubmitScore() {
        addScore();
        navigate(`/song/${mp3Id}`);

    }


    const handleExit = () => {
        navigate(`/song/${mp3Id}`);
    }


    const handleRestart = () => {
        handleStop();
        handleRestartGame();
        setResetPrompt(false)
        handlePlay();
    }

    const handleSaveEarly = () => {
        handleStop();
        setSaveEarlyPrompt(false);
        setGameOver(true);
    }



    const handleExitPrompt = () => {
        setExitPrompt(true)
    }


    const handleRestartPrompt = () => {
        setResetPrompt(true)
    }

    const handleSaveEarlyPrompt = () => {
        setSaveEarlyPrompt(true)
    }

    const handleShowLogin = () => {
        setShowLogin(true)
    }

    const getRestartButtonJSX = () => {
        if (isGameOverButton) {
            if (!resetPrompt) {
                return (
                    <button className="save-btn  restart" onClick={handleRestartPrompt}>Restart Game</button>
                )
            } else {
                return (
                    <button className="save-btn restart prompt" onClick={handleRestart}>Confirm Restart Without Saving</button>
                )
            }

        } else {

            if (!resetPrompt && !exitPrompt && isAnimationStarted) {
                return (
                    <button className="game-restart-button" onClick={handleRestartPrompt}>Restart Game</button>
                )
            } else if (resetPrompt) {
                return (
                    <button className="game-restart-button-prompt" onClick={handleRestart}>Confirm Restart?</button>
                )
            }
        }
    }

    const getExitButtonJSX = () => {
        if (isGameOverButton) {
            if (!exitPrompt) {
                return (<button className="save-btn  exit" onClick={handleExitPrompt}>Exit Game</button>)
            } else {
                return (<button className="save-btn  prompt" onClick={handleExit}>Confirm Exit?</button>)
            }

        } else {
            if ((!exitPrompt && !resetPrompt && isAnimationStarted && !gameOver)) {
                return (<button className="game-exit-button" onClick={handleExitPrompt}>Exit Game</button>)
            } else if (exitPrompt) {
                return (<button className="game-exit-button-prompt" onClick={handleExit}>Confirm Exit?</button>)
            }
        }
    }

    const getSaveScoreButtonJSX = () => {
        if (isGameOverButton) {
            if (currentUser && saving) {
                return (<button className="save-btn save" onClick={handleSubmitScore}>Save Score</button>)

            } else if (!currentUser) {
                return (<button className="save-btn save" onClick={handleShowLogin}>Login</button>)
            }

        } else {
            if (!saveEarlyPrompt &&
                ((!topScore && (totalScore > 0)) ||
                    (currentUser && (totalScore > userBestScore.score)) ||
                    (!userHasTop && (totalScore > 0) && (!userBestScore)) ||
                    (currentUser && (totalScore > topScore.score)))) {
                return (<button className="game-save-early-button" onClick={handleSaveEarlyPrompt}>Save Score Early</button>)
            } else if (saveEarlyPrompt) {
                return (<button className="game-save-early-prompt" onClick={handleSaveEarly}>Are You Sure You Want to Save Your Score Early?</button>)
            }
        }
    }





    return (
        <div id={!isGameOverButton ? "game-buttons" : "save-game-buttons"}>
            {getSaveScoreButtonJSX()}
            {getRestartButtonJSX()}
            {getExitButtonJSX()}


        </div>
    );
};

export default GameButtons;



