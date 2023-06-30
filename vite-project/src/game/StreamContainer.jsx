import React, { useContext, useEffect, useState, useRef } from "react";
import GameNote from "./GameNote";
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "../songs/musicContext";
import gameContext from "./gameContext";
import "./Game.css";

const StreamContainer = ({ isAnimationStarted, isAnimationStopped }) => {



    const { song, trackNotes } = useContext(musicContext);
    // const { setKeyA_inPlay, setKeyW_inPlay, setKeyS_inPlay, setKeyE_inPlay, setKeyD_inPlay, setKeyF_inPlay, setKeyT_inPlay, setKeyG_inPlay, setKeyY_inPlay, setKeyH_inPlay, setKeyU_inPlay, setKeyJ_inPlay } = useContext(gameContext);

    const songLength = song.song.song_length;
    const bpm = song.song.bpm;

    const [streamDistance, setStreamDistance] = useState(0)




    const travelDistance = songLength * (10000 / 60)
    const travelDuration = songLength * 1000; // Specify the desired travel duration in milliseconds




    useEffect(() => {

        let animationFrameId;


        const animateStream = (startTime) => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;

            if (elapsedTime >= travelDuration) {
                setStreamDistance(travelDistance);
            } else {
                const progress = (elapsedTime / travelDuration) * travelDistance;
                setStreamDistance(progress);


                animationFrameId = requestAnimationFrame(() => animateStream(startTime));
            }
        };

        if (isAnimationStarted) {
            const startTime = Date.now();
            animateStream(startTime);
        } else if (isAnimationStopped) {
            cancelAnimationFrame(animationFrameId);
            setStreamDistance(0);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isAnimationStarted, isAnimationStopped]);


    return (
        <div
            className="stream-container"
            style={{ bottom: `calc(50% - ${streamDistance}px)`, height: `${travelDistance}px` }}
        >
            {
                trackNotes.map((note, idx) => (
                    <GameNote
                        key={idx}
                        idx={idx}
                        noteStart={note.start}
                        noteEnd={note.end}
                        pitch={note.pitch}
                        songLength={songLength}
                        bpm={bpm}
                    />
                ))
            }
        </div >
    );
};

export default StreamContainer;




