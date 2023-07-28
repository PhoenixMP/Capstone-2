import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Melodic2API from "../../api/api";
import userContext from "../../auth/UserContext";
import GameContext from "../GameContext";
import EndGameButtons from "./EndGameButtons";
import LoadingSpinner from "../../common/LoadingSpinner";
import "./NewScorePage.css"



function NoScorePage() {
    const { userBestScore, currentUser, totalScore } = useContext(userContext);



    if (currentUser && userBestScore === null) return (<LoadingSpinner />)
    return (
        <div className="results-summary-container no-score">
            <div className="results-summary-container__result">
                <div className="heading-tertiary">Your Score:</div>
                <div className="result-box">
                    <div className="heading-primary">{totalScore}</div>
                </div>
                <div className="result-text-box">
                    <p className="paragraph">
                        {currentUser ? `Your Best Score for this song is: ${userBestScore.score}` : 'Login/Signup to save score'}
                    </p>

                </div>
                <EndGameButtons />
            </div>
        </div>


    );


}

export default NoScorePage;



