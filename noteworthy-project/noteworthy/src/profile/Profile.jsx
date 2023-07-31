import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import FallingNotes from "../common/FallingNotes";
import userContext from "../auth/UserContext";

import ProfileScoreList from "./scores/ProfileScoreList"

import './Profile.css'



/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const Profile = () => {


    const [topScores, setTopScores] = useState(null)
    const [topScoreInfo, setTopScoreInfo] = useState(null)
    const [undefeatedScoreInfo, setUndefeatedScoreInfo] = useState(null)
    const [undefeatedScores, setUndefeatedScores] = useState(null)
    const [toggleScore, setToggleScore] = useState("top")
    const [songsReady, setSongsReady] = useState(false)

    const { setOnGamePage, currentUser, onHoldScore, addScore } = useContext(userContext);



    useEffect(function getScores() {
        setOnGamePage(false)




        async function getUserScores() {

            const top = await Melodic2API.getUserTopScores(currentUser.username);
            if (top.length === 0) {
                setTopScores(false);
            } else { setTopScores(top) }

            const undefeated = await Melodic2API.getUserUndefeatedTopScores(currentUser.username);
            if (undefeated.length === 0) {
                setUndefeatedScores(false);
            } else { setUndefeatedScores(undefeated) }

        }
        getUserScores();
        setSongsReady(true)


    }, [currentUser]);

    useEffect(() => {

        function compareArrays(scores, songs) {
            const scoreDetails = scores.map((score) => {
                const mp3Id = score.mp3Id;
                const matchingSong = songs.find((song) => song.mp3_id === mp3Id);
                if (matchingSong) {
                    score.songTitle = matchingSong.title;
                    score.songDir = matchingSong.dir
                }
                return score;
            })

            return scoreDetails;
        }


        async function getAllSongs() {
            const songs = await Melodic2API.getAllSongs();
            const topScoreDetails = compareArrays(topScores, songs)
            const undefeatedScoreDetails = compareArrays(undefeatedScores, songs)
            setTopScoreInfo(topScoreDetails)
            setUndefeatedScoreInfo(undefeatedScoreDetails)
        }

        if (songsReady) getAllSongs();


    }, [topScores, undefeatedScores]);





    function viewTopScores() {
        return (
            <div className="profile-scores">
                {topScores === false ? <div className="no-scores"> You have no scores yet </div> :
                    (<ProfileScoreList scores={topScoreInfo} undefeated={false} />)}
            </div>
        )
    }

    function viewUndefeatedScores() {
        return (
            <div className="profile-scores">
                {undefeatedScores === false ? <div className="no-scores"> You have no undefeated scores yet </div> :
                    (<ProfileScoreList scores={undefeatedScoreInfo} undefeated={true} />)}
            </div>
        )
    }

    function toggleView() {
        if (toggleScore === "top") {
            return viewTopScores();
        } else if (toggleScore === "undefeated") {
            return viewUndefeatedScores();
        }
    };

    function toggleToTop() {
        setToggleScore("top");
    };

    function toggleToUndefeated() {
        setToggleScore("undefeated");
    };



    if (topScores === null || undefeatedScores === null) return <LoadingSpinner />;



    return (
        <div className="profile-page common-background">
            <FallingNotes />
            <h3 className="profile-heading">Your Scores</h3>
            <div className="profile-buttons">
                <button className={`profile-button ${(toggleScore === "top") ? "active" : ""}`} onClick={() => toggleToTop()}>Personal Best</button>
                <button className={`profile-button ${(toggleScore === "undefeated") ? "active" : ""}`} onClick={() => toggleToUndefeated()}>Undefeated</button>
            </div>


            {toggleView()}

        </div>
    )

};


export default Profile;