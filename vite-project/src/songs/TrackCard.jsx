import React, { useContext, useState } from "react";

import { Link } from "react-router-dom";
import MidiPlayerComponent from "./midi/MidiPlayer"



/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function TrackCard({ id, trackName, midiData }) {




    return (
        <div className="TrackCard card">
            <div className="card-body">
                <Link to={`/track/${id}`} key={id}>
                    <h2 className="card-title">{trackName}</h2>

                </Link>
                <MidiPlayerComponent trackName={trackName} EncodedMidiData={midiData} />
            </div>
        </div>
    );
}



export default TrackCard;
