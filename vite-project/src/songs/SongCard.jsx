import React from "react";
import { Link } from "react-router-dom";
import "./SongCard.css"
import "./images/icons/breakdance"
import "./images/icons/disco-ball.png"
import "./images/icons/games.png"
import "./images/icons/hand.png"
import "./images/icons/headphone-symbol.png"
import "./images/icons/"
import "./images/icons/"
import "./images/icons/"
import "./images/icons/"




/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function SongCard({ mp3Id, title, dir, topScore, genre }) {
    console.log(genre)
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

            return (
                <Link to={`/song/${mp3Id}`} style={{ textDecoration: 'none', color: "white" }} key={mp3Id}>
                    <div class="vinyl-jacket">
                        <p className="card-title">{title} </p>
                        <p className="card-title"> {dir} </p>
                        <p className="card-score">No topScore Yet </p>
                        <p className="card-score">{genre} </p>

                        <div class="vinyl-wrapper">
                            <div class="vinyl" style={{ backgroundImage: 'url(require("images/icons/breakdance.png")' }}></div>
                        </div>
                    </div>

                </Link >
            )
        }
    }

    return (
        <div>{checkIfTopScore()}</div>
    );
}



export default SongCard;



