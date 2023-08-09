import React, { useContext } from "react";
import userContext from "../auth/UserContext";
import "./Leaderboard.css"
import "./recordPlayer.css"


/**
 * Component for displaying a leaderboard when no scores are recorded for a song.
 *
 * Displays a message encouraging the user to set a score for the song, along with a
 * button to log in if the user is not logged in.
 *
 * @component
 * @param {function} navigateGame - Function to navigate to the game page
 * @param {object} song - Information about the song for which the leaderboard is displayed
 * @return {JSX.Element} ScorelessLeaderboard component
 */


function ScorelessLeaderboard({ navigateGame, song, }) {

    const { currentUser, toggleLoginForm } = useContext(userContext);


    /**
 * Get JSX for the appropriate message based on the user's authentication status.
 *
 * @return {JSX.Element} JSX for the message encouraging the user to set a score
 */
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

