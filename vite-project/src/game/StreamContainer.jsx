
import React, { useContext, useEffect, useState } from "react";
import GameNote from "./GameNote"
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "../songs/musicContext";
import "./Game.css"


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const StreamContainer = ({ isAnimationStarted }) => {

    const { song, trackNotes } = useContext(musicContext);
    const songLength = song.song.song_length
    const bpm = song.song.bpm
    const [streamPosition, setStreamPosition] = useState(0);
    const travelDistance = 100000; // Specify the desired travel distance
    const travelDuration = songLength * 1000; // Specify the desired travel duration in milliseconds

    useEffect(() => {
        if (isAnimationStarted) {
            const startTime = Date.now();

            const animateStream = () => {
                const currentTime = Date.now();
                const elapsedTime = currentTime - startTime;

                if (elapsedTime >= travelDuration) {
                    setStreamPosition(travelDistance);
                } else {
                    const progress = (elapsedTime / travelDuration) * travelDistance;
                    setStreamPosition(progress);
                    requestAnimationFrame(animateStream);
                }
            };

            animateStream();
        }
    }, [isAnimationStarted]);



    return (
        <div className="stream-container" style={{ top: `${streamPosition}px` }} >
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