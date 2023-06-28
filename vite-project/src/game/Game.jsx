
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
    const [inPlayKeys, setInPlayKeys] = useState([]);
    const [streakMultiplier, setStreakMultiplier] = useState([])
    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(false);
    const [activeKeys, setActiveKeys] = useState({
        'A': { 'active': false, 'timeActive': null },
        'W': { 'active': false, 'timeActive': null },
        'S': { 'active': false, 'timeActive': null },
        'E': { 'active': false, 'timeActive': null },
        'D': { 'active': false, 'timeActive': null },
        'F': { 'active': false, 'timeActive': null },
        'T': { 'active': false, 'timeActive': null },
        'G': { 'active': false, 'timeActive': null },
        'Y': { 'active': false, 'timeActive': null },
        'H': { 'active': false, 'timeActive': null },
        'U': { 'active': false, 'timeActive': null },
        'J': { 'active': false, 'timeActive': null },
    })

    console.debug("Game", "id=", id);


    // //based on keyboard letter
    // const [keyA_inPlay, setKeyA_inPlay] = useState(false);
    // const [keyW_inPlay, setKeyW_inPlay] = useState(false);
    // const [keyS_inPlay, setKeyS_inPlay] = useState(false)
    // const [keyE_inPlay, setKeyE_inPlay] = useState(false)
    // const [keyD_inPlay, setKeyD_inPlay] = useState(false)
    // const [keyF_inPlay, setKeyF_inPlay] = useState(false)
    // const [keyT_inPlay, setKeyT_inPlay] = useState(false)
    // const [keyG_inPlay, setKeyG_inPlay] = useState(false)
    // const [keyY_inPlay, setKeyY_inPlay] = useState(false)
    // const [keyH_inPlay, setKeyH_inPlay] = useState(false)
    // const [keyU_inPlay, setKeyU_inPlay] = useState(false)
    // const [keyJ_inPlay, setKeyJ_inPlay] = useState(false)





    const pressKey = (keyLetter, time) => {
        setActiveKeys(prevState => ({
            ...prevState,
            [keyLetter]: { ...prevState[keyLetter], active: true, timeActive: time }
        }));
    };

    const releaseKey = (keyLetter) => {
        setActiveKeys(prevState => ({
            ...prevState,
            [keyLetter]: { ...prevState[keyLetter], active: false, timeActive: null }
        }));
    };

    const handleStartAnimation = () => {
        setIsAnimationStarted(true);
    };

    const handleStopAnimation = () => {
        console.log('stopping')
        setIsAnimationStopped(true);
        setIsAnimationStarted(false);
    };



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

            <gameContext.Provider value={{ inPlayKeys, activeKeys, streakMultiplier, pressKey, releaseKey }}>
                <div className="game-page-child-2"><StreamContainer isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                    <div className="piano-container"><Piano /></div>
                </div>
            </gameContext.Provider>

        </div>
    )

};
export default Game;

// keyA_inPlay, setKeyA_inPlay, keyW_inPlay, setKeyW_inPlay, keyS_inPlay, setKeyS_inPlay, keyE_inPlay, setKeyE_inPlay, keyD_inPlay, setKeyD_inPlay, keyF_inPlay, setKeyF_inPlay, keyT_inPlay, setKeyT_inPlay, keyG_inPlay, setKeyG_inPlay, keyY_inPlay, setKeyY_inPlay, keyH_inPlay, setKeyH_inPlay, keyU_inPlay, setKeyU_inPlay, keyJ_inPlay, setKeyJ_inPlay
