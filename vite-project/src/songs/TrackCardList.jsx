
import React from "react";
import TrackCard from "./TrackCard";


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const TrackCardList = ({ tracks, midiData, midiId }) => {





    return (
        <div>
            <div>Tracks:
                {tracks.map(track => (
                    <div key={track.id}>
                        <TrackCard
                            id={track.id}
                            trackName={track.track_name}
                            midiId={midiId}
                            midiData={midiData}
                        />

                    </div>
                ))}
            </div>
        </div>
    )

};
export default TrackCardList;



