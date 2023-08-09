
import React from "react";
import SongCard from "./SongCard";
import "./SongCard.css"


/**
 * Component to display a list of song cards.
 *
 * This component receives an array of song data and renders a list of SongCard components,
 * each displaying details about a song. The song data includes attributes such as mp3Id, title,
 * directory, username of the top scorer, genre, order, and total card number.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.songs - An array of song objects containing song details.
 * @return {JSX.Element} SongCardList component
 */


const SongCardList = ({ songs }) => {
    console.log(songs)

    return (
        <div className="song-card-list">
            {songs.map((song, index) => (
                <SongCard
                    key={song.mp3_id}
                    mp3Id={song.mp3_id}
                    title={song.title}
                    dir={song.dir}
                    username={song.username}
                    genre={song.genre}
                    order={index + 1}
                    cardNumber={songs.length}


                />
            ))}
        </div>
    )

};
export default SongCardList;

