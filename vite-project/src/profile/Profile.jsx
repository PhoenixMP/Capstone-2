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
    const [undefeatedScores, setUndefeatedScores] = useState(null)
    const [toggleScore, setToggleScore] = useState("top")

    const { currentUser, onHoldScore, addScore } = useContext(userContext);



    useEffect(function getScores() {
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


    }, [currentUser]);



    function viewTopScores() {
        return (
            <div className="profile-scores">
                {topScores === false ? <div className="no-scores"> You have no scores yet </div> :
                    (<ProfileScoreList scores={topScores} undefeated={false} toggleScore={toggleScore} />)}
            </div>
        )
    }

    function viewUndefeatedScores() {
        return (
            <div className="profile-scores">
                {undefeatedScores === false ? <div className="no-scores"> You have no undefeated scores yet </div> :
                    (<ProfileScoreList scores={undefeatedScores} undefeated={true} toggleScore={toggleScore} />)}
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
        <div className="profile-page">
            <FallingNotes />
            <h3 className="profile-heading">View Your Scores</h3>
            <div className="profile-buttons">
                <button className={`profile-button ${(toggleScore === "top") ? "active" : ""}`} onClick={() => toggleToTop()}>Personal Best</button>
                <button className={`profile-button ${(toggleScore === "undefeated") ? "active" : ""}`} onClick={() => toggleToUndefeated()}>Undefeated</button>
            </div>


            {toggleView()}

        </div>
    )

};


export default Profile;