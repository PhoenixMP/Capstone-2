import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "./MusicContext";
import userContext from "../auth/UserContext";
import SongScoreList from "../scores/SongScoreList"
import SongScoreCard from "../scores/SongScoreCard";
import { Link } from "react-router-dom";



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
    const [userScores, setUserScores] = useState(null)





    const { song, setSong, setNotes, setEncodedData, setHasRefreshedGame, hasRefreshedGame } = useContext(musicContext);
    const { currentUser, userBestScore, setUserBestScore, topScore, setTopScore } = useContext(userContext);
    const [userHasTop, setUserHasTop] = useState(false);


    console.log('currentUser', currentUser)

    const navigateGame = () => {
        // navigate to /
        if (hasRefreshedGame) setHasRefreshedGame(false);
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



    useEffect(function getScoreInfo() {
        async function getGeneralScores() {
            const topScore = await Melodic2API.getSongTopScore(mp3Id);

            if (topScore.length === 0) {
                setTopScore(false);
            } else {
                setTopScore(topScore);

            }
        }

        async function getUserScores() {

            const userScores = await Melodic2API.getUserSongScores(mp3Id, currentUser.username);

            if (userScores.length === 0) {
                setUserScores(false);
            } else {
                const userTopScore = userScores.shift()
                setUserScores(userScores);
                setUserBestScore(userTopScore)
                if (topScore.username === currentUser.username) setUserHasTop(true);
            }
        }

        if (currentUser) {
            getUserScores();
        }
        getGeneralScores();

    }, [currentUser]);





    if (!song || !song === true || (currentUser && userScores === null)) return <LoadingSpinner />;




    return (
        <div>
            <h4>{song.title}, {song.dir}</h4>
            <br /> <button onClick={navigateGame}>Play!</button>
            <br /> {hasRefreshedGame ? 'Exited Game Early' : ''}
            <br />{!topScore ? "No Top Score Yet!" : (<SongScoreCard score={topScore.score}
                username={topScore.username}
                scoreTimestamp={topScore.scoreTimestamp}
                isTop={true}
                userHasTop={userHasTop} />)}
            <div> {(currentUser && userScores !== false) ?
                (< SongScoreList userHasTop={userHasTop} allScores={userScores} userTopScore={userBestScore} />) : ""}
                {(currentUser && topScore && userScores === false) ? "You don't have any scores yet" : ""}
                {!currentUser ? (<Link to={`/login`} > Login To See Your Scores</Link>) : ""}
            </div>



        </div>
    )

};
export default SongDetails;


