import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import userContext from "../auth/UserContext";
import UpdateUserForm from "./UpdateUserForm";
import TopScoreList from "./scores/TopScoreList";
import UserScoreList from "./scores/UserScoreList"
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


    const navigate = useNavigate();
    const [userScores, setUserScores] = useState({ top: null, all: null })
    const [topScores, setTopScores] = useState(null)
    const [undefeatedScores, setUndefeatedScores] = useState(null)
    const [toggleScore, setToggleScore] = useState("top")
    const [editProfile, setEditProfile] = useState(false)

    const { currentUser, onHoldScore, addScore } = useContext(userContext);



    useEffect(function getScores() {
        async function getUserScores() {
            const allScores = await Melodic2API.getUserAllScores(currentUser.username);
            if (allScores.length === 0) {
                setUserScores(false);
            } else { setUserScores(allScores); }

            const top = await Melodic2API.getUserTopScores(currentUser.username);
            if (top.length === 0) {
                setTopScores(false);
            } else { setTopScores(top) }

            const undefeated = await Melodic2API.getUserTopScores(currentUser.username);
            if (undefeated.length === 0) {
                setUndefeatedScores(false);
            } else { setUndefeatedScores(undefeated) }

        }
        getUserScores();


    }, [currentUser]);

    function viewTopScores() {
        return (
            <div> Top Scores:
                <br />{topScores === false ? "You have no scores yet" :
                    (< TopScoreList scores={topScores} />)}
            </div>
        )
    }
    function viewAllScores() {
        return (
            <div> All Scores:
                <br />
                {userScores === false ? "You have no scores yet" :
                    (< UserScoreList scores={userScores} />)}
            </div>
        )

    }
    function viewUndefeatedScores() {
        return (
            <div> Undefeated Scores:
                <br />{undefeatedScores === false ? "You have no undefeated scores yet" :
                    (< TopScoreList scores={undefeatedScores} />)}
            </div>
        )
    }

    function toggleView() {
        if (toggleScore === "top") {
            return viewTopScores();
        } else if (toggleScore === "all") {
            return viewAllScores();
        } else if (toggleScore === "undefeated") {
            return viewUndefeatedScores();
        }
    };

    function toggleToTop() {
        setToggleScore("top");
    };
    function toggleToAll() {
        setToggleScore("all");
    };
    function toggleToUndefeated() {
        setToggleScore("undefeated");
    };

    function toggleEditProfile() {
        setEditProfile(prevState => !prevState);
    }

    if (userScores === null || topScores === null || undefeatedScores === null) return <LoadingSpinner />;



    return (
        <div className="profile-page">
            <div className="edit-profile">
                <button onClick={() => toggleEditProfile()}>Update Profile</button>
                {editProfile ? (<div> <UpdateUserForm /></div>) : ""}
            </div>

            <div className="profile-scores">
                <h3>Your Scores</h3>
                <button onClick={() => toggleToAll()}>All Scores</button>
                <button onClick={() => toggleToTop()}>Top Scores</button>
                <button onClick={() => toggleToUndefeated()}>Undefeated Scores</button>
                {toggleView()}
            </div>



        </div>
    )

};


export default Profile;