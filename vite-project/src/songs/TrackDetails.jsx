import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Melodic2API from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";




/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const TrackDetails = () => {

    const { id } = useParams();
    console.debug("track", "id=", id);

    const [track, setTrack] = useState(null);

    useEffect(function getTrackInfo() {
        async function getTrack() {
            setTrack(await Melodic2API.getTrack(id, { type: "non_drum_tracks" }));
        }
        getTrack();
    }, [id]);

    useEffect(function checkNotes() {
        if (track) console.log(track.notes)
    }), [track]


    if (!track) return <LoadingSpinner />;


    return (
        <div>
            track deets

        </div>
    )

};
export default TrackDetails;