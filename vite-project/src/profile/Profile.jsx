import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import userContext from "../auth/UserContext";
import UpdateUserForm from "./UpdateUserForm";
import DetailedScoreList from "../scores/DetailedScoreList";
import UserScoreList from "../scores/UserScoreList"
import { Link } from "react-router-dom";


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
                    (< DetailedScoreList scores={topScores} isUser={true} />)}
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
                    (< DetailedScoreList scores={undefeatedScores} isUser={true} />)}
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



    if (userScores === null || topScores === null || undefeatedScores === null) return <LoadingSpinner />;



    return (
        <div>
            <div> <UpdateUserForm /></div>
            <div>
                <h3>Your Scores</h3>
                <button onClick={() => toggleToTop()}>Your Top Scores</button>
                <button onClick={() => toggleToAll()}>All Scores</button>
                <button onClick={() => toggleToUndefeated()}>Undefeated Scores</button>
                {toggleView()}
            </div>



        </div>
    )

};


export default Profile;