import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "./MusicContext";
import userContext from "../auth/UserContext";
import SongScoreList from "../scores/SongScoreList"
import SongScoreCard from "../scores/SongScoreCard";

import Leaderboard from "./Leaderboard";
import TopScoreOnly from "./TopScoreOnly";
import './Leaderboard.css'



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



    const { song, setSong, setNotes, setEncodedData, setHasRefreshedGame, hasRefreshedGame } = useContext(musicContext);
    const { currentUser, userBestScore, setUserBestScore, topScore, setTopScore } = useContext(userContext);
    const [userHasTop, setUserHasTop] = useState(false);
    const [runnerUpScores, setRunnerUpScores] = useState(null);




    const navigateGame = () => {
        // navigate to /
        if (hasRefreshedGame) setHasRefreshedGame(false);
        navigate(`/game/${mp3Id}`);
    };


    const navigateSongs = () => {
        navigate(`/songs`);
    };


    console.log('topScore', topScore)
    console.log('runnerUpScores', runnerUpScores)

    useEffect(function getSongInfo() {
        async function getSong() {
            const newSong = await Melodic2API.getSong(mp3Id);
            setSong(newSong.song);
            setNotes(newSong.notes.notes)

            setEncodedData(newSong.mp3Data.encodedSong)
        }
        getSong();


    }, [mp3Id]);



    useEffect(function getScoreInfo() {
        async function getGeneralScores() {
            const scores = await Melodic2API.getSongAllScores(mp3Id);
            console.log("scores", scores)

            if (scores.length === 0) {
                setTopScore(false);
                setRunnerUpScores(false);
            } else {
                setTopScore(scores[0]);
                scores.shift()
                setRunnerUpScores(scores)
            }
        }
        async function getUserBestScore() {
            const score = await Melodic2API.getUserSongTopScore(mp3Id, currentUser.username);

            if (score.length === 0) {
                setUserBestScore(false);
            } else {
                setUserBestScore(score);
                console.log("userBestScore", userBestScore)

            }
        }

        if (currentUser) {
            getUserBestScore();
        }
        getGeneralScores();

    }, [currentUser]);





    if (!song || !song === true || (currentUser && userBestScore === null) || runnerUpScores === null) return <LoadingSpinner />;




    return (

        <div >



            {(topScore && runnerUpScores.length > 0) ?
                (<Leaderboard topScore={topScore} runnerUpScores={runnerUpScores} navigateGame={navigateGame} navigateSongs={navigateSongs} song={song} />)
                : ""}
            {(topScore && runnerUpScores.length === 0) ?
                (<TopScoreOnly topScore={topScore} />)
                : ""}


        </div>





    )

};
export default SongDetails;


{/* 
            <h4>{song.title}, {song.dir}</h4>
            <br /> <button onClick={navigateGame}>Play!</button>
            <br /> {hasRefreshedGame ? 'Exited Game Early' : ''}
            <br />{!topScore ? "No Top Score Yet!" : `TopScore:${topScore.score}`}

 */}
