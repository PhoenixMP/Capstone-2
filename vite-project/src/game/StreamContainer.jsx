import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import GameNote from './GameNote';
import musicContext from '../songs/MusicContext';
import gameContext from './GameContext';
import './Game.css';

const StreamContainer = ({ songLength, bpm, isAnimationStarted, isAnimationStopped }) => {

    const { notes } = useContext(musicContext);
    const { songProgress } = useContext(gameContext);
    const [streamDistance, setStreamDistance] = useState(0);
    const travelDistance = songLength * (10000 / 60);


    useEffect(() => {
        let animationFrameId;

        const animateStream = () => {
            const distance = songProgress * travelDistance;
            setStreamDistance(distance);

            if (songProgress < 1) {
                animationFrameId = requestAnimationFrame(animateStream);
            }
        };

        const startAnimation = () => {
            animationFrameId = requestAnimationFrame(animateStream);
        };

        const stopAnimation = () => {
            cancelAnimationFrame(animationFrameId);
            setStreamDistance(0);
        };

        if (isAnimationStarted) {
            startAnimation();
        } else if (isAnimationStopped) {
            stopAnimation();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isAnimationStarted, isAnimationStopped, songProgress, travelDistance]);

    return (
        <div
            className="stream-container"
            style={{ bottom: `calc(40% - ${streamDistance}px)`, height: `${travelDistance}px` }}
        >
            {notes.map((note, idx) => (
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
        </div>
    );
};

export default StreamContainer;
