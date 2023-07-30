import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Melodic2API from "../../api/api"
import GameContext from "../GameContext";
import UserContext from '../../auth/UserContext';
import base64 from 'react-native-base64';
import LoadingSpinner from '../../common/LoadingSpinner';


const GamePlayButtons = () => {




    const { isAnimationStarted, handleRestartPrompt, handleExitPrompt, gameOver } = useContext(GameContext);
    const { userBestScore, currentUser, } = useContext(UserContext)

    const { mp3Id } = useParams()








    const getRestartButtonJSX = () => {

        if (isAnimationStarted) {
            return (
                <button className="game-restart-button game-play-button" onClick={handleRestartPrompt}>Restart Game</button>
            )
        }


    }

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



