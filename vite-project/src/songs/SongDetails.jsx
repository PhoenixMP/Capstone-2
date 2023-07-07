import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Melodic2API from "../api/api";
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

    const { mp3Id } = useParams();
    const navigate = useNavigate();


    const { song, setSong, setNotes } = useContext(musicContext);
    console.log(song)


    const navigateGame = () => {
        // navigate to /
        navigate(`/game/${mp3Id}`);
    };

    useEffect(function getSongInfo() {
        async function getSong() {
            const newSong = await Melodic2API.getSong(mp3Id);
            setSong(newSong);
            setNotes(newSong.notes)

        }
        getSong();

    }, [mp3Id]);


    if (!song || !song === true) return <LoadingSpinner />;


    return (
        <div>
            <h4>{song.song.title}</h4>
            <br />{song.song.dir}
            <br /> <button onClick={navigateGame}>Play!</button>


        </div>
    )

};
export default SongDetails;


