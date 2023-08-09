
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



/**Routed at /game/:mp3Id
 
    The `Game` component manages the gameplay mechanics and user interactions on the game page.
    It handles piano note events, calculates scoring accuracy, displays pop-up prompts, and renders
    different game states.

    - Functions related to handling user interactions and prompts.
    - `checkPressedKey` and `checkReleasedKey`: Manage piano note events and scoring accuracy.
    - `checkKeyInPlay` and `checkKeyOutOfPlay`: Handle game note in-play and out-of-play events.
    - `getPopUp`: Dynamically generates different pop-up prompts based on state.
    - Functions for calculating and updating scoring accuracy and streaks.
    - Functions for rendering different game stages, explanations, and user prompts.
    - `checkForStreamers`: Renders streamer elements based on game over and player performance.
    

    Returns:
    The component renders a game container with various game elements, context providers,
    scoring accuracy updates, streak announcements, pop-up prompts, explanations, and streamers.

 @component
 @return {JSX.Element} game component
 @memberof MyRoutes
 @see {@link MyRoutes}
*/



const Game = () => {


    const { song, encodedData, setHasRefreshedGame } = useContext(MusicContext);
    const { getFormJSX, setOnGamePage, userBestScore, topScore, currentUser, setUserBeatTop, userBeatTop, setUserBeatPersonalBest, userBeatPersonalBest, setTotalScore, totalScore, recalcGameResults, setRecalcGameResults } = useContext(UserContext)
    const { mp3Id } = useParams()
    const navigate = useNavigate();

    const audioRef = useRef(null);



    const songLength = song.song_length;
    const bpm = song.bpm;

    // State variables for tracking song progress, timer, animation state, and view height
    const [songProgress, setSongProgress] = useState(0)
    const [timer, setTimer] = useState(0)
    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(false);
    const [viewHeight, setViewHeight] = useState(0);

    // State variables for managing timeouts
    const [timeoutId, setTimeoutId] = useState({});

    // State variables for managing active keys, potential missed notes, and in-play keys
    const [activeKeys, setActiveKeys] = useState({});
    const [potentialMissedNote, setPotentialMissedNote] = useState(new Set());
    const [inPlayKeys, setInPlayKeys] = useState({});
    const inPlayKeysRef = useRef(inPlayKeys)

    // State variables for handling accuracy alerts and streaks
    const [neverPressedAlert, setNeverPressedAlert] = useState({});
    const [accuracyAlert, setAccuracyAlert] = useState({});
    const [streakCount, setStreakCount] = useState(0);
    const [streakMultiplier, setStreakMultiplier] = useState(1);
    const [noteScore, setNoteScore] = useState({});
    const [scoreQueue, setScoreQueue] = useState([]);
    const [maxStreak, setMaxStreak] = useState(0)
    const [streakAnnounce, setStreakAnnounce] = useState(null)

    // State variables for managing game over, reset, exit, save early prompts, and game explanation
    const [gameOver, setGameOver] = useState(false);
    const [resetPrompt, setResetPrompt] = useState(false);
    const [exitPrompt, setExitPrompt] = useState(false);
    const [saveEarlyPrompt, setSaveEarlyPrompt] = useState(false)
    const [gameExplain, setGameExplain] = useState(true)


    //Max allowed delay (ms) between key-press and in-play note in order to score. 
    const maxDelay = 200;

    //Store the inPlayKeys state in a ref to be later accessed in live-time via a set-timeout
    useEffect(() => {
        inPlayKeysRef.current = inPlayKeys;
    }, [inPlayKeys]);


    // handleRestartGame: Reset all game-related states for a game restart
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


    // getGameResults: Determine if the user achieved new high scores and set appropriate flags
    const getGameResults = () => {
        if ((!topScore || (totalScore > topScore.score)) && totalScore > 0) setUserBeatTop(true);
        if (currentUser && (totalScore > 0) && ((userBestScore && totalScore > userBestScore.score) || !userBestScore)) setUserBeatPersonalBest(true)
    }

    //Reset the flag for reclaculating game results after game results are calculated
    useEffect(() => {
        getGameResults();
        if (recalcGameResults && userBestScore !== null) setRecalcGameResults(false)
    }, [recalcGameResults, userBestScore, gameOver])

    //Remove the GameExplain component for logged-in users
    useEffect(() => {
        const setGameExplain = () => {
            if (currentUser) {
                setGameExplain(false)
            }
        }
    })

    //Animating Stream~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Function to start the stream animation
    const handleStartAnimation = () => {
        setIsAnimationStarted(true);
    };

    // Function to stop the stream animation
    const handleStopAnimation = () => {
        setIsAnimationStopped(true);
        setIsAnimationStarted(false);
    };


    // useEffect to set up the audio element and handle audio playback
    useEffect(() => {
        if (encodedData === null) {
            setHasRefreshedGame(true)
            navigate(`/song/${mp3Id}`);
            return
        }

        // Decode the base64 encoded audio data
        const decodedData = base64.decode(encodedData);
        const audioElement = new Audio();

        // Set the audio source to the decoded MP3 binary data
        audioElement.src = 'data:audio/mp3;base64,' + btoa(decodedData); // Set the MP3 binary data as the audio source
        audioRef.current = audioElement; // Assign the audio element to the ref
        audioRef.current.volume = 0.1

        return () => {
            audioElement.pause();
            audioElement.src = '';
        };
    }, [encodedData]);


    // Function to play the audio after a delay
    const handlePlay = () => {
        if (audioRef.current) {
            setTimeout(() => {
                audioRef.current.play();
                handleStartAnimation();;
            }, 3000);
        }
    };


    // Function to stop audio playback and reset animation
    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.load(); // Reset the audio source
            handleStopAnimation();
        }
    };


    // useEffect to initialize the game and handle audio progress
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




    //Game Play~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    // Handle correct timing for a key press
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

    // Handle wrong timing for a key press
    const handleWrongTiming = (keyLetter) => {
        if (streakCount !== 0) setStreakCount(0);
        setStreakAnnounce(null)

        setAccuracyAlert(prevState => ({
            ...prevState,
            [keyLetter]: 'Miss'
        }));
    };

    // Check timing and determine the accuracy phrase and score
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

    // Check score and update the score queue and note score
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


    // Handle when a user completely misses key and update streak count and missed notes
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

    // Check for never-pressed key and invoke handling function if necessary
    const checkNeverPressedKey = (keyLetter) => {
        if (potentialMissedNote.has(keyLetter)) {
            handleNeverPressedKey(keyLetter);
        };
    };


    // Function to compare an active key with currently in-play keys for timing accuracy
    // and update potential missed notes.
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


    // Function to compare an in-play key's to the active keys for timing accuracy
    // and update potential missed notes.
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




    // Handle piano key presses, check timing accuracy, and set timeouts for delayed accuracy checks if the key was pressed early.
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

    // Handle piano key releases, check scoring, and update note score and queue.
    const checkReleasedKey = (keyLetter) => {
        checkScore(keyLetter)
    }




    // Handle game note in play, update potential missed notes, and check timing accuracy against active keys.
    const checkKeyInPlay = (keyLetter, startTime) => {
        if (!compareToActiveKey(keyLetter, startTime)) {
            setPotentialMissedNote((prevSet) => new Set([...prevSet, keyLetter]))
        }
    }

    // Handle game note out of play, check for never-pressed keys, and update accuracy alerts for the note.
    const checkKeyOutOfPlay = (keyLetter) => {
        checkNeverPressedKey(keyLetter)
    }



    // Clean up accuracy alerts for inactive keys.
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


    // Calculate and update scores based on the score queue.
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


    // Adjust streak multiplier and announcement based on the streak count.
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


    //Handling game page components~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Handling button components
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


    // Generating pop-up elements for different prompts
    const getPopUp = () => {
        if (resetPrompt) {
            return (<>
                <PopUpConfirm message={'Are you sure you want to restart?'} handleYes={handleRestart} handleNo={handleRestartPrompt} />
                <div className='pop-up-cover'></div>
            </>)

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


    // Displaying streamers if game over and player performance is significant
    const checkForStreamers = () => {
        if (gameOver && (userBeatTop || !topScore)) {
            return (<Streamers />)
        }

    }

    // Determining JSX for the game over screen based on user performance
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


    // Determining JSX for various stages of the game
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


    // Handling game explanation and removal
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


    // Rendering the main game component

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


