
import React from "react";
import "./Game.css"
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
    const notekeyboardKey = noteKey[noteName]["keyboardKey"]
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


    return (
        <div className={`game-note ${gameNoteClass}`} id={`game-note-${noteName}`} style={noteStyle} >
            <div className='note-name'> {notekeyboardKey}</div>
        </div>
    )

};
export default GameNote;