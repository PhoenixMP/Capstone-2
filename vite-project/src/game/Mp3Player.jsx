import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSound } from 'use-sound';
import musicContext from "../songs/musicContext";
import lamejs from 'lamejs';
import base64 from 'react-native-base64'





const Mp3Player = ({ handleStartAnimation, handleStopAnimation }) => {
    const { encodedData } = useContext(musicContext);
    const [audio] = useState(new Audio());

    useEffect(() => {
        const decodedData = base64.decode(encodedData);
        audio.src = 'data:audio/mp3;base64,' + btoa(decodedData); // Set the MP3 binary data as the audio source

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, [audio, encodedData]);

    const handlePlay = () => {
        audio.play();
        handleStartAnimation()
    };

    const handleStop = () => {
        audio.pause();
        audio.currentTime = 0;
        audio.load(); // Reset the audio source
        handleStopAnimation()
    };










    return (
        <div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
};

export default Mp3Player;
