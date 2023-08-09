import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NoteworthyAPI from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "../songs/MusicContext";
import userContext from "../auth/UserContext";
import FallingNotes from "../common/FallingNotes";


import ScorelessLeaderboard from "./ScorelessLeaderboard";
import Leaderboard from "./Leaderboard";

import './Leaderboard.css'
import './recordPlayer.css'
import './SongDetails.css'



/**
 * Routed at /song/:mp3Id
 * Component for displaying details and leaderboard of a song.
 *
 * Displays song details, a leaderboard if available, and a form for login/signup.
 * Handles navigation to the game page.
 *
 * @component
 * @return {JSX.Element} SongDetails component
 *  * @memberof MyRoutes
 * @see {@link MyRoutes}
 */




const SongDetails = () => {

    const { mp3Id } = useParams();
    const navigate = useNavigate();



    const { song, setSong, setNotes, setEncodedData, setHasRefreshedGame, hasRefreshedGame } = useContext(musicContext);
    const { getUserBestScore, getFormJSX, setOnGamePage, onGamePage, setUserHasTop, currentUser, userBestScore, setUserBestScore, topScore, setTopScore, setShowLogin, setShowSignup } = useContext(userContext);
    const [runnerUpScores, setRunnerUpScores] = useState(null);




    /**
     * Function to navigate to the game page for the current song.
     */
    const navigateGame = () => {
        // navigate to /
        if (hasRefreshedGame) setHasRefreshedGame(false);
        navigate(`/game/${mp3Id}`);
    };


    /**
     * Get JSX for the appropriate leaderboard component based on available scores.
     *
     * @return {JSX.Element} JSX for the leaderboard component
     */
    const getLeaderboardJSX = () => {
        if (topScore) {
            return (<Leaderboard topScore={topScore} runnerUpScores={runnerUpScores} navigateGame={navigateGame} song={song} />)
        } else if (!topScore && !runnerUpScores) {
            return (<ScorelessLeaderboard song={song} navigateGame={navigateGame} />)
        }
    }


    // Fetch song details and notes on component mount
    useEffect(function getSongInfo() {
        if (!onGamePage) {
            setOnGamePage(false)
            setShowLogin(false);
            setShowSignup(false);
            async function getSong() {
                const newSong = await NoteworthyAPI.getSong(mp3Id);
                setSong(newSong.song);
                setNotes(newSong.notes.notes)

                setEncodedData(newSong.mp3Data.encodedSong)
            }
            getSong();

        }
    }, [mp3Id, onGamePage]);


    // Fetch leaderboard scores on component mount
    useEffect(function getScoreInfo() {

        if (!onGamePage) {
            async function getGeneralScores() {
                const scores = await NoteworthyAPI.getSongTopScores(mp3Id);


                if (scores.length === 0) {
                    setTopScore(false);
                    setUserHasTop(false);
                    setUserBestScore(false);
                    setRunnerUpScores(false);
                } else {
                    if (currentUser) {
                        getUserBestScore(mp3Id, currentUser.username, scores[0]);
                    }
                    setTopScore(scores[0]);
                    setRunnerUpScores(scores.slice(1))
                }

            }

            getGeneralScores();
        }

    }, [currentUser, onGamePage]);







    if (!song || !song === true || (currentUser && userBestScore === null) || runnerUpScores === null) return <LoadingSpinner />;


    return (
        <div className="song-details-container common-background">
            <FallingNotes />
            {getLeaderboardJSX()}
            <div className="form-container">
                {getFormJSX()}
            </div>
        </div>
    )

};
export default SongDetails;





