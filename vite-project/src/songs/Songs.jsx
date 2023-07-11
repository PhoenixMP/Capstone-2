import React, { useState, useEffect } from "react";
import { Outlet } from 'react-router-dom'
import Search from "../common/SearchForm";
import Melodic2API from "../api/api";
import SongCardList from "./SongCardList";
import LoadingSpinner from "../common/LoadingSpinner";

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
    const [genre, setGenre] = useState(null);
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


    if (!songs) return <LoadingSpinner />;

    return (
        <div>
            <Search searchFor={searchTitle} />
            <div>{genres.map(genre => (
                <button key={genre} onClick={() => searchGenre(genre)}>{genre}</button>
            ))}
            </div>
            <div>
                {songs.length
                    ? <SongCardList songs={songs} />
                    : <p className="lead">Sorry, no results were found!</p>
                }
                <Outlet />
            </div>

        </div>
    )

};
export default Songs;