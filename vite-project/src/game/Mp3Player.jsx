import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Melodic2API from "../api/api";
import musicContext from "../songs/musicContext";
import gameContext from "./gameContext";
import lamejs from 'lamejs';
import base64 from 'react-native-base64';

const Mp3Player = ({ handleStartAnimation, handleStopAnimation }) => {
    const { mp3Id } = useParams();
    const { setEncodedData, encodedData, setHasRefreshedGame } = useContext(musicContext);
    const { setSongProgress } = useContext(gameContext);
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

    return (
        <div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
};

export default Mp3Player;
