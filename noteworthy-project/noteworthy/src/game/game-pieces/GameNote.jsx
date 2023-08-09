
import React, { useEffect, useContext } from "react";
import { useInView } from 'react-intersection-observer';
import gameContext from "../GameContext";

/**
 * Represents a musical note in the game.
 *
 * This component renders a musical note that cascades down within the game, applying appropriate styles and
 * animations based on the note's pitch, position, and timing.
 *
 * @component
 * @param {number} idx - Index of the note.
 * @param {number} noteStart - Start time of the note.
 * @param {number} noteEnd - End time of the note.
 * @param {number} pitch - Pitch of the note.
 * @param {number} songLength - Length of the song in seconds.
 * @param {number} bpm - Beats per minute of the song.
 */

const GameNote = ({ idx, noteStart, noteEnd, pitch, songLength, bpm }) => {

    const { viewHeight, setInPlayKeys, accuracyAlert, checkKeyInPlay, checkKeyOutOfPlay } = useContext(gameContext);

    // Distance calculation and rootMargin for intersection observer
    const distanceFromTop = viewHeight - 256;
    const rootMarginSpecs = `${-distanceFromTop}px 0px 0px 0px`


    // Use the `useInView` hook to determine if the note is in the viewport
    const { ref, inView } = useInView({
        rootMargin: rootMarginSpecs,
        threshold: 0
    });


    //Note characteristics calculation
    const StreamContainerHeight = songLength * (10000 / 60)
    const noteLength = noteEnd - noteStart
    const noteHeight = (noteLength / songLength) * StreamContainerHeight
    const blackNoteWidth = 50; //px
    const whiteNoteWidth = 100; //px
    const leftPaddingWidth = 26; //px


    const noteKey = {
        'C': { "width": whiteNoteWidth, "keyboardKey": 'A', "leftPosition": 0 },
        'C#': { "width": blackNoteWidth, "keyboardKey": 'W', "leftPosition": whiteNoteWidth - (blackNoteWidth / 2) },
        'D': { "width": whiteNoteWidth, "keyboardKey": 'S', "leftPosition": whiteNoteWidth },
        'D#': { "width": blackNoteWidth, "keyboardKey": 'E', "leftPosition": (2 * whiteNoteWidth) - (blackNoteWidth / 2) },
        'E': { "width": whiteNoteWidth, "keyboardKey": 'D', "leftPosition": (2 * whiteNoteWidth) },
        'F': { "width": whiteNoteWidth, "keyboardKey": 'F', "leftPosition": (3 * whiteNoteWidth) },
        'F#': { "width": blackNoteWidth, "keyboardKey": 'T', "leftPosition": (4 * whiteNoteWidth) - (blackNoteWidth / 2) - 3 },
        'G': { "width": whiteNoteWidth, "keyboardKey": 'G', "leftPosition": (4 * whiteNoteWidth) },
        'G#': { "width": blackNoteWidth, "keyboardKey": 'Y', "leftPosition": (5 * whiteNoteWidth) - (blackNoteWidth / 2) - 5 },
        'A': { "width": whiteNoteWidth, "keyboardKey": 'H', "leftPosition": (5 * whiteNoteWidth) },
        'A#': { "width": blackNoteWidth, "keyboardKey": 'U', "leftPosition": (6 * whiteNoteWidth) - (blackNoteWidth / 2) - 7 },
        'B': { "width": whiteNoteWidth, "keyboardKey": 'J', "leftPosition": (6 * whiteNoteWidth) - 10 }
    };


    // Convert pitch to note name (e.g., C, C#, D, etc.)
    const convertPitchToNote = (pitch) => {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteIndex = pitch % 12;
        return `${noteNames[noteIndex]}`;
    };

    const noteName = convertPitchToNote(pitch)

    // Calculate note's width, left position, and bottom position
    const noteWidth = noteKey[noteName]['width']
    const letter = noteKey[noteName]["keyboardKey"]
    const noteBottomPosition = (noteStart / songLength) * StreamContainerHeight
    const noteLeftPosition = noteKey[noteName]['leftPosition']


    // Define the style for the note element
    const noteStyle = {
        height: `${noteHeight}px`,
        width: `${noteWidth}px`,
        bottom: `${noteBottomPosition}px`,
        left: `${noteLeftPosition + leftPaddingWidth}px`,
    }

    let gameNoteClass;
    (noteKey[noteName]['width'] === whiteNoteWidth) ? gameNoteClass = 'white-game-note' : gameNoteClass = 'black-game-note';


    //Effect to manage note in-play state and accuracy checking.
    useEffect(() => {

        if (inView) {
            let timeout;
            const noteLength_ms = noteLength * 1000;
            const currTime = Date.now();
            const endTime = currTime + noteLength_ms;

            // Set the note as in-play and start tracking its timing
            setInPlayKeys(prevState => ({
                ...prevState,
                [letter]: { startTime: currTime, endTime }
            }));

            // Check if the note is pressed and update accuracy if necessary

            checkKeyInPlay(letter, currTime, endTime);

            timeout = setTimeout(() => {
                checkKeyOutOfPlay(letter);
            }, noteLength_ms);
        }

    }, [inView, ref]);



    return (
        <div ref={ref} className=
            {`game-note 
            ${gameNoteClass}  
            ${(inView && accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] === 'Miss') ? 'inaccurate' : ''} 
            ${(inView && accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] !== 'Miss') ? 'accurate' : ''}   
     

  
      `}
            id={idx} style={noteStyle} >
            <div className='note-name'>{letter}</div>
        </div>
    )

};
export default GameNote;


