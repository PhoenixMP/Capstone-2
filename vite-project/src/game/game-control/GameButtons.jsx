import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import musicContext from "../../songs/MusicContext";
import gameContext from "../GameContext";
import base64 from 'react-native-base64';

const GameButtons = ({ handleStartAnimation, handleStopAnimation, isAnimationStarted }) => {
    const { mp3Id } = useParams();
    const { encodedData, setHasRefreshedGame } = useContext(musicContext);
    const { handleRestartGame, setSongProgress, gameOver } = useContext(gameContext);
    const [resetPrompt, setResetPrompt] = useState(false);
    const [exitPrompt, setExitPrompt] = useState(false);


    const audioRef = useRef(null);
    const navigate = useNavigate();



    useEffect(() => {
        if (encodedData === null) {

            setHasRefreshedGame(true)
            navigate(`/song/${mp3Id}`);
            return
        }
        const decodedData = base64.decode(encodedData);
        const audioElement = new Audio();
        audioElement.src = 'data:audio/mp3;base64,' + btoa(decodedData); // Set the MP3 binary data as the audio source

        audioRef.current = audioElement; // Assign the audio element to the ref
        audioRef.current.volume = 0.1

        return () => {
            audioElement.pause();
            audioElement.src = '';
        };
    }, [encodedData]);



    useEffect(() => {
        let animationFrameId;

        handlePlay()


        const updateProgress = () => {
            const currentTime = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            const progress = currentTime / duration;

            setSongProgress(progress);
            animationFrameId = requestAnimationFrame(updateProgress);
        };

        if (audioRef.current) {
            animationFrameId = requestAnimationFrame(updateProgress);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handlePlay = () => {
        if (audioRef.current) {
            setTimeout(() => {
                audioRef.current.play();
                handleStartAnimation();;
            }, 2000);
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.load(); // Reset the audio source
            handleStopAnimation();
        }
    };


    const handleRestartPrompt = () => {
        setResetPrompt(true)
    }

    const handleRestart = () => {
        handleStop();
        handleRestartGame();
        setResetPrompt(false)
        handlePlay();
    }

    const handleExitPrompt = () => {
        setExitPrompt(true)

    }
    const handleExit = () => {
        navigate(`/song/${mp3Id}`);

    }


    return (
        <div id="game-buttons">
            {(!resetPrompt && !exitPrompt && isAnimationStarted) ? (<button onClick={handleRestartPrompt}>Restart Game</button>) : ""}
            {resetPrompt ? (<button onClick={handleRestart}>Are You Sure You Want to Restart?</button>) : ""}
            {(!exitPrompt && !resetPrompt && isAnimationStarted && !gameOver) ? (<button onClick={handleExitPrompt}>Exit Game</button>) : ""}
            {exitPrompt ? (<button onClick={handleExit}>Are You Sure You Want to Exit?</button>) : ""}

        </div>
    );
};

export default GameButtons;
