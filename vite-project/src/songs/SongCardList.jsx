
import React from "react";
import SongCard from "./SongCard";


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const SongCardList = ({ songs }) => {



    return (
        <div>
            {songs.map(song => (
                <SongCard
                    key={song.mp3_id}
                    mp3Id={song.mp3_id}
                    title={song.title}
                    dir={song.dir} />
            ))}
        </div>
    )

};
export default SongCardList;

