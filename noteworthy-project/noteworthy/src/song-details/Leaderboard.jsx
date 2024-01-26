import React, { useContext } from "react";
import { Link } from "react-router-dom";
import userContext from "../auth/UserContext";

import medalImage from '../images/icons/medal.png'
import "./Leaderboard.css"
import "./recordPlayer.css"

/**
 * Component displaying the leaderboard for a specific song.
 *
 * Renders the leaderboard table showing top scores and runner-up scores for a given song.
 * Provides information about the user's standing in the leaderboard, as well as login prompts
 * for setting a new top score or logging in to access the full functionality.
 *
 * @component
 * @param {object} topScore - The top score object for the song
 * @param {array} runnerUpScores - Array of runner-up score objects for the song
 * @param {function} navigateGame - Function to navigate to the game page
 * @param {object} song - The song object for which the leaderboard is displayed
 * @return {JSX.Element} Leaderboard component
 */

function Leaderboard({ topScore, runnerUpScores, navigateGame, song }) {

    const { userHasTop, userBestScore, currentUser, toggleLoginForm } = useContext(userContext);



    /* Get JSX for the top user's status message.
    *
    *
    * @return {JSX.Element} JSX for the user's status message
    */
    const getTopUserJSX = () => {
        if (!currentUser) {
            return (<div className="leaderboard-message"><button className="song-details-login-button" onClick={toggleLoginForm}>Login</button> to set a new top score!  </div>)
        } else if (currentUser && !userHasTop && !userBestScore) {
            return (<div className="leaderboard-message"> You haven't recorded a best score for this song yet  </div>)
        } else if (userHasTop) {
            return (<div className="leaderboard-message"> Your top score is undefeated! </div>)
        } else if (!userHasTop && userBestScore) {
            return (<div className="leaderboard-message"> You're on the board! </div>)
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
            {getTopUserJSX()}
            <div className="leaderboard">
                <div className="ribbon"></div>
                <table className="leaderboard-table">
                    <tbody>
                        <tr className="tr first-place">
                            <td className="td number">1</td>
                            {userHasTop ? (<td className="td name"> <span>  <Link style={{ textDecoration: 'none', color: 'white' }} to="/profile"> {topScore.username} (You)</Link></span></td>) : (<td className="td name"><span>{topScore.username}</span></td>)}
                            <td className="td timestamp">{topScore.scoreTimestamp}</td>
                            <td className="td points">
                                {topScore.score} <img className="gold-medal" src={medalImage} /></td>
                        </tr>
                        {runnerUpScores.map((score, idx) => {
                            return (
                                <tr className="tr runner-ups" key={idx}>
                                    <td className="td number">{idx + 2}</td>
                                    {(userBestScore && (userBestScore.id === score.id)) ?
                                        (<td className="td name"> <span>{score.username}</span> (You)</td>) :
                                        (<td className="td name"> <span>{score.username}</span>  </td>)}
                                    <td className="td timestamp">{score.scoreTimestamp}</td>
                                    <td className="td points"> {score.score}</td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>

                </table>

            </div>
        </div >
    );
}



export default Leaderboard;

