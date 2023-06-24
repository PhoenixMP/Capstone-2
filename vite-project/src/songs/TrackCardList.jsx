
import React, { useContext } from "react";

import TrackCard from "./TrackCard";
import musicContext from "./musicContext";


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const TrackCardList = () => {

    const { song } = useContext(musicContext);


    const tracks = song.song.nonDrumTrack

    return (
        <div>
            <div>Tracks:
                {tracks.map(track => (
                    <div key={track.id}>
                        <TrackCard
                            id={track.id}
                            trackName={track.track_name}
                        />

                    </div>
                ))}
            </div>
        </div>
    )

};
export default TrackCardList;



