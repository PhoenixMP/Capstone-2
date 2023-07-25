
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";

import LoadingSpinner from "../common/LoadingSpinner";
import GameButtons from "./game-control/GameButtons";
import Stream from "./game-pieces/Stream";
import Piano from "./game-pieces/piano/Piano";

import LiveStats from "./game-alerts/LiveStats";
import GameOver from "./game-alerts/GameOver";
import SaveScore from "./game-control/SaveScore";
import ScoreBar from "./game-alerts/ScoreBar"
import GameContext from "./GameContext";
import MusicContext from "../songs/MusicContext";
import "./Game.css"
import video1 from './backgrounds/Video1.mp4'
import video2 from './backgrounds/Video2.mp4'
import video3 from './backgrounds/Video3.mp4'
import video4 from './backgrounds/Video4.mp4'
import video5 from './backgrounds/Video5.mp4'
import video6 from './backgrounds/Video6.mp4'
import UserContext from "../auth/UserContext";







/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const Game = () => {


    const { song } = useContext(MusicContext);
    const { getFormJSX, setOnGamePage } = useContext(UserContext)
    const { mp3Id } = useParams()



    const songLength = song.song_length;
    const bpm = song.bpm;


    const [songProgress, setSongProgress] = useState(0)
    const [timer, setTimer] = useState(0)
    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(false);

    const [viewHeight, setViewHeight] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0)
    const [video, setVideo] = useState(null)
    const [timeoutId, setTimeoutId] = useState({});

    const [activeKeys, setActiveKeys] = useState({});
    const [potentialMissedNote, setPotentialMissedNote] = useState(new Set());
    const [inPlayKeys, setInPlayKeys] = useState({});


    const [neverPressedAlert, setNeverPressedAlert] = useState({});
    const [accuracyAlert, setAccuracyAlert] = useState({});
    const [streakCount, setStreakCount] = useState(0);
    const [streakMultiplier, setStreakMultiplier] = useState(1);
    const [noteScore, setNoteScore] = useState({});
    const [scoreQueue, setScoreQueue] = useState([]);
    const [totalScore, setTotalScore] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0)
    const [gameOver, setGameOver] = useState(false);

    const isMountedRef = useRef(false);

    const maxDelay = 400;




    useEffect(() => {
        if (!isMountedRef.current) {

            if (Number(mp3Id) === 1564) {
                setVideo(6)
            } else if (Number(mp3Id) === 5772) {

                setVideo(5)
            } else {
                const videoNumbers = [1, 2, 3, 4]
                const randomIndex = Math.floor(Math.random() * videoNumbers.length);

                if (videoNumbers[randomIndex] === 1) { setVideo(1) }
                else if (videoNumbers[randomIndex] === 2) { setVideo(2) }
                else if (videoNumbers[randomIndex] === 3) { setVideo(3) }
                else if (videoNumbers[randomIndex] === 4) { setVideo(4) }

            }
            isMountedRef.current = true;
        }

    }, [mp3Id])



    const handleRestartGame = () => {
        setIsAnimationStarted(false);
        setIsAnimationStopped(false);
        setTimeoutId({});
        setActiveKeys({});
        setPotentialMissedNote(new Set());
        setInPlayKeys({});
        setNeverPressedAlert({});
        setAccuracyAlert({});
        setStreakCount(0);
        setStreakMultiplier(1)
        setNoteScore({});
        setScoreQueue([]);
        setTotalScore(0)
        setMaxStreak(0)
        setGameOver(false);
    }


    const handleRightTiming = (keyLetter, phrase, score) => {
        const totalNoteScore = score * streakMultiplier;

        setAccuracyAlert(prevState => ({
            ...prevState,
            [keyLetter]: phrase
        }));

        setNoteScore(prevState => ({
            ...prevState,
            [keyLetter]: totalNoteScore
        }));

    };


    const handleWrongTiming = (keyLetter) => {
        if (streakCount !== 0) setStreakCount(0);

        setAccuracyAlert(prevState => ({
            ...prevState,
            [keyLetter]: 'Miss'
        }));
    };


    const checkTiming = (timeDelay) => {
        let phrase;
        let score;

        if (timeDelay >= maxDelay) {
            phrase = 'Miss'
            score = 0;

        } else {
            if ((timeDelay >= 200) && (timeDelay < maxDelay)) {
                phrase = 'Good!'
                score = 1;

            } else if (timeDelay >= 100 && timeDelay < 200) {
                phrase = 'Great!'
                score = 2;

            } else if (timeDelay < 100) {
                phrase = 'Perfect!'
                score = 3;
            }
        }
        return { phrase, score }
    };

    const checkScore = (keyLetter) => {
        if (noteScore.hasOwnProperty(keyLetter)) {
            const score = noteScore[keyLetter]

            setScoreQueue(prevState => [...prevState, score])

            setNoteScore(prevState => {
                const newState = { ...prevState };
                delete newState[keyLetter];
                return newState;
            });
        };

    }



    const handleNeverPressedKey = (keyLetter) => {

        if (streakCount !== 0) setStreakCount(0);
        setPotentialMissedNote((prevSet) => {
            const updatedSet = new Set(prevSet);
            updatedSet.delete(keyLetter);
            return updatedSet;
        });

        setNeverPressedAlert(prevState => ({
            ...prevState,
            [keyLetter]: "Miss"
        }));
    };

    const checkNeverPressedKey = (keyLetter) => {
        if (potentialMissedNote.has(keyLetter)) {
            handleNeverPressedKey(keyLetter);
        };
    };






    const compareToInPlayKey = (keyLetter, startTime) => {

        if (inPlayKeys.hasOwnProperty(keyLetter)) {

            const inPlayKeyEnd = inPlayKeys[keyLetter]['endTime']
            if (inPlayKeyEnd > startTime) {
                //if note is currently in-play

                setPotentialMissedNote((prevSet) => {
                    const updatedSet = new Set(prevSet);
                    updatedSet.delete(keyLetter);
                    return updatedSet;
                });
                const inPlayKeyStart = inPlayKeys[keyLetter]['startTime']
                const timeDelay = startTime - inPlayKeyStart

                const { phrase, score } = checkTiming(timeDelay);
                if (phrase === 'Miss') {
                    handleWrongTiming(keyLetter);
                } else {
                    handleRightTiming(keyLetter, phrase, score);
                }
                return true;
            }
            return false;
        } return false;
    };






    //handle piano notes
    //piano note pressed
    const checkPressedKey = (keyLetter, startTime) => {

        if (!compareToInPlayKey(keyLetter, startTime)) {
            const timeout = setTimeout(() => {
                clearTimeout(timeoutId[keyLetter]);
                if (!compareToInPlayKey(keyLetter, startTime)) {
                    handleWrongTiming(keyLetter);
                }

            }, 300);

            setTimeoutId(prevState => ({
                ...prevState,
                [keyLetter]: { timeout }
            }));
        }
    }

    //piano note released
    const checkReleasedKey = (keyLetter) => {
        checkScore(keyLetter)
    }




    // handling gameNotes
    //gameNote in Play
    const checkKeyInPlay = (keyLetter) => {
        if (!activeKeys.hasOwnProperty(keyLetter)) {
            //if note not currently pressed
            setPotentialMissedNote((prevSet) => new Set([...prevSet, keyLetter]));

        }
    }

    //gameNote out of Play
    const checkKeyOutOfPlay = (keyLetter) => {
        checkNeverPressedKey(keyLetter)
    }







    useEffect(function cleanUpNoteAccuracy() {
        const notes = ["A",
            "W",
            "S",
            "E",
            "D",
            "F",
            "T",
            "G",
            "Y",
            "H",
            "U",
            "J"]

        notes.forEach(note => {
            if (!activeKeys.hasOwnProperty(note)) {
                setAccuracyAlert(prevState => {
                    const newState = { ...prevState };
                    delete newState[note];
                    return newState;

                })
            }
        })

    }, [activeKeys])




    useEffect(function handleScore() {
        let noteTotal = 0;
        if (scoreQueue.length > 0) {
            scoreQueue.forEach((score) => {
                noteTotal = + score;
            });
            setTotalScore(prevState => prevState + noteTotal)
            setScoreQueue([])
            if ((streakCount + 1) > maxStreak) setMaxStreak(streakCount + 1)
            setStreakCount(prevState => prevState + 1)
        }

    }, [scoreQueue])



    useEffect(function handleMultiplier() {
        if (streakCount >= 40) {
            setStreakMultiplier(32)
        } else if (streakCount >= 30) {
            setStreakMultiplier(16)
        } else if (streakCount >= 20) {
            setStreakMultiplier(8)
        } else if (streakCount >= 10) {
            setStreakMultiplier(4)
        } else if (streakCount >= 1) {
            setStreakMultiplier(2)
        } else {
            setStreakMultiplier(1)
        }

    }, [streakCount])



    useEffect(() => {
        // Function to update the view height
        setOnGamePage(true)
        const updateViewHeight = () => {
            setViewHeight(window.innerHeight);
        };

        const updateVideoHeight = () => {
            setVideoHeight(window.innerHeight - 220);
        };
        // Initial view height
        updateViewHeight();
        updateVideoHeight();
        // Event listener for window resize to update view height on resize
        window.addEventListener('resize', updateViewHeight);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', updateViewHeight);
        };
    }, []);

    //handling stream animation
    const handleStartAnimation = () => {
        setIsAnimationStarted(true);
    };

    const handleStopAnimation = () => {
        setIsAnimationStopped(true);
        setIsAnimationStarted(false);
    };

    const getVideo = () => {
        if (video === 1) { return (<source src={video1} type="video/mp4" />) }
        else if (video === 2) { return (<source src={video2} type="video/mp4" />) }
        else if (video === 3) { return (<source src={video3} type="video/mp4" />) }
        else if (video === 4) { return (<source src={video4} type="video/mp4" />) }
        else if (video === 5) { return (<source src={video5} type="video/mp4" />) }
        else if (video === 6) { return (<source src={video6} type="video/mp4" />) }
    }



    if (video === null) return <LoadingSpinner />;

    return (
        <div className="game-page">
            <GameContext.Provider value={{ totalScore, setTimer, viewHeight, streakMultiplier, noteScore, handleRestartGame, gameOver, activeKeys, setActiveKeys, checkPressedKey, checkReleasedKey, inPlayKeys, setInPlayKeys, checkKeyInPlay, checkKeyOutOfPlay, accuracyAlert, setAccuracyAlert, streakMultiplier, songProgress, setSongProgress }}>

                <div className="game-header">{song.title}, {song.dir}</div>
                {!isAnimationStarted ? (<div className="game-get-ready">Get Ready!</div>) : (<div id="game-timer"> {timer}</div>)}
                <ScoreBar />



                <video autoPlay loop id="bgvid" style={{ height: videoHeight }}>
                    {getVideo()}
                </video>

                <div className="game-login-forms">
                    {getFormJSX()}
                </div>


                <Stream setGameOver={setGameOver} songLength={songLength} bpm={bpm} isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                <div className="bottom-container"><Piano /></div>

                <div className="covering-div"></div>
                <GameButtons handleStartAnimation={handleStartAnimation} handleStopAnimation={handleStopAnimation} isAnimationStarted={isAnimationStarted} />

            </GameContext.Provider >

        </div >
    )

};
export default Game;


