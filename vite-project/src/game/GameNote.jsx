
import React from "react";
import "./Game.css"



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
    const StreamContainerWidth = 500
    const noteLength = noteEnd - noteStart
    const noteHeight = (noteLength / songLength) * StreamContainerHeight
    const blackNoteWidth = StreamContainerWidth / 15.5;
    const whiteNoteWidth = StreamContainerWidth * (1.5 / 15.5);


    const noteKey = {
        'C': { "width": whiteNoteWidth, "leftPosition": 0 },
        'C#': { "width": blackNoteWidth, "leftPosition": whiteNoteWidth },
        'D': { "width": whiteNoteWidth, "leftPosition": whiteNoteWidth + blackNoteWidth },
        'D#': { "width": blackNoteWidth, "leftPosition": (2 * whiteNoteWidth) + (1 * blackNoteWidth) },
        'E': { "width": whiteNoteWidth, "leftPosition": (2 * whiteNoteWidth) + (2 * blackNoteWidth) },
        'F': { "width": whiteNoteWidth, "leftPosition": (3 * whiteNoteWidth) + (2 * blackNoteWidth) },
        'F#': { "width": blackNoteWidth, "leftPosition": (4 * whiteNoteWidth) + (2 * blackNoteWidth) },
        'G': { "width": whiteNoteWidth, "leftPosition": (4 * whiteNoteWidth) + (3 * blackNoteWidth) },
        'G#': { "width": blackNoteWidth, "leftPosition": (5 * whiteNoteWidth) + (3 * blackNoteWidth) },
        'A': { "width": whiteNoteWidth, "leftPosition": (5 * whiteNoteWidth) + (4 * blackNoteWidth) },
        'A#': { "width": blackNoteWidth, "leftPosition": (6 * whiteNoteWidth) + (4 * blackNoteWidth) },
        'B': { "width": whiteNoteWidth, "leftPosition": (6 * whiteNoteWidth) + (5 * blackNoteWidth) }
    };

    const convertPitchToNote = (pitch) => {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteIndex = pitch % 12;
        return `${noteNames[noteIndex]}`;
    };

    const noteName = convertPitchToNote(pitch)

    const noteWidth = noteKey[noteName]['width']
    const noteBottomPosition = (noteStart / songLength) * StreamContainerHeight
    const noteLeftPosition = noteKey[noteName]['leftPosition']


    const noteStyle = {
        height: `${noteHeight}px`,
        width: `${noteWidth}px`,
        bottom: `${noteBottomPosition}px`,
        left: `${noteLeftPosition}px`,

    }



    return (
        <div className='game-note' style={noteStyle} >
            <div className='note-name'> {noteName}</div>
        </div>
    )

};
export default GameNote;