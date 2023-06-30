
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import MidiPlayerComponent from "../songs/midi/MidiPlayer"
import StreamContainer from "./StreamContainer";
import Piano from "./piano/Piano";
import gameContext from "./gameContext";
import musicContext from "../songs/musicContext";
import "./Game.css"
import { log } from "tone/build/esm/core/util/Debug";
import { start } from "tone";



/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const Game = () => {


    const { midiId, id } = useParams();
    const { trackNotes, setTrackNotes, track, setTrack } = useContext(musicContext);

    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(false);

    const [timeoutId, setTimeoutId] = useState({});
    const [missedKey, setMissedKey] = useState(new Set());
    const [inPlayKeys, setInPlayKeys] = useState({});
    const [activeKeys, setActiveKeys] = useState({});
    const [keysPlayed, setKeysPlayed] = useState([]);
    const [lastInPlay, setLastInPlay] = useState({})


    const [accuracyAlert, setAccuracyAlert] = useState({})


    const [streakCount, setStreakCount] = useState(0);
    const [streakMultiplier, setStreakMultiplier] = useState(1);
    const [startNoteScore, setStartNoteScore] = useState({})
    const [endNoteScore, setEndNoteScore] = useState({})
    const [scoreQueue, setScoreQueue] = useState([])
    const [totalScore, setTotalScore] = useState(0);

    const maxDelay = 4000;



    // console.log('streakCount:', streakCount);
    // console.log('streakMultiplier:', streakMultiplier);
    // console.log('totalScore:', totalScore);



    const resetNote = (keyLetter) => {
        setAccuracyAlert(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        });
        if (startNoteScore.hasOwnProperty(keyLetter) && endNoteScore.hasOwnProperty(keyLetter)) {
            const score = startNoteScore[keyLetter] + endNoteScore[keyLetter]
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
        };
    };


    const handleRightTiming = (type, keyLetter, phrase, score) => {
        if (type === 'start') {
            setAccuracyAlert(prevState => ({
                ...prevState,
                [keyLetter]: phrase
            }));

            setStartNoteScore(prevState => ({
                ...prevState,
                [keyLetter]: score * streakMultiplier
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
            if (startNoteScore.hasOwnProperty(keyLetter)) {
                setEndNoteScore(prevState => ({
                    ...prevState,
                    [keyLetter]: 0
                }));
            }
            resetNote(keyLetter);
        }
    };


    const checkPhrase = (type, keyLetter, phrase, score) => {
        if (phrase === 'Miss') {
            handleWrongTiming(type, keyLetter);
        } else {
            handleRightTiming(type, keyLetter, phrase, score);
        }
    };


    const checkTiming = (type, keyLetter, timeDelay) => {
        let phrase;
        let score;

        if (timeDelay >= maxDelay) {
            phrase = 'Miss'
            score = 0;
        } else if ((timeDelay >= 1000) && (timeDelay < maxDelay)) {
            phrase = 'Good!'
            score = 1;
        } else if (timeDelay >= 100 && timeDelay < 500) {
            phrase = 'Great!'
            score = 2;
        } else if (timeDelay < 100) {
            phrase = 'Perfect!'
            score = 3;
        }
        checkPhrase(type, keyLetter, phrase, score);
    };



    const compareKeyStarts = (keyLetter, startTime, callBackCount) => {
        console.log('comparing key start')
        console.log('callbackcount', callBackCount)
        if (inPlayKeys.hasOwnProperty(keyLetter)) {
            console.log('we pressed an in-play-key')

            setMissedKey((prevSet) => {
                const updatedSet = new Set(prevSet);
                updatedSet.delete(keyLetter);
                return updatedSet;
            });

            const inPlayStart = inPlayKeys[keyLetter]['startTime']
            const timeDelay = Math.abs(startTime - inPlayStart)
            console.log('timeDelay start', timeDelay)
            console.log('about to checking timing of keypress')
            checkTiming('start', keyLetter, timeDelay)
        } else {
            if (callBackCount > 0) {
                handleWrongTiming('start', keyLetter)
                return;

            } else {
                const timeout = setTimeout(() => {
                    clearTimeout(timeoutId[keyLetter]);
                    compareKeyStarts(keyLetter, startTime, callBackCount + 1);
                }, 100);

                setTimeoutId(prevState => ({
                    ...prevState,
                    [keyLetter]: { timeout }
                }));
            }
        }
    };


    const compareKeyEnds = (keyLetter, endTime) => {
        if (inPlayKeys.hasOwnProperty(keyLetter)) {

            setMissedKey((prevSet) => {
                const updatedSet = new Set(prevSet);
                updatedSet.delete(keyLetter);
                return updatedSet;
            });

            const inPlayEnd = inPlayKeys[keyLetter]['endTime'];
            const timeDelay = Math.abs(endTime - inPlayEnd);
            console.log(`released early, TimeDelay: ${timeDelay}`)
            checkTiming('end', keyLetter, timeDelay);
        } else {
            if (lastInPlay.hasOwnProperty(keyLetter)) {
                const inPlayEnd = lastInPlay[keyLetter]['endTime'];
                const timeDelay = Math.abs(endTime - inPlayEnd);
                console.log(`released late, timedelay: ${timeDelay}`)
                checkTiming('end', keyLetter, timeDelay);
            } else {
                handleWrongTiming('end', keyLetter)
            }
        }
    };




    //handling played keys
    const pressKey = (keyLetter, startTime) => {
        setActiveKeys(prevState => ({
            ...prevState,
            [keyLetter]: { startTime }
        }));
        console.log('activeKeys', activeKeys)
        compareKeyStarts(keyLetter, startTime, 0)
    };



    const releaseKey = (keyLetter, startTime, endTime) => {
        setActiveKeys(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        })
        compareKeyEnds(keyLetter, endTime);

        setKeysPlayed(prevState => [{ 'keyLetter': keyLetter, 'startTime': startTime, 'endTime': endTime }, ...prevState])
    };



    //handling gameNotes
    const addKeyInPlay = (keyLetter, startTime, endTime) => {

        setInPlayKeys(prevState => ({
            ...prevState,
            [keyLetter]: { startTime, endTime }
        }));
        console.log('inplay keys', inPlayKeys)
        if (!activeKeys.hasOwnProperty(keyLetter)) {
            setMissedKey((prevSet) => new Set(prevSet).add(keyLetter));
        }
    };


    const removeKeyInPlay = (keyLetter, endTime) => {

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

        setLastInPlay(prevState => ({
            ...prevState,
            [keyLetter]: { endTime }
        }))
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

    useEffect(function getTrackInfo() {
        async function getTrack() {
            const newTrack = await Melodic2API.getTrack(id, { type: "non_drum_tracks" });
            setTrack(newTrack)
            setTrackNotes(newTrack.notes.reverse())

        }
        getTrack()
    }, [midiId, id]);

    if (!trackNotes) return <LoadingSpinner />;






    return (
        <div className="game-page-parent">
            <div className="game-page-child-1">
                <MidiPlayerComponent fullSong={true} />
                <div>Streak:{streakCount}</div>
                <div>Score:{totalScore}</div>

                <button onClick={handleStartAnimation}>Start</button>
                <button onClick={handleStopAnimation}>Stop</button>
            </div>

            <gameContext.Provider value={{ accuracyAlert, inPlayKeys, activeKeys, removeKeyInPlay, addKeyInPlay, streakMultiplier, pressKey, releaseKey }}>
                <div className="game-page-child-2"><StreamContainer isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                    <div className="piano-container"><Piano /></div>
                </div>
            </gameContext.Provider>

        </div>
    )

};
export default Game;

// keyA_inPlay, setKeyA_inPlay, keyW_inPlay, setKeyW_inPlay, keyS_inPlay, setKeyS_inPlay, keyE_inPlay, setKeyE_inPlay, keyD_inPlay, setKeyD_inPlay, keyF_inPlay, setKeyF_inPlay, keyT_inPlay, setKeyT_inPlay, keyG_inPlay, setKeyG_inPlay, keyY_inPlay, setKeyY_inPlay, keyH_inPlay, setKeyH_inPlay, keyU_inPlay, setKeyU_inPlay, keyJ_inPlay, setKeyJ_inPlay
