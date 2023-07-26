
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import base64 from 'react-native-base64';



import Stream from "./game-pieces/Stream";
import Piano from "./game-pieces/piano/Piano";
import BackgroundVideo from "./game-pieces/BackgroundVideo";

import LeftStats from "./game-info/LeftStats"
import RightStats from "./game-info/RightStats"
import ScoreBar from "./game-info/ScoreBar"

import Streamers from "./game-info/Streamers";
import NewScorePage from "./game-info/NewScorePage";
import NoScorePage from "./game-info/NoScorePage"



import GameContext from "./GameContext";
import MusicContext from "../songs/MusicContext";
import UserContext from "../auth/UserContext";


import "./Game.css"


const Game = () => {


    const { song, encodedData, setHasRefreshedGame } = useContext(MusicContext);
    const { getFormJSX, setOnGamePage, topScore, currentUser } = useContext(UserContext)
    const { mp3Id } = useParams()
    const navigate = useNavigate();

    const audioRef = useRef(null);



    const songLength = song.song_length;
    const bpm = song.bpm;


    const [songProgress, setSongProgress] = useState(0)
    const [timer, setTimer] = useState(0)
    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(false);
    const [viewHeight, setViewHeight] = useState(0);


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
    const [userBeatTop, setUserBeatTop] = useState(false)
    const [userBeatPersonalBest, setUserBeatPersonalBest] = useState(false)



    const maxDelay = 400;


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
        setUserBeatPersonalBest(false);
        setUserBeatTop(false);
    }




    //Animating Stream~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //handling stream animation
    const handleStartAnimation = () => {
        setIsAnimationStarted(true);
    };

    const handleStopAnimation = () => {
        setIsAnimationStopped(true);
        setIsAnimationStarted(false);
    };

    useEffect(() => {
        if (encodedData === null) {

            setHasRefreshedGame(true)
            navigate(`/song/${mp3Id}`);
            return
        }
        const decodedData = base64.decode(encodedData);
        const audioElement = new Audio();
        audioElement.src = 'data:audio/mp3;base64,' + btoa(decodedData); // Set the MP3 binary data as the audio source

        audioRef.current = audioElement; // Assign the audio element to the ref
        audioRef.current.volume = 0.1

        return () => {
            audioElement.pause();
            audioElement.src = '';
        };
    }, [encodedData]);



    useEffect(() => {
        setOnGamePage(true)
        let animationFrameId;

        handlePlay()


        const updateProgress = () => {
            const currentTime = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            const progress = currentTime / duration;

            setSongProgress(progress);
            animationFrameId = requestAnimationFrame(updateProgress);
        };

        if (audioRef.current) {
            animationFrameId = requestAnimationFrame(updateProgress);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handlePlay = () => {
        if (audioRef.current) {
            setTimeout(() => {
                audioRef.current.play();
                handleStartAnimation();;
            }, 2000);
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.load(); // Reset the audio source
            handleStopAnimation();
        }
    };




    //Game Play~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



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







    const checkForStreamers = () => {
        if (gameOver && (userBeatTop || !topScore)) {
            return (<Streamers />)
        }

    }



    const getGameOverJSX = () => {
        if (userBeatTop || !topScore) {
            return (<NewScorePage isTop={true} />)
        } if (userBeatPersonalBest || !currentUser) {
            return (<NewScorePage isTop={false} />)
        } if (!userBeatPersonalBest) {
            return (<NoScorePage />)
        }
    }


    const getGameJSX = () => {
        if (!isAnimationStarted && !gameOver) {
            return (<div className="game-get-ready">Get Ready!</div>)
        } else if (isAnimationStarted && !gameOver) {
            return (
                <>
                    {topScore ? <ScoreBar /> : ""}
                    <LeftStats />
                    <RightStats />
                </>
            )
        } else if (gameOver) {
            return (
                <div className="game-over-screen">
                    {getFormJSX()}
                    {getGameOverJSX()}
                </div>
            )
        }
    }





    return (
        <div className="game-container">
            <GameContext.Provider value={{ viewHeight, setViewHeight, handleStop, handlePlay, handleStartAnimation, handleStopAnimation, isAnimationStarted, userBeatPersonalBest, setUserBeatPersonalBest, userBeatTop, setUserBeatTop, totalScore, timer, setTimer, streakMultiplier, noteScore, handleRestartGame, setGameOver, gameOver, activeKeys, setActiveKeys, checkPressedKey, checkReleasedKey, inPlayKeys, setInPlayKeys, checkKeyInPlay, checkKeyOutOfPlay, accuracyAlert, setAccuracyAlert, streakMultiplier, songProgress, setSongProgress }}>
                <div className="game-header">{song.title}, {song.dir}</div>
                <BackgroundVideo />
                {checkForStreamers()}

                {getGameJSX()}

                <Stream setGameOver={setGameOver} songLength={songLength} bpm={bpm} isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                <div className="bottom-container"><Piano /></div>
                <div className="covering-div"></div>
            </GameContext.Provider >
        </div >
    )

};
export default Game;


