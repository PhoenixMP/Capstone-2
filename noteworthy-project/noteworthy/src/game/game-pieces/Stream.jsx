import React, { useContext, useEffect, useState } from 'react';
import GameNote from './GameNote';
import musicContext from '../../songs/MusicContext';
import gameContext from '../GameContext';

/**
 * @component
 * Component responsible for rendering the music notes stream.
 * 
 * This component manages the animation of the music notes stream based on the song progress.
 * It calculates the travel distance of the stream and updates it according to the progress.
 * The animation starts when `isAnimationStarted` is true and stops when `isAnimationStopped` is true.
 * 
 * @param {Object} props - Component props.
 * @param {Function} props.setGameOver - Function to set the game over status.
 * @param {number} props.songLength - Length of the song in seconds.
 * @param {number} props.bpm - Beats per minute of the song.
 * @param {boolean} props.isAnimationStarted - Flag to start the animation.
 * @param {boolean} props.isAnimationStopped - Flag to stop the animation.
 * 
 * @returns {JSX.Element} The Stream component.
 */

const Stream = ({ setGameOver, songLength, bpm, isAnimationStarted, isAnimationStopped }) => {

    const { notes } = useContext(musicContext);
    const { setTimer, songProgress } = useContext(gameContext);

    const [streamDistance, setStreamDistance] = useState(0);


    const travelDistance = songLength * (10000 / 60);




    // Animation logic for the music notes stream
    useEffect(() => {
        let animationFrameId;
        function formatSeconds(seconds) {
            return String(seconds).padStart(2, '0');
        }

        // Function to animate the music notes stream
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

        // Start the animation when animation is started
        const startAnimation = () => {
            animationFrameId = requestAnimationFrame(animateStream);
        };

        // Stop the animation when animation is stopped
        const stopAnimation = () => {
            cancelAnimationFrame(animationFrameId);
            setStreamDistance(0);
        };

        if (isAnimationStarted) {
            startAnimation();
        } else if (isAnimationStopped) {
            stopAnimation();
        }

        // Clean up animation frame listener on unmount
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
