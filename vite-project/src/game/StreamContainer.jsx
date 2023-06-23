
import React from "react";
import GameNote from "./GameNote"
import "./StreamContainer.css"


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const StreamContainer = ({ trackNotes, songLength, bpm }) => {

    // const noteContainer = document.getElementById('noteContainer');

    // const containerHeight = noteContainer.offsetHeight;
    // const targetPosition = '10vh'; // Adjust this value to set the desired position

    // // Set the initial position
    // noteContainer.style.top = `-${containerHeight}px`;

    // // Move the container to the target position
    // function moveNoteContainer() {
    //     noteContainer.style.top = targetPosition;
    // }





    return (
        <div className="stream-container" id="noteContainer" style={{ transition: `top ${songLength}s ease` }}>
            {trackNotes.map((note, idx) => (

                <GameNote
                    key={idx}
                    idx={idx}
                    noteStart={note.start}
                    noteEnd={note.end}
                    pitch={note.pitch}
                    songLength={songLength}
                    bpm={bpm}
                />
            ))}

        </div >
    )

};
export default StreamContainer;