import React, { useEffect, useRef } from "react";
import { useSound } from 'use-sound';

import "../Game.css";




function PianoKey({ note, id, className, children, letter, active, pressKey, releaseKey }) {
    const [play, { stop }] = useSound(note); // Initialize the useSound hook with the audio file

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
    }, []);

    return (
        <li id={id} className={`${className} ${active ? 'active' : ''}`}>
            {children}
        </li>
    );
}

export default PianoKey;
