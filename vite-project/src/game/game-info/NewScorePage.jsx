import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import userContext from "../../auth/UserContext";
import GameContext from "../GameContext";
import EndGameButtons from "./EndGameButtons";
import "./NewScorePage.css"



function NewTopScore({ isTop }) {
    const { currentUser, totalScore, userBestScore, userHasTop } = useContext(userContext);




    const checkLogin = () => {
        if (!currentUser) {
            return (
                <div className="result-text-box">
                    <p className="paragraph">
                        Login to save your score!
                    </p>
                </div>
            )
        }
    }



    return (
        <div className="results-summary-container">
            <div className="confetti">
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
                <div className="confetti-piece"></div>
            </div>
            <div className="results-summary-container__result">
                <div className="heading-tertiary">{isTop ? "New Top Score!" : "New Personal Best!"}</div>
                <div className="result-box">
                    <div className="heading-primary">{totalScore}</div>
                </div>
                {checkLogin()}

                <EndGameButtons />
            </div>
        </div>


    );


}

export default NewTopScore;



