
import React, { useContext, useEffect, useState, useRef } from "react";
import GameNote from "./GameNote"
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "../songs/musicContext";
import gameContext from "./gameContext";
import "./Game.css"


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const StreamContainer = ({ isAnimationStarted, isAnimationStopped }) => {
    const gameNoteRefs = useRef([]);
    const streamRef = useRef();
    const [observeIntersection, setObserveIntersection] = useState(false);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);


    const { song, trackNotes } = useContext(musicContext);
    const { setKeyA_inPlay,
        setKeyW_inPlay,
        setKeyS_inPlay,
        setKeyE_inPlay,
        setKeyD_inPlay,
        setKeyF_inPlay,
        setKeyT_inPlay,
        setKeyG_inPlay,
        setKeyY_inPlay,
        setKeyH_inPlay,
        setKeyU_inPlay,
        setKeyJ_inPlay } = useContext(gameContext);


    const songLength = song.song.song_length
    const bpm = song.song.bpm
    const [streamPosition, setStreamPosition] = useState(0);
    const travelDistance = 100000; // Specify the desired travel distance
    const travelDuration = songLength * 1000; // Specify the desired travel duration in milliseconds



    useEffect(() => {
        let animationFrameId;

        const animateStream = (startTime) => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;

            // Customize this value based on your animation duration
            const animationDuration = 2000;

            if (elapsedTime >= animationDuration) {
                setIsAnimationComplete(true);
            } else {
                animationFrameId = requestAnimationFrame(() => animateStream(startTime));
            }
        };

        if (isAnimationComplete) {
            // Start observing intersection once the animation is complete
            const handleIntersection = (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log('Stream entered Piano viewport');
                        // Perform actions specific to the Stream being in the Piano viewport
                    } else {
                        console.log('Stream exited Piano viewport');
                        // Perform actions specific to the Stream not being in the Piano viewport
                    }
                });
            };

            const options = {
                root: document.getElementById('pianoViewport'),
                rootMargin: '0px',
                threshold: 1.0,
            };

            const observer = new IntersectionObserver(handleIntersection, options);
            observer.observe(streamRef.current);

            return () => {
                observer.unobserve(streamRef.current);
            };
        } else {
            // Start the animation
            const startTime = Date.now();
            animateStream(startTime);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isAnimationComplete]);

    return (
        <div ref={streamRef} className="stream-container" style={{ top: `${streamPosition}px` }} >
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