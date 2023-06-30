import React, { useEffect, useState, useRef, useContext } from "react";
import gameContext from "../gameContext";
import { useSound } from 'use-sound';

import "../Game.css";




function PianoKey({ note, id, className, children, letter }) {
    const { pressKey, releaseKey, activeKeys, accuracyAlert } = useContext(gameContext);
    const [play, { stop }] = useSound(note); // Initialize the useSound hook with the audio file
    const isKeyDownRef = useRef(false);
    const [startTime, setStartTime] = useState(null)
    let noteStatus = ''


    const handleKeyDown = (event) => {
        if (!isKeyDownRef.current && (event.key === letter || event.key === letter.toLowerCase())) {
            event.preventDefault();
            const time = Date.now()
            console.log(time)
            setStartTime(time)
            pressKey(letter, time);
            isKeyDownRef.current = true;
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === letter || event.key === letter.toLowerCase()) {
            event.preventDefault();
            releaseKey(letter, startTime, Date.now());
            isKeyDownRef.current = false;
        }
    };

    useEffect(() => {

        if (activeKeys.hasOwnProperty(letter)) {
            // Play the audio file associated with the key
            play();
        } else {
            // Stop the audio playback
            stop();
        }
    }, [activeKeys, play, stop]);


    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [startTime]);



    return (
        <li id={id} className={
            `${className} 
            ${(accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] === 'Miss') ? 'inaccurate' : ''} 
            ${(accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] !== 'Miss') ? 'accurate' : ''} 
            ${activeKeys.hasOwnProperty(letter) ? 'active' : ''} `}>
            {children}
        </li>
    );
}

export default PianoKey;
