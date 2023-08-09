import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import NoteworthyAPI from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import FallingNotes from "../common/FallingNotes";
import userContext from "../auth/UserContext";

import ProfileScoreList from "./scores/ProfileScoreList"

import './Profile.css'



/** Routed at /profile
 *
 * Component representing the user's profile page.
 *
 * This component serves as the user's profile page, displaying various score-related
 * information and allowing users to toggle between their personal best and undefeated scores.
 * It retrieves the user's personal best and undefeated scores from the API and populates the information
 * with details about the songs.
 *
 * @component
 * @return {JSX.Element} Profile component
 *
 * @memberof MyRoutes
 * @see {@link MyRoutes}
 */

const Profile = () => {


    const [topScores, setTopScores] = useState(null)
    const [topScoreInfo, setTopScoreInfo] = useState(null)
    const [undefeatedScoreInfo, setUndefeatedScoreInfo] = useState(null)
    const [undefeatedScores, setUndefeatedScores] = useState(null)
    const [toggleScore, setToggleScore] = useState("top")
    const [songsReady, setSongsReady] = useState(false)     // Flag to indicate if songs data is ready for processing

    const { setOnGamePage, currentUser } = useContext(userContext);


    /**
      * Fetches the user's scores from the API and sets up songs for display.
      */
    useEffect(function getScores() {
        setOnGamePage(false)

        async function getUserScores() {

            const top = await NoteworthyAPI.getUserTopScores(currentUser.username);
            if (top.length === 0) {
                setTopScores(false);
            } else { setTopScores(top) }

            const undefeated = await NoteworthyAPI.getUserUndefeatedTopScores(currentUser.username);
            if (undefeated.length === 0) {
                setUndefeatedScores(false);
            } else { setUndefeatedScores(undefeated) }

        }
        getUserScores();
        setSongsReady(true)


    }, [currentUser]);



    /**
  * Compares user's scores with available songs and sets up score details for display.
  */
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
            const songs = await NoteworthyAPI.getAllSongs();
            const topScoreDetails = compareArrays(topScores, songs)
            const undefeatedScoreDetails = compareArrays(undefeatedScores, songs)
            setTopScoreInfo(topScoreDetails)
            setUndefeatedScoreInfo(undefeatedScoreDetails)
        }

        if (songsReady) getAllSongs();


    }, [topScores, undefeatedScores]);




    /**
     * Render the top scores view.
     *
     * @returns {JSX.Element} Rendered top scores view
     */
    function viewTopScores() {
        return (
            <div className="profile-scores">
                {topScores === false ? <div className="no-scores"> You have no scores yet </div> :
                    (<ProfileScoreList scores={topScoreInfo} undefeated={false} />)}
            </div>
        )
    }



    /**
   * Render the undefeated scores view.
   *
   * @returns {JSX.Element} Rendered undefeated scores view
   */
    function viewUndefeatedScores() {
        return (
            <div className="profile-scores">
                {undefeatedScores === false ? <div className="no-scores"> You have no undefeated scores yet </div> :
                    (<ProfileScoreList scores={undefeatedScoreInfo} undefeated={true} />)}
            </div>
        )
    }


    /**
 * Toggle the view between personal best and undefeated scores.
 *
 * @returns {JSX.Element} Rendered scores view based on toggle state
 */
    function toggleView() {
        if (toggleScore === "top") {
            return viewTopScores();
        } else if (toggleScore === "undefeated") {
            return viewUndefeatedScores();
        }
    };


    //Set the view to display personal best scores.
    function toggleToTop() {
        setToggleScore("top");
    };


    //Set the view to display undefeated scores.
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