import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import MidiPlayerComponent from "./midi/MidiPlayer"




/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function TrackCard({ id, trackName }) {
    const { midiId } = useParams();


    const navigate = useNavigate();

    const navigateGame = () => {
        // navigate to /
        navigate(`/game/${midiId}/${id}`);
    };



    return (
        <div className="TrackCard card" key={id}>
            <div className="card-body">
                <h2 className="card-title">{trackName}</h2>
                <button onClick={navigateGame}>I Pick This One!</button>

                <MidiPlayerComponent trackName={trackName} />

            </div>
        </div>
    );
}



export default TrackCard;
