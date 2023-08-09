import React, { useEffect, useRef, useContext } from "react";
import GameContext from "../../GameContext";
import { useSound } from 'use-sound';


/**
 * @component
 * Component representing a piano key with interactive keyboard actions.
 * 
 * This component encapsulates the functionality of a piano key, allowing users to interact
 * with it through keyboard events. It plays audio when a key is pressed and maintains
 * accuracy and scoring information based on user interactions.
 * 
 * @param {Object} props - React props.
 * @param {string} props.note - Audio file for the piano key note.
 * @param {string} props.id - Unique identifier for the piano key.
 * @param {string} props.className - CSS class for styling the piano key.
 * @param {string} props.children - Content inside the piano key.
 * @param {string} props.letter - Keyboard letter corresponding to the piano key.
 * @returns {JSX.Element} The PianoKey component.
 */


function PianoKey({ note, id, className, children, letter }) {
    const { noteScore, setActiveKeys, activeKeys, checkPressedKey, checkReleasedKey, accuracyAlert, setAccuracyAlert, gameOver } = useContext(GameContext);
    const [play, { stop }] = useSound(note); // Initialize the useSound hook with the audio file
    const isKeyDownRef = useRef(null);

    // Handle key press event
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


    // Handle key release event
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


    // Play or stop audio based on active keys
    useEffect(() => {
        if (activeKeys.hasOwnProperty(letter)) {
            // Play the audio file associated with the key
            play();
        } else {
            // Stop the audio playback
            stop();
        }
    }, [activeKeys]);


    // Handle key press and release effects on accuracy and scoring
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


    // Add and remove key press and release event listeners
    useEffect(() => {
        if (!gameOver) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameOver]);



    return (<div>
        <li id={id} className={
            `${className} piano-key
             ${activeKeys.hasOwnProperty(letter) ? 'active' : ''} 
${(accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] === 'Miss') ? 'inaccurate' : ''} 
 ${(accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] !== 'Miss') ? 'accurate' : ''} `}>

            <div className="piano-note-name">
                {children}
            </div>
            <div className="piano-note-accuracy">

                {accuracyAlert.hasOwnProperty(letter) ? accuracyAlert[letter] : ""}
                <br />{noteScore.hasOwnProperty(letter) ? `+${noteScore[letter]}` : ""}
            </div>
        </li >
    </div >
    );
}

export default PianoKey;
