import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Melodic2API from "../api/api";
import musicContext from "../songs/MusicContext";
import gameContext from "./GameContext";
import lamejs from 'lamejs';
import base64 from 'react-native-base64';

const Mp3Player = ({ handleStartAnimation, handleStopAnimation, isAnimationStarted }) => {
    const { mp3Id } = useParams();
    const { setEncodedData, encodedData, setHasRefreshedGame, handleRestartGame } = useContext(musicContext);
    const { setSongProgress, gameOver } = useContext(gameContext);
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
            audioRef.current.play();
            handleStartAnimation();
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
        handleStop();
        setResetPrompt(true)
    }

    const handleExitPrompt = () => {
        setExitPrompt(true)

    }
    const handleExit = () => {
        navigate(`/song/${mp3Id}`);

    }


    return (
        <div>
            {(!isAnimationStarted && !gameOver) ? (<button onClick={handlePlay}>Start Game</button>) : ""}
            {(!exitPrompt && isAnimationStarted && !gameOver) ? (<button onClick={handleExitPrompt}>Exit Game</button>) : ""}
            {exitPrompt ? (<button onClick={handleExit}>Are You Sure You Want to Exit?</button>) : ""}
            {(isAnimationStarted && !resetPrompt) ? (<button onClick={handleRestartPrompt}>Restart Game</button>) : ""}
            {resetPrompt ? (<button onClick={handleRestartGame}>Are You Sure You Want to Restart?</button>) : ""}
        </div>
    );
};

export default Mp3Player;
