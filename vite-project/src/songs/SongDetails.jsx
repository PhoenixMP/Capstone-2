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



    useEffect(function getScoreInfo() {
        async function getGeneralScores() {
            const topScore = await Melodic2API.getSongTopScore(mp3Id);

            if (topScore.length === 0) {
                setTopScore(false);
            } else { setTopScore(topScore); }
        }

        async function getUserScores() {
            console.log('getting the user scores mf')
            const userScores = await Melodic2API.getUserSongScores(mp3Id, currentUser.username);
            console.log('userScores', userScores)
            if (userScores.length === 0) {
                setUserScores(false);
            } else {
                setUserScores(prevState => ({
                    ...prevState,
                    ['all']: userScores
                }));
            }
        }

        if (currentUser) {
            getUserScores();
        }
        getGeneralScores();

    }, [currentUser]);





    if (!song || !song === true || userScores.all === null) return <LoadingSpinner />;



    return (
        <div>
            <h4>{song.title}</h4>
            <br />{song.dir}
            <br /> <button onClick={navigateGame}>Play!</button>
            <br /> {hasRefreshedGame ? 'Exited Game Early' : ''}
            <br />{!topScore ? "No Top Score Yet!" : (<SongScoreCard score={topScore.score}
                username={topScore.username}
                scoreTimestamp={topScore.scoreTimestamp}
                isTop={true} />)}
            <div>{currentUser ?
                (< SongScoreList scores={userScores.all} />) : (<Link to={`/login`} > Login To See Your Scores</Link>)}
            </div>



        </div>
    )

};
export default SongDetails;


