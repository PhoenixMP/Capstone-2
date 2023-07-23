import React from "react";
import "./Leaderboard.css"



/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function Leaderboard({ topScore, runnerUpScores, navigateGame, navigateSongs, song }) {
    console.log(runnerUpScores)






    return (
        <div className="leaderboard">
            <div id="header">
                <h1>{song.title}, {song.dir}</h1>

            </div>
            <div id="leaderboard">
                <div className="ribbon"></div>
                <table>
                    <tbody>
                        <tr>
                            <td className="number">1</td>
                            <td className="name">{topScore.username}</td>
                            <td className="timestamp">{topScore.scoreTimestamp}</td>
                            <td className="points">
                                {topScore.score} <img className="gold-medal" src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true" alt="gold medal" />
                            </td>
                        </tr>
                        {runnerUpScores.map((score, idx) => {
                            return (
                                <tr>
                                    <td className="number">{idx + 2}</td>
                                    <td className="name">{topScore.username}</td>
                                    <td className="timestamp">{topScore.scoreTimestamp}</td>
                                    <td className="points"> {topScore.score}</td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>

                </table>

            </div>
        </div>
    );
}



export default Leaderboard;

