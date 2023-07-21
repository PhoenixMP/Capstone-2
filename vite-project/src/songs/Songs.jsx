import React, { useState, useEffect } from "react";
import { Outlet } from 'react-router-dom'
import Search from "../common/SearchForm";
import Melodic2API from "../api/api";
import SongCardList from "./SongCardList";
import LoadingSpinner from "../common/LoadingSpinner";
import "./Songs.css"


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const Songs = () => {
    const [songs, setSongs] = useState(null);
    const [songsScores, setSongsScores] = useState(null);

    const genres = [
        "pop",
        "disco",
        "rock",
        "alt rock",
        "hip hop",
        "movie",
        "tv",
        "video games"
    ];

    useEffect(function getAllSongsOnMount() {
        searchTitle();
    }, []);


    useEffect(function getSongScores() {
        if (songs !== null) {
            // Use Promise.all to wait for all the getTopScore calls to complete
            Promise.all(songs.map(song => getTopScore(song.mp3_id)))
                .then(topScores => {
                    // Map the resolved topScores to the corresponding songs
                    const songsWithTopScores = songs.map((song, index) => ({
                        ...song,
                        topScore: topScores[index]
                    }));
                    setSongsScores(songsWithTopScores);
                })
                .catch(error => {
                    console.error("Error getting top scores:", error);
                    setSongsScores(songs); // In case of an error, set the songs without top scores
                });
        }
    }, [songs]);


    /** Triggered by search form submit; reloads songs. */
    async function searchTitle(title) {

        let songs = await Melodic2API.getAllSongs({ title, dir: title });
        setSongs(songs);
    }


    /** Triggered by search form submit; reloads songs. */
    async function searchGenre(genre) {
        let songs = await Melodic2API.searchGenre({ genre });

        console.log('genre search', songs)
        setSongs(songs);
    }

    async function getTopScore(mp3Id) {
        let topScore = await Melodic2API.getSongTopScore(mp3Id)
        return topScore
    }


    if (!songsScores) return <LoadingSpinner />;

    return (
        <div>
            <Search searchFor={searchTitle} />
            <div className="radio-inputs">
                {genres.map(genre => (
                    <label className="radio">
                        <button onClick={() => searchGenre(genre)}>{genre}</button>
                    </label>
                ))}

            </div>

            {songs.length
                ? <SongCardList songs={songsScores} />
                : <p className="lead">Sorry, no results were found!</p>
            }
            <Outlet />
        </div>


    )

};
export default Songs;