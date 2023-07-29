import React, { useContext, useEffect, useRef, useState } from 'react';
import GameNote from './GameNote';
import musicContext from '../../songs/MusicContext';
import gameContext from '../GameContext';
import UserContext from '../../auth/UserContext';


const Stream = ({ setGameOver, songLength, bpm, isAnimationStarted, isAnimationStopped }) => {

    const { notes } = useContext(musicContext);
    const { setTimer, songProgress } = useContext(gameContext);
    const { currentUser } = useContext(UserContext)
    const [streamDistance, setStreamDistance] = useState(0);


    const travelDistance = songLength * (10000 / 60);





    useEffect(() => {
        let animationFrameId;
        function formatSeconds(seconds) {
            return String(seconds).padStart(2, '0');
        }

        const animateStream = () => {
            const timeLeft = Math.floor(songLength - (songProgress * songLength))
            const minutes = Math.floor(timeLeft / 60)
            const seconds = formatSeconds(timeLeft - (minutes * 60))

            setTimer(`${minutes}:${seconds}`)


            const distance = songProgress * travelDistance;
            setStreamDistance(distance);

            if (songProgress < 1) {
                animationFrameId = requestAnimationFrame(animateStream);
            }
            if (songProgress === 1) {
                setGameOver(true);

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
            className="stream"
            style={{ bottom: `calc(230px - ${streamDistance}px)`, height: `${travelDistance}px` }}
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

export default Stream;
