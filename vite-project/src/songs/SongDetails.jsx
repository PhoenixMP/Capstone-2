import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "../songs/musicContext";



/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const SongDetails = () => {

    const { mp3Id } = useParams();
    const navigate = useNavigate();


    const { song, setSong, setNotes, encodedData, setEncodedData } = useContext(musicContext);
    console.log(song)
    console.log("encodedData", encodedData)


    const navigateGame = () => {
        // navigate to /
        navigate(`/game/${mp3Id}`);
    };

    useEffect(function getSongInfo() {
        async function getSong() {
            const newSong = await Melodic2API.getSong(mp3Id);
            setSong(newSong.song);
            setNotes(newSong.notes.notes)

            setEncodedData(newSong.mp3Data.encodedSong)
        }
        getSong();


    }, [mp3Id]);


    if (!song || !song === true) return <LoadingSpinner />;


    return (
        <div>
            <h4>{song.title}</h4>
            <br />{song.dir}
            <br /> <button onClick={navigateGame}>Play!</button>


        </div>
    )

};
export default SongDetails;


