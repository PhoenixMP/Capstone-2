
import React from "react";
import SongCard from "./SongCard";
import "./SongCard.css"
import { ScrollRestoration } from "react-router-dom";


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const SongCardList = ({ songs }) => {

    console.log(songs)
    return (
        <div className="song-card-list">
            {songs.map(song => (
                <SongCard
                    key={song.mp3_id}
                    mp3Id={song.mp3_id}
                    title={song.title}
                    dir={song.dir}
                    topScore={song.topScore}
                    genre={song.genre}

                />
            ))}
        </div>
    )

};
export default SongCardList;

