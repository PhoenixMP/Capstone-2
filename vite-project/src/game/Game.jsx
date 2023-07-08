
import React, { useState, useEffect, useContext } from "react";

import LoadingSpinner from "../common/LoadingSpinner";
import Mp3Player from "./Mp3Player";
import StreamContainer from "./StreamContainer";
import Piano from "./piano/Piano";
import gameContext from "./gameContext";
import musicContext from "../songs/musicContext";
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


    const { song } = useContext(musicContext);
    const [songProgress, setSongProgress] = useState(0)

    const songLength = song.song_length;
    const bpm = song.bpm;




    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(false);

    const [timeoutId, setTimeoutId] = useState({});
    const [missedKey, setMissedKey] = useState(new Set());
    const [inPlayKeys, setInPlayKeys] = useState({});
    const [outOfPlayKeys, setOutOfPlayKeys] = useState({});
    const [activeKeys, setActiveKeys] = useState({});
    const [releasedKeys, setReleasedKeys] = useState({})
    const [keysPlayed, setKeysPlayed] = useState([]);


    const [accuracyAlert, setAccuracyAlert] = useState({})
    const [streakCount, setStreakCount] = useState(0);
    const [streakMultiplier, setStreakMultiplier] = useState(1);
    const [noteScore, setNoteScore] = useState({})
    const [scoreQueue, setScoreQueue] = useState([])
    const [totalScore, setTotalScore] = useState(0);

    const maxDelay = 5000;



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
            setScoreQueue(prevState => [...prevState, score])

            setNoteScore(prevState => {
                const newState = { ...prevState };
                delete newState[keyLetter];
                return newState;
            });
        };
    }

    const compareActiveKeyStart = (keyLetter, startTime) => {
        if (activeKeys.hasOwnProperty(keyLetter)) {
            clearTimeout(timeoutId[keyLetter]);
            const activeKeyStart = activeKeys[keyLetter]['startTime'];
            const timeDelay = Math.abs(activeKeyStart - startTime);

            const { phrase, score } = checkTiming(timeDelay);

            if (phrase === 'Miss') {
                handleWrongTiming(keyLetter);
            } else {
                handleRightTiming(keyLetter, phrase, score);
            }
            return true
        } return false
    }








    const handleNoteRelease = (keyLetter,) => {
        setAccuracyAlert(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        });
        checkScore(keyLetter)
    }







    const compareKeyInPlayStart = (keyLetter, startTime) => {
        if (inPlayKeys.hasOwnProperty(keyLetter)) {
            setMissedKey((prevSet) => {
                const updatedSet = new Set(prevSet);
                updatedSet.delete(keyLetter);
                return updatedSet;
            });
            const type = 'start';
            const isLongNote = inPlayKeys[keyLetter]['isLongNote'];
            const inPlayStart = inPlayKeys[keyLetter]['startTime'];
            const inPlayEnd = inPlayKeys[keyLetter]['endTime']
            const timeDelay = Math.abs(startTime - inPlayStart);
            console.log('keyPress', timeDelay);

            const { phrase, score } = checkTiming(timeDelay);
            if (phrase === 'Miss') {
                handleWrongTiming(type, keyLetter);
            } else {
                handleRightTiming(type, keyLetter, phrase, score, isLongNote, inPlayEnd);
            }
            return true
        } return false
    };






    //handling gameNotes
    // const addKeyInPlay = (keyLetter, startTime, endTime) => {

    //     setInPlayKeys(prevState => ({
    //         ...prevState,
    //         [keyLetter]: { startTime, endTime }
    //     }));

    //     if (!compareActiveKeyStart(keyLetter, startTime, endTime, isLongNote)) {
    //         setMissedKey((prevSet) => new Set(prevSet).add(keyLetter));
    //     }
    // }


    // const removeKeyInPlay = (keyLetter) => {

    //     setInPlayKeys(prevState => {
    //         const newState = { ...prevState };
    //         delete newState[keyLetter];
    //         return newState;
    //     });

    //     if (missedKey.has(keyLetter)) {
    //         if (streakCount !== 0) setStreakCount(0);
    //         setMissedKey((prevSet) => {
    //             const updatedSet = new Set(prevSet);
    //             updatedSet.delete(keyLetter);
    //             return updatedSet;
    //         });
    //     };

    // };
    useEffect(function handleScore() {
        let noteTotal = 0;
        if (scoreQueue.length > 0) {
            scoreQueue.forEach((score) => {
                noteTotal = + score;
            });
            setTotalScore(prevState => prevState + noteTotal)
            setScoreQueue([])
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




    useEffect(function handleActiveKeys() {
        for (const key in activeKeys) {
            // Check if the key is present in prevActiveKeys
            if (prevActiveKeys.hasOwnProperty(key)) {
                const isActive = activeKeys[key];
                const wasActive = prevActiveKeys[key];



            }, [activeKeys])

    useEffect(function handleInPlayKeys() { }, [inPlayKeys])







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
            <gameContext.Provider value={{ activeKeys, setActiveKeys, releasedKeys, setReleasedKeys, outOfPlayKeys, setOutOfPlayKeys, accuracyAlert, inPlayKeys, setInPlayKeys, streakMultiplier, songProgress, setSongProgress }}>
                <div className="game-page-child-1">
                    <div>Streak:{streakCount}</div>
                    <div>Score:{totalScore}</div>


                    <div><Mp3Player handleStartAnimation={handleStartAnimation} handleStopAnimation={handleStopAnimation} /></div>
                </div>


                <div className="game-page-child-2"><StreamContainer songLength={songLength} bpm={bpm} isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                    <div className="piano-container"><Piano /></div>
                </div>
            </gameContext.Provider>

        </div>
    )

};
export default Game;

// keyA_inPlay, setKeyA_inPlay, keyW_inPlay, setKeyW_inPlay, keyS_inPlay, setKeyS_inPlay, keyE_inPlay, setKeyE_inPlay, keyD_inPlay, setKeyD_inPlay, keyF_inPlay, setKeyF_inPlay, keyT_inPlay, setKeyT_inPlay, keyG_inPlay, setKeyG_inPlay, keyY_inPlay, setKeyY_inPlay, keyH_inPlay, setKeyH_inPlay, keyU_inPlay, setKeyU_inPlay, keyJ_inPlay, setKeyJ_inPlay
