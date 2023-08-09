import React, { Suspense, useState, useEffect, useContext } from "react";
import { useErrorBoundary } from 'react-error-boundary'
import Search from "../common/SearchForm";
import NoteworthyAPI from "../api/api";
import SongCardList from "./SongCardList";
import LoadingSpinner from "../common/LoadingSpinner";
import FallingNotes from "../common/FallingNotes";
import UserContext from "../auth/UserContext";
import useAsyncError from "../hooks/useAsyncError";

import "./Songs.css"


/**
 * Routed at /songs

 * Component to display a list of songs with search and genre filter options.
 *
 * This component fetches and displays a list of songs from the API. It includes
 * search functionality by title and genre filters. The song list is shown as
 * SongCardList components with additional features.
 *
 * @component
 * @return {JSX.Element} Songs component
 * @memberof MyRoutes
 * @see {@link MyRoutes}
 */


const Songs = () => {

    const [songs, setSongs] = useState(null);
    const [songsScores, setSongsScores] = useState(null);
    const [genreButton, setGenreButton] = useState(null)
    const [loading, setLoading] = useState(true);
    const { getFormJSX, setOnGamePage, setShowLogin, setShowSignup } = useContext(UserContext);



    const throwError = useAsyncError();


    const genres = [
        "pop",
        "disco",
        "rock",
        "alt rock",
        "hip hop",
        "movie",
        "tv",
        "video game"

    ];

    // Fetch all songs and scores on component mount
    useEffect(function getAllSongsOnMount() {
        setLoading(true);
        setOnGamePage(false)
        setShowLogin(false);
        setShowSignup(false);
        searchTitle();

    }, []);

    // Fetch song scores and associate with songs
    useEffect(function getSongScores() {
        if (songs !== null) {

            async function compareScores() {
                let scores = await NoteworthyAPI.getAllTopScores()
                const songWithScores = songs.map((song) => {
                    const mp3Id = song.mp3_id;
                    const matchingScore = scores.find((score) => score.mp3Id === mp3Id);
                    if (matchingScore) {
                        song.username = matchingScore.username;
                    }
                    return song;
                })
                setSongsScores(songWithScores)
            }


            try {
                compareScores()
            } catch (error) {

                console.error("Error getting top scores:", error);
                setSongsScores(songs); // In case of an error, set the songs without top scores


            } finally {
                setLoading(false);
            }


        }
    }, [songs]);






    /** Triggered by search form submit; reloads songs. */
    async function searchTitle(title) {
        try {
            let songs = await NoteworthyAPI.getAllSongs({ title, dir: title });
            setSongs(songs);
        } catch (error) {
            throwError(new Error("Async Error"))
        }


    }

    /** Triggered by clicking genre button; reloads songs. */
    async function searchGenre(genre) {

        let songs = await NoteworthyAPI.searchGenre({ genre });

        setGenreButton(genre)
        setSongs(songs);
    }



    if (!songsScores || !songs) return <LoadingSpinner />;

    return (
        <div className="songs-page common-background">

            {loading ? <LoadingSpinner /> :
                (
                    <>
                        <div className="songs-decoration">
                            <FallingNotes />

                        </div>
                        <div className="songs-content-container">
                            <div className="songs-container">
                                <div className="search-container">
                                    <Search searchFor={searchTitle} />
                                    <div className="genre-buttons">
                                        {genres.map(genre => (

                                            <button className={`genre-button ${(genreButton === genre) ? "active" : ""}`} onClick={() => searchGenre(genre)}>{genre}</button>
                                        ))}

                                    </div>
                                </div>
                                {songs.length ? (
                                    <SongCardList songs={songsScores} />
                                ) : (
                                    <p className="lead">Sorry, no results were found!</p>
                                )}
                            </div>

                            <div className="form-container">
                                {getFormJSX()}
                            </div>
                        </div>
                    </>
                )}

        </div>

    )

};
export default Songs;

