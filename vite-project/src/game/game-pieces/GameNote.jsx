
import React, { useEffect, useContext, useState, useRef } from "react";
import { useInView } from 'react-intersection-observer';
import gameContext from "../GameContext";



/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const GameNote = ({ idx, noteStart, noteEnd, pitch, songLength, bpm }) => {

    const { viewHeight, setInPlayKeys, accuracyAlert, checkKeyInPlay, checkKeyOutOfPlay } = useContext(gameContext);
    const distanceFromTop = viewHeight - 256;
    const rootMarginSpecs = `${-distanceFromTop}px 0px 0px 0px`


    const { ref, inView } = useInView({
        /* Optional options */
        rootMargin: rootMarginSpecs,
        threshold: 0
    });


    const beatsPerSecond = bpm / 60
    const miliSecondsPerBeat = 1000 / (beatsPerSecond)


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


    const convertPitchToNote = (pitch) => {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteIndex = pitch % 12;
        return `${noteNames[noteIndex]}`;
    };

    const noteName = convertPitchToNote(pitch)

    const noteWidth = noteKey[noteName]['width']
    const letter = noteKey[noteName]["keyboardKey"]
    const noteBottomPosition = (noteStart / songLength) * StreamContainerHeight
    const noteLeftPosition = noteKey[noteName]['leftPosition']


    const noteStyle = {
        height: `${noteHeight}px`,
        width: `${noteWidth}px`,
        bottom: `${noteBottomPosition}px`,
        left: `${noteLeftPosition + leftPaddingWidth}px`,
    }

    let gameNoteClass;
    (noteKey[noteName]['width'] === whiteNoteWidth) ? gameNoteClass = 'white-game-note' : gameNoteClass = 'black-game-note';



    useEffect(() => {

        if (inView) {
            let timeout;
            const noteLength_ms = noteLength * 1000;
            const currTime = Date.now();
            const endTime = currTime + noteLength_ms;


            setInPlayKeys(prevState => ({
                ...prevState,
                [letter]: { startTime: currTime, endTime }
            }));

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

// ${(inView && accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] === 'Miss') ? 'inaccurate' : ''} 
// ${ (inView && accuracyAlert.hasOwnProperty(letter) && accuracyAlert[letter] !== 'Miss') ? 'accurate' : '' }      
// ${ (inView) ? 'in-play' : '' } 




