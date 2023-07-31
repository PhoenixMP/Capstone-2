import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Melodic2API from "../../api/api"
import GameContext from "../GameContext";
import UserContext from '../../auth/UserContext';
import base64 from 'react-native-base64';

const EndGameButtons = () => {

    const [resetPrompt, setResetPrompt] = useState(false);
    const [exitPrompt, setExitPrompt] = useState(false);
    const [saveEarlyPrompt, setSaveEarlyPrompt] = useState(false)

    const navigate = useNavigate();

    const { isAnimationStarted, handleStop, handleRestartGame, handlePlay, } = useContext(GameContext);
    const { setShowLogin, currentUser, totalScore, userBeatTop, userBeatPersonalBest, setOnGamePage } = useContext(UserContext)

    const { mp3Id } = useParams()




    async function addScore() {
        await Melodic2API.saveScore({ mp3Id: `${mp3Id}`, username: currentUser.username, score: totalScore })
    }

    function handleSubmitScore() {
        addScore();
        handleRestartGame();
        setOnGamePage(false)
        navigate(`/song/${mp3Id}`);

    }


    const handleExit = () => {
        handleRestartGame()
        navigate(`/song/${mp3Id}`);
    }


    const handleRestart = () => {
        handleStop();
        handleRestartGame();
        setResetPrompt(false)
        handlePlay();
    }


    const handleExitPrompt = () => {
        setExitPrompt(true)
        setResetPrompt(false)
    }


    const handleRestartPrompt = () => {
        setResetPrompt(true)
        setExitPrompt(false)
    }


    const handleShowLogin = () => {
        setShowLogin(true)
        setResetPrompt(false)
        setExitPrompt(false)
    }

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

    const getExitButtonJSX = () => {

        if (!exitPrompt) {
            return (<button className="save-btn  exit" onClick={((currentUser && userBeatPersonalBest) || userBeatTop) ? handleExitPrompt : handleExit}>Exit Game</button>)

        } else {
            return (<button className="save-btn  prompt" onClick={handleExit}>Confirm Exit Without Saving?</button>)
        }


    }

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



