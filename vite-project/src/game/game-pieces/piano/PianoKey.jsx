import React, { useEffect, useState, useRef, useContext } from "react";
import GameContext from "../../GameContext";
import { useSound } from 'use-sound';






function PianoKey({ note, id, className, children, letter }) {
    const { noteScore, setActiveKeys, activeKeys, checkPressedKey, checkReleasedKey, accuracyAlert, setAccuracyAlert } = useContext(GameContext);
    const [play, { stop }] = useSound(note); // Initialize the useSound hook with the audio file
    const isKeyDownRef = useRef(null);


    const handleKeyDown = (event) => {

        if (!isKeyDownRef.current && (event.key === letter || event.key === letter.toLowerCase())) {
            event.preventDefault();
            const currTime = Date.now()


            setActiveKeys(prevState => ({
                ...prevState,
                [letter]: currTime
            }));


            isKeyDownRef.current = true;
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === letter || event.key === letter.toLowerCase()) {
            event.preventDefault();


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
        if (isKeyDownRef.current !== null) {
            const currTime = Date.now()
            if (isKeyDownRef.current) {
                checkPressedKey(letter, currTime)
            } else {
                setAccuracyAlert(prevState => {
                    const newState = { ...prevState };
                    delete newState[letter];
                    return newState;
                })
                checkReleasedKey(letter, currTime)
            }
        }
    }, [isKeyDownRef.current]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);



    return (<div>
        <li id={id} className={
            `${className} piano-key
             ${activeKeys.hasOwnProperty(letter) ? 'active' : ''} 
${(accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] === 'Miss') ? 'inaccurate' : ''} 
 ${(accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] !== 'Miss') ? 'accurate' : ''} `}>


            {children}
            <div className="note-accuracy">
                {accuracyAlert.hasOwnProperty(letter) ? accuracyAlert[letter] : ""}
                <br />{noteScore.hasOwnProperty(letter) ? `+${noteScore[letter]}` : ""}
            </div>
        </li>
    </div>
    );
}

export default PianoKey;
