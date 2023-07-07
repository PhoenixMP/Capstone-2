import React from "react";
import { Link } from "react-router-dom";



/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function SongCard({ mp3Id, title, dir }) {


    return (
        <div className="SongCard card">
            <div className="card-body">
                <Link to={`/song/${mp3Id}`} key={mp3Id}>
                    <h6 className="card-title">{title}</h6>
                    <p>{dir}</p>
                    <p>{mp3Id}</p>
                </Link>
            </div>
        </div>
    );
}



export default SongCard;
