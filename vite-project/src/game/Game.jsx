
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import MidiPlayerComponent from "../songs/midi/MidiPlayer"
import StreamContainer from "./StreamContainer";
import Piano from "./piano/Piano";
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
    console.debug("Game", "id=", id);


    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(false);
    const { trackNotes, setTrackNotes, track, setTrack } = useContext(musicContext);


    useEffect(function getTrackInfo() {
        async function getTrack() {
            const newTrack = await Melodic2API.getTrack(id, { type: "non_drum_tracks" });
            console.log(`testing: ${id}`, track)
            setTrack(newTrack)
            setTrackNotes(newTrack.notes.reverse())

        }
        getTrack()
    }, [midiId, id]);

    if (!trackNotes) return <LoadingSpinner />;




    const handleStartAnimation = () => {
        setIsAnimationStarted(true);
    };

    const handleStopAnimation = () => {
        console.log('stopping')
        setIsAnimationStopped(true);
        setIsAnimationStarted(false);
    };



    return (
        <div className="game-page-parent">
            <div className="game-page-child-1">
                <MidiPlayerComponent fullSong={true} />
                <button onClick={handleStartAnimation}>Start</button>
                <button onClick={handleStopAnimation}>Stop</button>

            </div>
            <div className="game-page-child-2"><StreamContainer isAnimationStarted={isAnimationStarted} isAnimationStopped={isAnimationStopped} />
                <div className="piano-container"><Piano /></div>
            </div>
        </div>
    )

};
export default Game;