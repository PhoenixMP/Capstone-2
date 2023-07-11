
import React, { useState, useEffect } from "react";
import DetailedScoreList from "../scores/DetailedScoreList";
import LoadingSpinner from "../common/LoadingSpinner";
import Melodic2API from "../api/api";


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const Home = () => {
    const [scores, setScores] = useState(null)


    useEffect(() => {
        async function getAllTopScores() {
            const topScores = await Melodic2API.getAllTopScores();
            if (topScores.length === 0) {
                setScores(false);
            } else { setScores(topScores) }
        }

        getAllTopScores();
    }, []);

    if (scores === null) return <LoadingSpinner />;


    return (
        <div>
            Home
            <br />{!scores ? "no scores recorded" :

                <DetailedScoreList scores={scores} isUsre={false} />
            }

        </div>
    )

};
export default Home;