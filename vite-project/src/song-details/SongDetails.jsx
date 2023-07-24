import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "../songs/MusicContext";
import userContext from "../auth/UserContext";
import FallingNotes from "../common/FallingNotes";

import LoginForm from "../auth/LoginForm"
import SignupForm from "../auth/SignupForm"
import ScorelessLeaderboard from "./ScorelessLeaderboard";
import Leaderboard from "./Leaderboard";

import './Leaderboard.css'
import './recordPlayer.css'
import './SongDetails.css'


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const SongDetails = ({ login, signup }) => {

    const { mp3Id } = useParams();
    const navigate = useNavigate();



    const { song, setSong, setNotes, setEncodedData, setHasRefreshedGame, hasRefreshedGame } = useContext(musicContext);
    const { setUserHasTop, currentUser, userBestScore, setUserBestScore, topScore, setTopScore, showLogin, showSignup, toggleSignupForm, toggleLoginForm, setShowLogin, setShowSignup } = useContext(userContext);
    const [runnerUpScores, setRunnerUpScores] = useState(null);




    const navigateGame = () => {
        // navigate to /
        if (hasRefreshedGame) setHasRefreshedGame(false);
        navigate(`/game/${mp3Id}`);
    };


    const getFormJSX = () => {
        if (showLogin) {
            return (
                <LoginForm login={login} toggleSignupForm={toggleSignupForm} />)

        } else if (showSignup) {
            return (<SignupForm signup={signup} toggleLoginForm={toggleLoginForm} />)
        }
    }


    const getLeaderboardJSX = () => {
        if (topScore) {
            return (<Leaderboard topScore={topScore} runnerUpScores={runnerUpScores} navigateGame={navigateGame} song={song} />)
        } else if (!topScore && !runnerUpScores) {
            return (<ScorelessLeaderboard song={song} navigateGame={navigateGame} />)
        }
    }



    useEffect(function getSongInfo() {
        setShowLogin(false);
        setShowSignup(false);
        async function getSong() {
            const newSong = await Melodic2API.getSong(mp3Id);
            setSong(newSong.song);
            setNotes(newSong.notes.notes)

            setEncodedData(newSong.mp3Data.encodedSong)
        }
        getSong();


    }, [mp3Id]);



    useEffect(function getScoreInfo() {

        async function getUserBestScore() {
            const score = await Melodic2API.getUserSongTopScore(mp3Id, currentUser.username);
            console.log('userbestscore', score)
            if (score === null) {
                setUserBestScore(false);
            } else {
                setUserBestScore(score);
            }
        }

        async function getGeneralScores() {
            const scores = await Melodic2API.getSongAllScores(mp3Id);

            if (scores.length === 0) {
                setTopScore(false);
                setUserHasTop(false);
                setUserBestScore(false);
                setRunnerUpScores(false);
            } else {
                if (currentUser) {

                    if (scores[0].username === currentUser.username) {
                        setUserHasTop(true)
                        setUserBestScore(false)
                    } else {
                        getUserBestScore();
                    }

                }
                setTopScore(scores[0]);
                scores.shift()
                setRunnerUpScores(scores)
            }
        }

        getGeneralScores();

    }, [currentUser]);







    if (!song || !song === true || (currentUser && userBestScore === null) || runnerUpScores === null) return <LoadingSpinner />;


    return (
        <div className="song-details-container">
            <FallingNotes />
            {getLeaderboardJSX()}
            <div className="form-container">
                {getFormJSX()}
            </div>
        </div>
    )

};
export default SongDetails;





