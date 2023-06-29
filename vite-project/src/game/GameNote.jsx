
import React, { useEffect, useContext, useRef } from "react";
import "./Game.css"
import { useInView } from 'react-intersection-observer';
import gameContext from "./gameContext";



/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const GameNote = ({ idx, noteStart, noteEnd, pitch, songLength, bpm }) => {

    const { removeKeyInPlay, addKeyInPlay } = useContext(gameContext);




    const { ref, inView } = useInView({
        /* Optional options */
        rootMargin: '-40% 0px 0px 0px',
        threshold: 0,
    });




    const StreamContainerHeight = (songLength / 180) * 100000
    const StreamContainerWidth = 600
    const noteLength = noteEnd - noteStart
    const noteHeight = (noteLength / songLength) * StreamContainerHeight
    const blackNoteWidth = 35; //px
    const whiteNoteWidth = 70; //px
    const leftPaddingWidth = 32


    const noteKey = {
        'C': { "width": whiteNoteWidth, "keyboardKey": 'A', "leftPosition": 0 },
        'C#': { "width": blackNoteWidth, "keyboardKey": 'W', "leftPosition": whiteNoteWidth - (blackNoteWidth / 2) - 8 },
        'D': { "width": whiteNoteWidth, "keyboardKey": 'S', "leftPosition": whiteNoteWidth },
        'D#': { "width": blackNoteWidth, "keyboardKey": 'E', "leftPosition": (2 * whiteNoteWidth) - (blackNoteWidth / 2) - 4 },
        'E': { "width": whiteNoteWidth, "keyboardKey": 'D', "leftPosition": (2 * whiteNoteWidth) },
        'F': { "width": whiteNoteWidth, "keyboardKey": 'F', "leftPosition": (3 * whiteNoteWidth) },
        'F#': { "width": blackNoteWidth, "keyboardKey": 'T', "leftPosition": (4 * whiteNoteWidth) - (blackNoteWidth / 2) - 1 },
        'G': { "width": whiteNoteWidth, "keyboardKey": 'G', "leftPosition": (4 * whiteNoteWidth) },
        'G#': { "width": blackNoteWidth, "keyboardKey": 'Y', "leftPosition": (5 * whiteNoteWidth) - (blackNoteWidth / 2) },
        'A': { "width": whiteNoteWidth, "keyboardKey": 'H', "leftPosition": (5 * whiteNoteWidth) },
        'A#': { "width": blackNoteWidth, "keyboardKey": 'U', "leftPosition": (6 * whiteNoteWidth) - (blackNoteWidth / 2) + 4 },
        'B': { "width": whiteNoteWidth, "keyboardKey": 'J', "leftPosition": (6 * whiteNoteWidth) + 8 }
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
            const currTime = Date.now()
            const NoteLength_ms = noteLength * 1000
            const endTime = currTime + NoteLength_ms
            addKeyInPlay(letter, currTime, NoteLength_ms)
            timeout = setTimeout(() => {
                removeKeyInPlay(letter, endTime);
            }, NoteLength_ms)
        }

    }, [inView, ref]);


    return (
        <div ref={ref} className={`game-note ${gameNoteClass}`} id={idx} style={noteStyle} >
            <div className='note-name'>{letter}</div>
        </div>
    )

};
export default GameNote;

// inPlayKeys = [{ name: 'Y', start: 'time', keyactive: false }]