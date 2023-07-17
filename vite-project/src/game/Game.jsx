
import React, { useState, useEffect, useContext } from "react";

import LoadingSpinner from "../common/LoadingSpinner";
import Mp3Player from "./Mp3Player";
import StreamContainer from "./StreamContainer";
import Piano from "./piano/Piano";
import ScoreDisplay from "./ScoreDisplay";
import SaveScore from "./SaveScore";
import GameContext from "./GameContext";
import MusicContext from "../songs/MusicContext";
import "./Game.css"





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
    const [songProgress, setSongProgress] = useState(0)

    const songLength = song.song_length;
    const bpm = song.bpm;




    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(false);

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

    const maxDelay = 1000;

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
        console.log('played note right:', keyLetter)
        const totalNoteScore = score * streakMultiplier;
        console.log('noteScore for:', keyLetter, totalNoteScore)

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
        console.log('played note wrong:', keyLetter)
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
            if ((timeDelay >= 500) && (timeDelay < maxDelay)) {
                phrase = 'Good!'
                score = 1;

            } else if (timeDelay >= 100 && timeDelay < 500) {
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
            console.log('score added to que,', keyLetter, score)
            setScoreQueue(prevState => [...prevState, score])

            setNoteScore(prevState => {
                const newState = { ...prevState };
                delete newState[keyLetter];
                return newState;
            });
        };

    }


    const handleNoteRelease = (keyLetter,) => {
        console.log('handleNoteRelease', keyLetter
        )
        setAccuracyAlert(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        });
        checkScore(keyLetter)
    }

    const handleNeverPressedKey = (keyLetter) => {
        console.log("key never played", keyLetter)
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
                console.log('you pressed a note that is in-play:', keyLetter)
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
                    console.log('you pressed the note too early:', keyLetter)
                    handleWrongTiming(keyLetter);
                }

            }, 500);

            setTimeoutId(prevState => ({
                ...prevState,
                [keyLetter]: { timeout }
            }));
        }
    }

    //piano note released
    const checkReleasedKey = (keyLetter) => {
        console.log('going to handle the note release')
        handleNoteRelease(keyLetter);
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











    useEffect(function handleScore() {
        let noteTotal = 0;
        if (scoreQueue.length > 0) {
            scoreQueue.forEach((score) => {
                noteTotal = + score;
            });
            setTotalScore(prevState => prevState + noteTotal)
            setScoreQueue([])
            if ((streakCount + 1) > maxStreak) setMaxStreak(streakCount + 1)
            console.log('new max streak:', streakCount + 1)
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





    //handling stream animation
    const handleStartAnimation = () => {
        setIsAnimationStarted(true);
    };

    const handleStopAnimation = () => {
        setIsAnimationStopped(true);
        setIsAnimationStarted(false);
    };




    return (
        <div className="game-page-parent">
            <GameContext.Provider value={{ handleRestartGame, gameOver, activeKeys, setActiveKeys, checkPressedKey, checkReleasedKey, inPlayKeys, setInPlayKeys, checkKeyInPlay, checkKeyOutOfPlay, accuracyAlert, streakMultiplier, songProgress, setSongProgress }}>
                <div className="game-page-child-1">
                    <div>{song.title}, {song.dir}</div>
                    <ScoreDisplay />

                    {gameOver ? <SaveScore score={totalScore} /> : ""}
                    <div>Score:{totalScore}</div>
                    {!gameOver ? (<div>Streak:{streakCount}</div>) : (<div> Your Max Streak:{maxStreak}</div>)}
                    {(isAnimationStarted && !gameOver) ? (<div>Time Left: {Math.floor(songLength - (songProgress * songLength))}</div>) : ""}


                    <div><Mp3Player handleStartAnimation={handleStartAnimation} isAnimationStarted={isAnimationStarted} handleStopAnimation={handleStopAnimation} /></div>
                </div>


                <div className="game-page-child-2"><StreamContainer setGameOver={setGameOver} songLength={songLength} bpm={bpm} isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                    <div className="piano-container"><Piano /></div>
                </div>
            </GameContext.Provider>

        </div>
    )

};
export default Game;
