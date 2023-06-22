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

    useEffect(function getAllSongsOnMount() {
        search();

    }, []);
    console.log(songs)

    /** Triggered by search form submit; reloads songs. */
    async function search(title) {
        console.log(title)
        let songs = await Melodic2API.getAllsongs({ title });
        setSongs(songs);
    }

    if (!songs) return <LoadingSpinner />;

    return (
        <div>
            <Search searchFor={search} />
            {songs.length
                ? <SongCardList songs={songs} />
                : <p className="lead">Sorry, no results were found!</p>
            }
            <Outlet />

        </div>
    )

};
export default Songs;