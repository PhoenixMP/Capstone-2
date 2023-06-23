
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import MidiPlayer from 'react-midi-player';
import StreamContainer from "./StreamContainer"



/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const Game = () => {

    const { id, midiId } = useParams();
    console.debug("track", "id=", id);

    const [track, setTrack] = useState(null);
    const [trackNotes, setTrackNotes] = useState(null);
    const [song, setSong] = useState(null);

    useEffect(function getInfo() {
        async function getSong() {
            const song = await Melodic2API.getSong(midiId);
            setSong(song);
        }
        async function getTrack() {
            const track = await Melodic2API.getTrack(id, { type: "non_drum_tracks" });
            setTrack(track)
            setTrackNotes(track.notes.reverse())
        }
        getSong();
        getTrack()
    }, [midiId, id]);


    if (!song) return <LoadingSpinner />;
    if (!track) return <LoadingSpinner />;

    return (
        <div className="game parent">
            <div className="game child"><MidiPlayer encodedMidiData={song.midiData} fullSong={true} autoPlay /></div>
            <StreamContainer trackNotes={trackNotes} songLength={song.song.song_length} bpm={song.song.bpm} />
        </div>
    )

};
export default Game;