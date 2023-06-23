import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Melodic2API from "../api/api";
import TrackCardList from "./TrackCardList"
import MidiPlayerComponent from "./midi/MidiPlayer"
import LoadingSpinner from "../common/LoadingSpinner";


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const SongDetails = () => {

    const { midiId } = useParams();
    console.debug("Song", "midiId=", midiId);

    const [song, setSong] = useState(null);

    useEffect(function getSongInfo() {
        async function getSong() {
            setSong(await Melodic2API.getSong(midiId));
        }
        getSong();
    }, [midiId]);


    if (!song) return <LoadingSpinner />;


    return (
        <div>
            <h4>{song.song.title}</h4>
            <br />{song.song.dir}
            <MidiPlayerComponent encodedMidiData={song.midiData} fullSong={true} />
            <br />{<TrackCardList tracks={song.song.nonDrumTrack} midiData={song.midiData} midiId={midiId} />}

        </div>
    )

};
export default SongDetails;


