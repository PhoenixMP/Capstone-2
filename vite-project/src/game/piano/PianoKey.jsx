import React, { useEffect, useRef, useContext } from "react";
import gameContext from "../gameContext";
import { useSound } from 'use-sound';

import "../Game.css";




function PianoKey({ note, id, className, children, letter }) {
    const { pressKey, releaseKey, activeKeys } = useContext(gameContext);
    const [play, { stop }] = useSound(note); // Initialize the useSound hook with the audio file

    const active = activeKeys[letter].active


    useEffect(() => {
        if (active) {
            // Play the audio file associated with the key
            play();
        } else {
            // Stop the audio playback
            stop();
        }
    }, [active, play, stop]);

    const handleKeyDown = (event) => {
        if (event.key === letter || event.key === letter.toLowerCase()) {
            event.preventDefault();
            console.log(`${letter} down`);
            pressKey(letter);
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === letter || event.key === letter.toLowerCase()) {
            event.preventDefault();
            console.log(`${letter} up`);
            releaseKey(letter);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [active]);

    return (
        <li id={id} className={`${className} ${active ? 'active' : ''} `}>
            {children}
        </li>
    );
}

export default PianoKey;
