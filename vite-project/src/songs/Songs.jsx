import React, { useState, useEffect, useContext } from "react";
import { Outlet } from 'react-router-dom'
import Search from "../common/SearchForm";
import Melodic2API from "../api/api";
import SongCardList from "./SongCardList";
import LoadingSpinner from "../common/LoadingSpinner";
import FallingNotes from "../common/FallingNotes";
import UserContext from "../auth/UserContext";
import LoginForm from "../auth/LoginForm"
import SignupForm from "../auth/SignupForm"
import "./Songs.css"


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const Songs = ({ login, signup }) => {
    const [songs, setSongs] = useState(null);
    const [songsScores, setSongsScores] = useState(null);
    const [genreButton, setGenreButton] = useState(null)
    const { showLogin, showSignup, setShowLogin, setShowSignup, toggleSignupForm, toggleLoginForm } = useContext(UserContext);

    const getFormJSX = () => {
        if (showLogin) {
            return (
                <LoginForm login={login} toggleSignupForm={toggleSignupForm} />)

        } else if (showSignup) {
            return (<SignupForm signup={signup} toggleLoginForm={toggleLoginForm} />)
        }
    }

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

    useEffect(function getAllSongsOnMount() {
        setShowLogin(false);
        setShowSignup(false);
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

        setGenreButton(genre)
        setSongs(songs);
    }

    async function getTopScore(mp3Id) {
        let topScore = await Melodic2API.getSongTopScore(mp3Id)
        return topScore
    }




    if (!songsScores || !songs) return <LoadingSpinner />;

    return (

        <div className="content-container">
            <FallingNotes />
            <div className="songs-container">
                <div className="search-container">
                    <Search searchFor={searchTitle} />
                    <div className="genre-buttons">
                        {genres.map(genre => (

                            <button className={`genre-button ${(genreButton === genre) ? "active" : ""}`} onClick={() => searchGenre(genre)}>{genre}</button>
                        ))}

                    </div>
                </div>
                {songs.length
                    ? <SongCardList songs={songsScores} />
                    : <p className="lead">Sorry, no results were found!</p>
                }
            </div>

            <div className="form-container">
                {getFormJSX()}
            </div>
        </div>


    )

};
export default Songs;

