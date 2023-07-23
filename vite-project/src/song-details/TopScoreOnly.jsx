import React from "react";




/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function TopScoreOnly({ topScore, navigateGame }) {






    return (
        <div>
            <div class="ribbon"></div>
            <div id="buttons">

            </div>
            <table>
                <tr>
                    <td className="number">1</td>
                    <td className="name">{topScore.username}</td>
                    <td className="timestamp">{topScore.scoreTimeStamp}</td>
                    <td className="points">
                        {topScore.score} <img className="gold-medal" src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-TopScoreOnly/assets/gold-medal.png?raw=true" alt="gold medal" />
                    </td>
                </tr>

            </table>
        </div>

    );
}



export default TopScoreOnly;
