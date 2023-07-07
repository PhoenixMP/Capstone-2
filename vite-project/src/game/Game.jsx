
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import Melodic2API from "../api/api";
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


    const { mp3Id, id } = useParams();
    const { notes, setNotes, song } = useContext(musicContext);

    const songLength = song.song_length;
    const bpm = song.bpm;




    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(false);

    const [timeoutId, setTimeoutId] = useState({});
    const [missedKey, setMissedKey] = useState(new Set());
    const [inPlayKeys, setInPlayKeys] = useState({});
    const [activeKeys, setActiveKeys] = useState({});
    const [keysPlayed, setKeysPlayed] = useState([]);


    const [accuracyAlert, setAccuracyAlert] = useState({})
    const [streakCount, setStreakCount] = useState(0);
    const [streakMultiplier, setStreakMultiplier] = useState(1);
    const [startNoteScore, setStartNoteScore] = useState({})
    const [endNoteScore, setEndNoteScore] = useState({})
    const [scoreQueue, setScoreQueue] = useState([])
    const [totalScore, setTotalScore] = useState(0);

    const maxDelay = 5000;





    // console.log('streakCount:', streakCount);
    // console.log('streakMultiplier:', streakMultiplier);
    // console.log('totalScore:', totalScore);

    // console.log('accuracyAlert', accuracyAlert)
    // console.log(startNoteScore)
    // console.log(scoreQueue)


    const resetNote = (keyLetter) => {
        setAccuracyAlert(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        });
    }


    const handleRightTiming = (type, keyLetter, phrase, score, isLongNote, requiredEndTime) => {
        if (type === 'start') {

            setAccuracyAlert(prevState => ({
                ...prevState,
                [keyLetter]: phrase
            }));

            const startScore = score * streakMultiplier
            setStartNoteScore(prevState => ({
                ...prevState,
                [keyLetter]: { score: startScore, isLongNote: isLongNote, requiredEndTIme: requiredEndTime }
            }));



        } else if (type === 'end') {

            if (startNoteScore.hasOwnProperty(keyLetter)) {
                setEndNoteScore(prevState => ({
                    ...prevState,
                    [keyLetter]: score * streakMultiplier
                }));
                resetNote(keyLetter);
            }
        }
    };

    const handleWrongTiming = (type, keyLetter) => {

        if (streakCount !== 0) setStreakCount(0);

        if (type === 'start') {
            setAccuracyAlert(prevState => ({
                ...prevState,
                [keyLetter]: 'Miss'
            }));




        } else if (type === 'end') {

            setEndNoteScore(prevState => ({
                ...prevState,
                [keyLetter]: 0
            }));
            resetNote(keyLetter);
        }
    }



    const checkTiming = (timeDelay) => {
        let phrase;
        let score;

        if (timeDelay >= maxDelay) {
            phrase = 'Miss'
            score = 0;
        } else if ((timeDelay >= 500) && (timeDelay < maxDelay)) {
            phrase = 'Good!'
            score = 1;
        } else if (timeDelay >= 100 && timeDelay < 500) {
            phrase = 'Great!'
            score = 2;
        } else if (timeDelay < 100) {
            phrase = 'Perfect!'
            score = 3;
        }

        return { phrase, score }
    };





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


    const compareActiveKeyStart = (keyLetter, startTime, endTime, isLongNote) => {
        if (activeKeys.hasOwnProperty(keyLetter)) {
            clearTimeout(timeoutId[keyLetter]);
            const type = 'start';
            const activeKeyStart = activeKeys[keyLetter]['startTime'];
            const timeDelay = Math.abs(activeKeyStart - startTime);
            console.log(`early keypress TimeDelay`, timeDelay);

            const { phrase, score } = checkTiming(timeDelay);

            if (phrase === 'Miss') {
                handleWrongTiming(type, keyLetter);
            } else {
                handleRightTiming(type, keyLetter, phrase, score, isLongNote, endTime);
            }
            return true
        } return false
    }


    const compareKeyEnds = (keyLetter, endTime) => {
        //if correctly Played start of long note:
        if (startNoteScore.hasOwnProperty(keyLetter) && startNoteScore[keyLetter].isLongNote) {
            const type = 'end';
            const requiredEndTime = startNoteScore[keyLetter]['requiredEndTime'];
            const timeDelay = Math.abs(endTime - requiredEndTime);

            const { phrase, score } = checkTiming(timeDelay);
            if (phrase === 'Miss') {
                handleWrongTiming(type, keyLetter);
            } else {
                handleRightTiming(type, keyLetter, phrase, score);
            }
        }
        setAccuracyAlert(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        });
    }




    //handling played keys
    const pressKey = (keyLetter, startTime) => {

        setActiveKeys(prevState => ({
            ...prevState,
            [keyLetter]: { startTime }
        }));

        if (!compareKeyInPlayStart(keyLetter, startTime)) {
            const timeout = setTimeout(() => {
                clearTimeout(timeoutId[keyLetter]);
                console.log('next keypress val will be timeout keypress')
                if (!compareKeyInPlayStart(keyLetter, startTime)) {

                    handleWrongTiming('start', keyLetter);
                }

            }, 100);

            setTimeoutId(prevState => ({
                ...prevState,
                [keyLetter]: { timeout }
            }));
        }
    };



    const releaseKey = (keyLetter, startTime, endTime) => {
        setActiveKeys(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        })
        compareKeyEnds(keyLetter, endTime);
        checkScore(keyLetter);

        setKeysPlayed(prevState => [{ 'keyLetter': keyLetter, 'startTime': startTime, 'endTime': endTime }, ...prevState])
    };



    //handling gameNotes
    const addKeyInPlay = (keyLetter, startTime, endTime, isLongNote) => {

        setInPlayKeys(prevState => ({
            ...prevState,
            [keyLetter]: { startTime, endTime, isLongNote }
        }));

        if (!compareActiveKeyStart(keyLetter, startTime, endTime, isLongNote)) {
            setMissedKey((prevSet) => new Set(prevSet).add(keyLetter));
        }
    }


    const removeKeyInPlay = (keyLetter) => {

        setInPlayKeys(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        });

        if (missedKey.has(keyLetter)) {
            if (streakCount !== 0) setStreakCount(0);
            setMissedKey((prevSet) => {
                const updatedSet = new Set(prevSet);
                updatedSet.delete(keyLetter);
                return updatedSet;
            });
        };

    };


    const checkScore = (keyLetter) => {

        let score;
        if (startNoteScore.hasOwnProperty(keyLetter)) {

            if (!startNoteScore[keyLetter].isLongNote) {


                score = startNoteScore[keyLetter]['score']
                setScoreQueue(prevState => [...prevState, score])

                setStartNoteScore(prevState => {
                    const newState = { ...prevState };
                    delete newState[keyLetter];
                    return newState;
                });
            } else if (startNoteScore[keyLetter].isLongNote && endNoteScore.hasOwnProperty[keyLetter]) {
                score = startNoteScore[keyLetter]['score'] + endNoteScore[keyLetter];
                setScoreQueue(prevState => [...prevState, score])

                setStartNoteScore(prevState => {
                    const newState = { ...prevState };
                    delete newState[keyLetter];
                    return newState;
                });
                setEndNoteScore(prevState => {
                    const newState = { ...prevState };
                    delete newState[keyLetter];
                    return newState;
                });
            }
        }
    };


    //handling stream animation
    const handleStartAnimation = () => {
        setIsAnimationStarted(true);
    };

    const handleStopAnimation = () => {
        setIsAnimationStopped(true);
        setIsAnimationStarted(false);
    };


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







    return (
        <div className="game-page-parent">
            <div className="game-page-child-1">
                <div>Streak:{streakCount}</div>
                <div>Score:{totalScore}</div>


                <div><Mp3Player handleStartAnimation={handleStartAnimation} handleStopAnimation={handleStopAnimation} /></div>
            </div>

            <gameContext.Provider value={{ accuracyAlert, inPlayKeys, activeKeys, removeKeyInPlay, addKeyInPlay, streakMultiplier, pressKey, releaseKey }}>
                <div className="game-page-child-2"><StreamContainer songLength={songLength} bpm={bpm} isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                    <div className="piano-container"><Piano /></div>
                </div>
            </gameContext.Provider>

        </div>
    )

};
export default Game;

// keyA_inPlay, setKeyA_inPlay, keyW_inPlay, setKeyW_inPlay, keyS_inPlay, setKeyS_inPlay, keyE_inPlay, setKeyE_inPlay, keyD_inPlay, setKeyD_inPlay, keyF_inPlay, setKeyF_inPlay, keyT_inPlay, setKeyT_inPlay, keyG_inPlay, setKeyG_inPlay, keyY_inPlay, setKeyY_inPlay, keyH_inPlay, setKeyH_inPlay, keyU_inPlay, setKeyU_inPlay, keyJ_inPlay, setKeyJ_inPlay
