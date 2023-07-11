import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import musicContext from "./MusicContext";
import userContext from "../auth/UserContext";
import ScoreList from "../common/ScoreList"
import ScoreCard from "../common/ScoreCard";



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
    const [userScores, setUserScores] = useState({ top: null, all: null })
    const [topScore, setTopScore] = useState(null)




    const { song, setSong, setNotes, setEncodedData, setHasRefreshedGame, hasRefreshedGame } = useContext(musicContext);
    const { currentUser } = useContext(userContext);


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



    useEffect(function getSoreInfo() {
        async function getGeneralScores() {
            const topScore = await Melodic2API.getSongTopScore(mp3Id);

            if (topScore.length === 0) {
                setTopScore(false);
            } else { setTopScore(topScore); }
        }
        async function getUserScores() {
            const topScores = await Melodic2API.getAllTopScores();
            console.log('topScores', topScores)
            setScores(topScores);
            if (topScores.length === 0) setNoTopScoreAlert(true)
        }
        getGeneralScores();
    }, []);





    if (!song || !song === true) return <LoadingSpinner />;
    // if (!scores || !scores === true) return <LoadingSpinner />;


    return (
        <div>
            <h4>{song.title}</h4>
            <br />{song.dir}
            <br /> <button onClick={navigateGame}>Play!</button>
            <br /> {hasRefreshedGame ? 'Exited Game Early' : ''}
            <br />{!topScore ? "No Top Score Yet!" : "Top Score:"



            }
            {/* <ScoreList scores={scores} /> */}


        </div>
    )

};
export default SongDetails;


