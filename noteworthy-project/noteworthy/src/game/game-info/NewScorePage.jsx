import React, { useContext } from "react";

import userContext from "../../auth/UserContext";
import EndGameButtons from "./EndGameButtons";
import "./NewScorePage.css"

/**
 * Component that displays the new top score or new personal best result summary.
 *
 * @component
 * @param {boolean} isTop - Indicates whether the score is a new top score.
 * @return {JSX.Element} The new top score or new personal best result summary JSX.
 */


function NewTopScore({ isTop }) {
    const { currentUser, totalScore, userBestScore, userHasTop } = useContext(userContext);



    /**
     * Checks if the user is logged in and returns appropriate JSX.
     *
     * @return {JSX.Element|null} JSX for login prompt or null if user is logged in.
     */
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



