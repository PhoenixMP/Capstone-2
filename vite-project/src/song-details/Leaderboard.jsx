import React, { useContext } from "react";
import { Link } from "react-router-dom";
import userContext from "../auth/UserContext";

import medalImage from '../images/icons/medal.png'
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

function Leaderboard({ topScore, runnerUpScores, navigateGame, song }) {

    const { userHasTop, userBestScore, currentUser, toggleLoginForm } = useContext(userContext);

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
                            {userHasTop ? (<td className="td name">  <Link style={{ textDecoration: 'none', color: 'white' }} to="/profile"> {topScore.username} (You)</Link></td>) : (<td className="td name">{topScore.username}</td>)}
                            <td className="td timestamp">{topScore.scoreTimestamp}</td>
                            <td className="td points">
                                {topScore.score} <img className="gold-medal" src={medalImage} /></td>
                        </tr>
                        {runnerUpScores.map((score, idx) => {
                            return (
                                <tr className="tr runner-ups">
                                    <td className="td number">{idx + 2}</td>
                                    {(userBestScore && (userBestScore.id === score.id)) ?
                                        (<td className="td name"> {score.username} (You)</td>) :
                                        (<td className="td name"> {score.username} </td>)}
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

