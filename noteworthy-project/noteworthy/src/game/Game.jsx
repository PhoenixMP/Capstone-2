
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
import PopUpConfirm from "./game-info/PopUpConfirm";
import GameExplain from "./game-info/GameExplain";
import CountdownTimer from "./game-info/CountdownTimer";



import GameContext from "./GameContext";
import MusicContext from "../songs/MusicContext";
import UserContext from "../auth/UserContext";

import LoadingSpinner from "../common/LoadingSpinner";

import "./Game.css"






const Game = () => {


    const { song, encodedData, setHasRefreshedGame } = useContext(MusicContext);
    const { userHasTop, getFormJSX, setOnGamePage, userBestScore, topScore, currentUser, setUserBeatTop, userBeatTop, setUserBeatPersonalBest, userBeatPersonalBest, setTotalScore, totalScore, recalcGameResults, setRecalcGameResults } = useContext(UserContext)
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
    const inPlayKeysRef = useRef(inPlayKeys)


    const [neverPressedAlert, setNeverPressedAlert] = useState({});
    const [accuracyAlert, setAccuracyAlert] = useState({});
    const [streakCount, setStreakCount] = useState(0);
    const [streakMultiplier, setStreakMultiplier] = useState(1);
    const [noteScore, setNoteScore] = useState({});
    const [scoreQueue, setScoreQueue] = useState([]);
    const [maxStreak, setMaxStreak] = useState(0)
    const [streakAnnounce, setStreakAnnounce] = useState(null)

    const [gameOver, setGameOver] = useState(false);

    const [resetPrompt, setResetPrompt] = useState(false);
    const [exitPrompt, setExitPrompt] = useState(false);
    const [saveEarlyPrompt, setSaveEarlyPrompt] = useState(false)
    const [gameExplain, setGameExplain] = useState(true)


    useEffect(() => {
        inPlayKeysRef.current = inPlayKeys;
    }, [inPlayKeys]);





    const maxDelay = 200;


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
        setStreakAnnounce(null)
        setMaxStreak(0)
        setGameOver(false);
        setUserBeatPersonalBest(false);
        setUserBeatTop(false);
    }


    const getGameResults = () => {
        if ((!topScore || (totalScore > topScore.score)) && totalScore > 0) setUserBeatTop(true);
        if (currentUser && (totalScore > 0) && ((userBestScore && totalScore > userBestScore.score) || !userBestScore)) setUserBeatPersonalBest(true)
    }

    useEffect(() => {

        getGameResults();
        if (recalcGameResults && userBestScore !== null) setRecalcGameResults(false)
    }, [recalcGameResults, userBestScore, gameOver])


    useEffect(() => {
        const setGameExplain = () => {
            if (currentUser) {
                setGameExplain(false)
            }
        }
    })

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
        handleRestartGame();
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
            }, 3000);
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
        setStreakAnnounce(null)

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
            if ((timeDelay >= 100) && (timeDelay < maxDelay)) {
                phrase = 'Good!'
                score = 1;

            } else if (timeDelay >= 50 && timeDelay < 100) {
                phrase = 'Great!'
                score = 2;

            } else if (timeDelay < 50) {
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
                const timeDelay = Math.abs(startTime - inPlayKeyStart)

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


    const compareToActiveKey = (keyLetter, startTime) => {

        if (activeKeys.hasOwnProperty(keyLetter)) {
            const activeKeyStart = activeKeys[keyLetter]
            const timeDelay = Math.abs(activeKeyStart - startTime)
            const { phrase, score } = checkTiming(timeDelay);
            if (phrase === 'Miss') {
                handleWrongTiming(keyLetter);
            } else {
                handleRightTiming(keyLetter, phrase, score);
            }
            return true;
        }
        return false;
    };



    //handle piano notes
    //piano note pressed
    const checkPressedKey = (keyLetter, startTime) => {

        if (!compareToInPlayKey(keyLetter, startTime)) {
            const timeout = setTimeout(() => {
                clearTimeout(timeoutId[keyLetter]);
                if (!inPlayKeysRef.current.hasOwnProperty(keyLetter) ||
                    (inPlayKeysRef.current[keyLetter]['endTime'] < startTime)) {
                    handleWrongTiming(keyLetter);
                }

            }, maxDelay);

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
    const checkKeyInPlay = (keyLetter, startTime) => {
        if (!compareToActiveKey(keyLetter, startTime)) {
            setPotentialMissedNote((prevSet) => new Set([...prevSet, keyLetter]))
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
            setStreakAnnounce("40 Note Streak!")
            setStreakMultiplier(32)
        } else if (streakCount >= 30) {
            setStreakAnnounce("30 Note Streak!")
            setStreakMultiplier(16)
        } else if (streakCount >= 20) {
            setStreakAnnounce("20 Note Streak!")
            setStreakMultiplier(8)
        } else if (streakCount >= 10) {
            setStreakAnnounce("10 Note Streak!")
            setStreakMultiplier(4)
        } else if (streakCount >= 1) {
            setStreakAnnounce(null)
            setStreakMultiplier(2)
        } else {
            setStreakMultiplier(1)
            setStreakAnnounce(null)
        }

    }, [streakCount])















    const handleSaveEarlyPrompt = () => {
        setSaveEarlyPrompt(prev => !prev)
        setExitPrompt(false)
        setResetPrompt(false)
    }

    const handleSaveEarly = () => {
        handleStop();
        setSaveEarlyPrompt(false);
        setGameOver(true);
        setGameExplain(false);
    }


    const handleExit = () => {
        setOnGamePage(false)
        navigate(`/song/${mp3Id}`);
    }


    const handleRestart = () => {
        handleStop();
        handleRestartGame();
        setResetPrompt(false)
        handlePlay();
    }



    const handleExitPrompt = () => {
        setExitPrompt(prev => !prev)
    }


    const handleRestartPrompt = () => {
        setResetPrompt(prev => !prev)
    }


    const getPopUp = () => {
        if (resetPrompt) {
            return (<>
                <PopUpConfirm message={'Are you sure you want to restart?'} handleYes={handleRestart} handleNo={handleRestartPrompt} />
                <div className='pop-up-cover'></div>
            </>

            )

        } else if (exitPrompt) {
            return (<>
                <PopUpConfirm message={'Are you sure you want to exit the game?'} handleYes={handleExit} handleNo={handleExitPrompt} />
                <div className='pop-up-cover'></div>
            </>)

        } else if (saveEarlyPrompt) {
            return (<>
                <PopUpConfirm message={'Are you sure you want to save score early?'} handleYes={handleSaveEarly} handleNo={handleSaveEarlyPrompt} />
                <div className='pop-up-cover'></div>
            </>)
        }

    }



    const checkForStreamers = () => {
        if (gameOver && (userBeatTop || !topScore)) {
            return (<Streamers />)
        }

    }





    const getGameOverJSX = () => {

        if (currentUser && userBestScore === null) {
            return (<LoadingSpinner />)
        } else {

            if ((userBeatTop || !topScore) && totalScore > 0) {
                return (<NewScorePage isTop={true} />)
            } else if (currentUser && !userBeatTop && (userBeatPersonalBest || !userBestScore) && totalScore > 0) {
                return (<NewScorePage isTop={false} />)
            } else if ((!userBeatTop && !currentUser) || (!userBeatTop && userBeatPersonalBest === false)) {
                return (<NoScorePage />)
            }
        }
    }


    const getGameJSX = () => {

        if (!isAnimationStarted && !gameOver) {
            return (<div className="game-get-ready"><CountdownTimer /></div>)
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
    const handleRemoveExplain = () => {
        setGameExplain(prev => !prev)
    }

    const getGameExplain = () => {
        if (!currentUser && gameExplain && !gameOver) {
            return (
                <GameExplain handleRemoveExplain={handleRemoveExplain} />
            )
        }
    }



    return (
        <div className="game-container">
            <GameContext.Provider value={{ handleSaveEarlyPrompt, handleRestartPrompt, handleExitPrompt, handleExit, handleRestart, getGameResults, viewHeight, setViewHeight, handleStop, handlePlay, handleStartAnimation, handleStopAnimation, isAnimationStarted, timer, setTimer, streakMultiplier, noteScore, handleRestartGame, setGameOver, gameOver, activeKeys, setActiveKeys, checkPressedKey, checkReleasedKey, inPlayKeys, setInPlayKeys, checkKeyInPlay, checkKeyOutOfPlay, accuracyAlert, setAccuracyAlert, streakMultiplier, songProgress, setSongProgress }}>
                <div className="game-header">{song.title}, {song.dir}</div>
                <BackgroundVideo />
                {checkForStreamers()}
                {streakAnnounce ? (<div key={streakAnnounce} className="game-streak">{streakAnnounce}</div>) : ""}
                {getGameJSX()}
                {getPopUp()}
                {getGameExplain()}
                <Stream setGameOver={setGameOver} songLength={songLength} bpm={bpm} isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                <div className="bottom-container"><Piano /></div>
                <div className="covering-div"></div>
            </GameContext.Provider >
        </div >
    )

};
export default Game;


