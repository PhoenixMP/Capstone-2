import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SongCard.css"
import hipHopIcon from "../images/icons/breakdance.png"
// import "./images/icons/disco-ball.png"
// import "./images/icons/games.png"
// import "./images/icons/hand.png"
// import "./images/icons/headphone-symbol.png"





/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function SongCard({ mp3Id, title, dir, topScore, genre, cardNumber, order }) {

    const [backgroundColor, setBackgroundColor] = useState(null)
    const [textColor, setTextColor] = useState(null)

    console.log(topScore)

    useEffect(() => {

        const startingHue = 80;
        const bkgSaturation = '60%'; // You can adjust this value to control the saturation
        const bkgLightness = '60%';

        const textSaturation = '70%'; // You can adjust this value to control the saturation
        const textLightness = '60%';

        const hue = (order * (360 / cardNumber) + startingHue) % 360;
        setBackgroundColor(`hsl(${hue}, ${bkgSaturation}, ${bkgLightness})`)
        const oppositeHue = (hue + 180) % 360;
        setTextColor(`hsl(${oppositeHue}, ${textSaturation}, ${textLightness})`)


    }, [])


    const getGenreClass = () => {
        switch (genre) {

            case "pop":
                return "pop"

            case "disco":
                return "disco"

            case "rock":
                return "rock"

            case "alt rock":
                return "alt-rock"

            case "hip hop":
                return "hip-hop"

            case "movie":
                return "movie"

            case "tv":
                return "tv"

            case "video game":
                return "video-game"

        }
    }





    return (
        <Link to={`/song/${mp3Id}`} style={{ textDecoration: 'none', color: "white" }} key={mp3Id}>
            <div className="vinyl-jacket" style={{ backgroundColor: backgroundColor, color: textColor }}>
                <div className="card-header">
                    <div className="card-title">
                        {title}
                        <p> {dir} </p>
                    </div>
                </div>
                <div >
                    {(topScore !== null) ?
                        (<p className="card-score">🏆 Top Scorer: {topScore.username}</p>) :
                        (<p className="card-no-score">No Top Score Yet </p>)
                    }
                </div>
                <div className="vinyl-wrapper">
                    <div className={`vinyl ${getGenreClass()}`}></div>
                </div>
            </div>

        </Link >
    );
}



export default SongCard;


