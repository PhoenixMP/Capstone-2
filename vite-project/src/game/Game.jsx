
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
    const [inPlayKeys, setInPlayKeys] = useState({});
    const [activeKeys, setActiveKeys] = useState({});
    const [keysPlayed, setKeysPlayed] = useState([]);
    const [lastInPlay, setLastInPlay] = useState({})


    const [accuracyAlert, setAccuracyAlert] = useState({})

    const [accuracyStatus, setAccuracyStatus] = useState({
        'A': { 'acurate': false },
        'W': { 'acurate': false },
        'S': { 'acurate': false },
        'E': { 'acurate': false },
        'D': { 'acurate': false },
        'F': { 'acurate': false },
        'T': { 'acurate': false },
        'G': { 'acurate': false },
        'Y': { 'acurate': false },
        'H': { 'acurate': false },
        'U': { 'acurate': false },
        'J': { 'acurate': false }
    })
    const [streakCount, setStreakCount] = useState(0);
    const [streakMultiplier, setStreakMultiplier] = useState(1);
    const [startNoteScore, setStartNoteScore] = useState({})
    const [endNoteScore, setEndNoteScore] = useState({})
    const [totalScore, setTotalScore] = useState(0);



    // useEffect(() => {
    //     console.log('inPlayKeys:', inPlayKeys)
    // }, [inPlayKeys])

    // useEffect(() => {
    //     console.log('activeKeys:', activeKeys)
    // }, [activeKeys])
    // useEffect(() => {
    //     console.log('startNoteScore:', startNoteScore)
    // }, [startNoteScore])
    // useEffect(() => {
    //     console.log('endNoteScore:', endNoteScore)
    // }, [endNoteScore])
    useEffect(() => {
        if (Object.keys(accuracyAlert).length !== 0) {
            console.log('accuracyAlert:', accuracyAlert)
        }
    }, [accuracyAlert])


    useEffect(() => {
        console.log('streakCount:', streakCount)
    }, [streakCount])

    useEffect(() => {
        console.log('streakMultiplier:', streakMultiplier)
    }, [streakMultiplier])

    useEffect(() => {
        console.log('totalScore:', totalScore)
    }, [totalScore])








    const resetNote = (keyLetter) => {
        setAccuracyStatus(prevState => ({
            ...prevState,
            [keyLetter]: { 'accurate': false }
        }));
        setAccuracyAlert(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        });

    }


    const handleRightTiming = (type, keyLetter, phrase, score) => {
        if (type === 'start') {

            setAccuracyStatus(prevState => ({
                ...prevState,
                [keyLetter]: { 'accurate': true }
            }));

            setAccuracyAlert(prevState => ({
                ...prevState,
                [keyLetter]: phrase
            }));

            setStartNoteScore(prevState => ({
                ...prevState,
                [keyLetter]: score * streakMultiplier
            }));


        } else if (type === 'end') {

            if (startNoteScore[keyLetter]) {


                setEndNoteScore(prevState => ({
                    ...prevState,
                    [keyLetter]: score * streakMultiplier
                }));

            } else {
                setStartNoteScore(prevState => {
                    const newState = { ...prevState };
                    delete newState[keyLetter];
                    return newState;
                });
            }
            resetNote(keyLetter);
        }
    }

    const handleWrongTiming = (type, keyLetter) => {
        setStreakCount(0)
        console.log(type)

        if (type === 'start') {
            console.log('missed the key!')

            setAccuracyStatus(prevState => ({
                ...prevState,
                [keyLetter]: { 'accurate': false }
            }));

            setAccuracyAlert(prevState => ({
                ...prevState,
                [keyLetter]: 'Miss'
            }));


        } else if (type === 'end') {
            console.log('Lost they key!')


            setEndNoteScore(prevState => ({
                ...prevState,
                [keyLetter]: 0
            }));




            resetNote(keyLetter);
        }
    }






    const checkTiming = (type, keyLetter, timeDelay) => {

        let phrase;
        let score;

        if (timeDelay >= 1000) {
            phrase = 'Miss'
            score = 0;
        } else if (timeDelay >= 50 && timeDelay < 1000) {
            phrase = 'Good!'
            score = 1;
        } else if (timeDelay >= 30 && timeDelay < 50) {
            phrase = 'Great!'
            score = 2;

        } else if (timeDelay < 30) {
            phrase = 'Perfect!'
            score = 3;
        }

        checkPhrase(type, keyLetter, phrase, score);
    }


    const checkPhrase = (type, keyLetter, phrase, score) => {
        if (phrase === 'Miss') {
            handleWrongTiming(type, keyLetter)
        } else {
            handleRightTiming(type, keyLetter, phrase, score)
        }
    }


    //handling played keys
    const pressKey = (keyLetter, startTime) => {
        // Check if the key is active
        if (inPlayKeys.hasOwnProperty(keyLetter)) {
            const inPlayStart = inPlayKeys[keyLetter]['startTime']
            const timeDelay = Math.abs(startTime - inPlayStart) - 3000
            checkTiming('start', keyLetter, timeDelay)
            console.log('normalkeypress, timedelay', timeDelay)

        } else {

            const timeout = setTimeout(() => {
                clearTimeout(timeoutId[keyLetter]);
                if (inPlayKeys.hasOwnProperty(keyLetter)) {
                    const inPlayStart = inPlayKeys[keyLetter]['startTime']
                    const timeDelay = Math.abs(startTime - inPlayStart) - 3000
                    console.log('delaykeypress, timedelay', timeDelay)
                    checkTiming('start', keyLetter, timeDelay)

                } else {
                    handleWrongTiming('start', keyLetter)

                }
            }, 100);

            setTimeoutId(prevState => ({
                ...prevState,
                [keyLetter]: { timeout }
            }));; // Store the new timeout ID

        }

        setActiveKeys(prevState => ({
            ...prevState,
            [keyLetter]: { startTime }
        }));
    };


    const releaseKey = (keyLetter, startTime, endTime) => {
        if (inPlayKeys.hasOwnProperty(keyLetter)) {
            const inPlaystart = inPlayKeys[keyLetter]['startTime'];
            const inPlayEnd = inPlaystart + inPlayKeys[keyLetter]['noteLength'];
            const timeDelay = Math.abs(endTime - inPlayEnd);
            console.log(`releasekey TimeDelay`, timeDelay)
            checkTiming('end', keyLetter, timeDelay);
            clearTimeout(timeoutId[keyLetter]);
        }



        setActiveKeys(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        })
        setKeysPlayed(prevState => [{ 'keyLetter': keyLetter, 'startTime': startTime, 'endTime': endTime }, ...prevState])

    };


    //handling gameNotes
    const addKeyInPlay = (keyLetter, startTime, noteLength) => {

        setInPlayKeys(prevState => ({
            ...prevState,
            [keyLetter]: { startTime, noteLength }
        }));

    };

    const removeKeyInPlay = (keyLetter, endTime) => {


        setInPlayKeys(prevState => {
            const newState = { ...prevState };
            delete newState[keyLetter];
            return newState;
        });
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
        let noteTotal;
        if (endNoteScore !== {}) {
            Object.keys(endNoteScore).forEach((key) => {
                noteTotal = + (startNoteScore[key] + endNoteScore[key]);
                setStreakCount(prevState => prevState + 1)

                setEndNoteScore(prevState => {
                    const newState = { ...prevState };
                    delete newState[key];
                    return newState;
                });
                setStartNoteScore(prevState => {
                    const newState = { ...prevState };
                    delete newState[key];
                    return newState;
                });
                setTotalScore(prevState => prevState + noteTotal)
            });
        }

    }, [endNoteScore])



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
                <button onClick={handleStartAnimation}>Start</button>
                <button onClick={handleStopAnimation}>Stop</button>
            </div>

            <gameContext.Provider value={{ accuracyStatus, inPlayKeys, activeKeys, removeKeyInPlay, addKeyInPlay, streakMultiplier, pressKey, releaseKey }}>
                <div className="game-page-child-2"><StreamContainer isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                    <div className="piano-container"><Piano /></div>
                </div>
            </gameContext.Provider>

        </div>
    )

};
export default Game;

// keyA_inPlay, setKeyA_inPlay, keyW_inPlay, setKeyW_inPlay, keyS_inPlay, setKeyS_inPlay, keyE_inPlay, setKeyE_inPlay, keyD_inPlay, setKeyD_inPlay, keyF_inPlay, setKeyF_inPlay, keyT_inPlay, setKeyT_inPlay, keyG_inPlay, setKeyG_inPlay, keyY_inPlay, setKeyY_inPlay, keyH_inPlay, setKeyH_inPlay, keyU_inPlay, setKeyU_inPlay, keyJ_inPlay, setKeyJ_inPlay
