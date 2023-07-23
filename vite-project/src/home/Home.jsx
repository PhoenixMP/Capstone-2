
import React, { useState, useEffect, useContext } from "react";
import HomeScoreList from "./scores/HomeScoreList";
import LoadingSpinner from "../common/LoadingSpinner";
import Melodic2API from "../api/api";
import "./Home.css"
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import UserContext from "../auth/UserContext";



/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const Home = ({ login, signup }) => {
    const { showLogin, showSignup, setShowLogin, setShowSignup, toggleSignupForm, toggleLoginForm } = useContext(UserContext);
    const [scores, setScores] = useState(null)



    useEffect(() => {
        async function getAllTopScores() {
            const topScores = await Melodic2API.getAllTopScores();
            if (topScores.length === 0) {
                setScores(false);
            } else { setScores(topScores) }
        }
        setShowLogin(false);
        setShowSignup(false);
        getAllTopScores();
    }, []);





    if (scores === null) return <LoadingSpinner />;


    return (
        <div className="Home-page">



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
            <div className="content-container">
                {!scores ? "no scores recorded" :
                    <HomeScoreList scores={scores} />
                }
                <div className="form-container">
                    {showLogin ?

                        <LoginForm login={login} toggleSignupForm={toggleSignupForm} /> : ""}
                    {showSignup ?
                        <SignupForm signup={signup} toggleLoginForm={toggleLoginForm} /> : ""}

                </div>

            </div>




            <div className='lights-container'>
                <span className='light light-1'></span>
                <span className='light light-2'></span>
                <span className='light light-3'></span>
                <span className='light light-4'></span>
                <span className='light light-5'></span>
                <span className='light light-6'></span>
                <span className='light light-7'></span>
                <span className='light light-8'></span>
                <span className='light light-9'></span>
                <span className='light light-10'></span>
                <span className='light light-11'></span>
                <span className='light light-12'></span>
                <span className='light light-13'></span>
                <span className='light light-14'></span>
                <span className='light light-15'></span>
                <span className='light light-16'></span>
                <span className='light light-17'></span>
                <span className='light light-18'></span>
                <span className='light light-19'></span>
                <span className='light light-20'></span>
                <span className='light light-21'></span>
                <span className='light light-22'></span>
                <span className='light light-23'></span>
                <span className='light light-24'></span>
                <span className='light light-25'></span>
                <span className='light light-26'></span>
                <span className='light light-27'></span>
                <span className='light light-28'></span>
                <span className='light light-29'></span>
                <span className='light light-30'></span>
                <span className='light light-31'></span>
                <span className='light light-32'></span>
                <span className='light light-33'></span>
                <span className='light light-34'></span>
                <span className='light light-35'></span>
                <span className='light light-36'></span>
                <span className='light light-37'></span>
                <span className='light light-38'></span>
                <span className='light light-39'></span>
                <span className='light light-40'></span>
                <span className='light light-41'></span>
                <span className='light light-42'></span>
                <span className='light light-43'></span>
                <span className='light light-44'></span>
                <span className='light light-45'></span>
                <span className='light light-46'></span>
                <span className='light light-47'></span>
                <span className='light light-48'></span>
                <span className='light light-49'></span>
                <span className='light light-50'></span>
                <span className='light light-51'></span>
                <span className='light light-52'></span>
                <span className='light light-53'></span>
                <span className='light light-54'></span>
                <span className='light light-55'></span>
                <span className='light light-56'></span>
                <span className='light light-57'></span>
                <span className='light light-58'></span>
                <span className='light light-59'></span>
                <span className='light light-60'></span>
            </div>

        </div>
    )

};
export default Home;


