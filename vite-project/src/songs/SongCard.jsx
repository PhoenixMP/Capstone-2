import React from "react";
import { Link } from "react-router-dom";
import "./SongCard.css"



/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function SongCard({ mp3Id, title, dir, topScore }) {

    const checkIfTopScore = () => {
        if (topScore.length > 0) {

            return (
                <Link to={`/song/${mp3Id}`} key={mp3Id}>
                    <div className="card red">
                        <p className="card-title">{title} </p>
                        <p className="card-title"> {dir} </p>
                        <p className="card-score">TopScore:{topScore.score} </p>
                        <p className="card-score">by {topScore.username} at {topScore.scoreTimestamp} </p>

                    </div>
                </Link>
            )

        } else {

            return (<Link to={`/song/${mp3Id}`} key={mp3Id}>
                <div className="card red">
                    <p className="card-title">{title} </p>
                    <p className="card-title"> {dir} </p>
                    <p className="card-score">No TopScore Recorded Yet </p>
                </div>
            </Link>
            )
        }
    }

    return (
        <div>{checkIfTopScore()}</div>
    );
}



export default SongCard;
