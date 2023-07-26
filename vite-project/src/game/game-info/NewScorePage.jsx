import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import userContext from "../../auth/UserContext";
import GameContext from "../GameContext";
import GameButtons from "./GameButtons";
import "./NewScorePage.css"



function NewTopScore({ isTop }) {
    const { currentUser } = useContext(userContext);
    const { totalScore, userBestScore, userHasTop } = useContext(GameContext)



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

                <GameButtons isGameOverButton={true} saving={true} />
            </div>
        </div>


    );


}

export default NewTopScore;



