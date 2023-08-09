import React from "react";
import "./FallingNotes.css"

/**
 * Component displaying falling musical notes.
 *
 * This decorative component renders a visual representation of falling musical notes
 *
 * @component
 * @return {JSX.Element} FallingNotes component
 */

function FallingNotes() {
    return (
        <div className="falling-notes">
            <span>♩</span>
            <span>♪</span>
            <span>♭</span>
            <span>♫</span>
            <span>♩</span>
            <span>♬</span>
            <span>♪</span>
            <span>♯</span>
            <span>♩</span>
            <span>♬</span>
        </div>

    );
}

export default FallingNotes;