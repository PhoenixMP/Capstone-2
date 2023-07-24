import React, { useContext } from "react";
import userContext from "../auth/UserContext";
import "./Leaderboard.css"
import "./recordPlayer.css"



/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function ScorelessLeaderboard({ navigateGame, song, }) {


    const { currentUser, toggleLoginForm } = useContext(userContext);

    const getMsgJSX = () => {
        if (currentUser) {
            return (<div className="no-scores-div">Be the first to set a score for this song! </div>)
        } else {
            return (<div className="no-scores-div"><button className="song-details-login-button" onClick={toggleLoginForm}>Login</button> to set the first score for this song!</div>
            )
        }
    }


    return (
        <div className="leaderboard-container">
            <div className="header-container">
                <div className="leaderboard-header">
                    <h1>{song.title},</h1>
                    <h1 >{song.dir}</h1>
                </div>

                <button className="play-button" onClick={navigateGame} >
                    <div className="record">
                        <div className="inner"></div>
                    </div>
                </button>
            </div>

            <div className="leaderboard">
                <div className="ribbon">
                    {getMsgJSX()}
                </div>
            </div>
        </div>
    );
}



export default ScorelessLeaderboard;

