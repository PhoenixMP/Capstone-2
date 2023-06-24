import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Melodic2API from "../api/api";
import TrackCardList from "./TrackCardList"
import MidiPlayerComponent from "./midi/MidiPlayer"
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "./musicContext";



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
    const { song, setSong } = useContext(musicContext);
    console.log(song)

    useEffect(function getSongInfo() {
        async function getSong() {
            const newSong = await Melodic2API.getSong(midiId);
            setSong(newSong);

        }
        getSong();

    }, [midiId]);


    if (!song || !song === true) return <LoadingSpinner />;


    return (
        <div>
            <h4>{song.song.title}</h4>
            <br />{song.song.dir}

            <MidiPlayerComponent fullSong={true} />
            <br />{<TrackCardList />}
        </div>
    )

};
export default SongDetails;


