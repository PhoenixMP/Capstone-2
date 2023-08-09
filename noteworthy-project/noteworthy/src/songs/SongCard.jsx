import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SongCard.css"

/**
 * Component to display a song card with details and visual effects.
 *
 * This component renders a song card containing information like title, dir,
 * username of top scorer, and genre. It also applies dynamic background and text colors
 * based on the order and card number. The genre is used to apply a specific class for styling.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.mp3Id - The unique ID of the song.
 * @param {string} props.title - The title of the song.
 * @param {string} props.dir - The directory of the song.
 * @param {string} props.username - The username of the top scorer.
 * @param {string} props.genre - The genre of the song.
 * @param {number} props.cardNumber - The total number of cards.
 * @param {number} props.order - The order of the card.
 * @return {JSX.Element} SongCard component
 */

function SongCard({ mp3Id, title, dir, username, genre, cardNumber, order }) {

    const [backgroundColor, setBackgroundColor] = useState(null)
    const [textColor, setTextColor] = useState(null)


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


        <div className="vinyl-jacket" style={{ backgroundColor: backgroundColor, color: textColor }}>
            <div className="card-header">
                <div className="card-title">
                    {title}
                    <p> {dir} </p>
                </div>
            </div>
            <div >
                {(username) ?
                    (<p className="card-score">🏆 Top Scorer: {username}</p>) :
                    (<p className="card-no-score">No Top Score Yet </p>)
                }
            </div>
            <div className="vinyl-wrapper">
                <Link to={`/song/${mp3Id}`} style={{ textDecoration: 'none', color: "white" }} key={mp3Id}>
                    <div className={`vinyl ${getGenreClass()}`}></div>
                </Link >
            </div>
        </div>


    );
}



export default SongCard;


