import React, { useEffect, useState, useRef, useContext } from "react";
import gameContext from "../gameContext";
import { useSound } from 'use-sound';

import "../Game.css";




function PianoKey({ note, id, className, children, letter }) {
    const { setActiveKeys, activeKeys, accuracyAlert, setReleasedKeys } = useContext(gameContext);
    const [play, { stop }] = useSound(note); // Initialize the useSound hook with the audio file
    const isKeyDownRef = useRef(false);


    const handleKeyDown = (event) => {

        if (!isKeyDownRef.current && (event.key === letter || event.key === letter.toLowerCase())) {
            event.preventDefault();
            console.log(event.key)
            setReleasedKeys(prevState => {
                const newState = { ...prevState };
                delete newState[letter];
                return newState;
            })

            setActiveKeys(prevState => ({
                ...prevState,
                [letter]: Date.now()
            }));

            isKeyDownRef.current = true;
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === letter || event.key === letter.toLowerCase()) {
            event.preventDefault();

            setReleasedKeys(prevState => ({
                ...prevState,
                [letter]: Date.now()
            }));

            setActiveKeys(prevState => {
                const newState = { ...prevState };
                delete newState[letter];
                return newState;
            })

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
    }, [activeKeys]);


    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);



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
