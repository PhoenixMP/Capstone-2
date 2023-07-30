
import React, { useState, useEffect, useContext } from "react";
import Melodic2API from "../api/api";
import homeVideo from "./underwater.mp4"
import "./Home.css"
import "./heading.css"
import search from "../images/icons/search.png"

import UserContext from "../auth/UserContext";



/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const Home = () => {
    const { isAnimated, handleHeadingHover, setOnGamePage, getFormJSX, setShowLogin, setShowSignup } = useContext(UserContext);
    const [showAbout, setShowAbout] = useState(false)



    useEffect(() => {

        setOnGamePage(false)
        setShowLogin(false);
        setShowSignup(false);

    }, []);


    const handleSearchHover = () => {
        setShowAbout(prev => !prev)
    }




    return (
        <div className="Home-page" >
            <video autoPlay muted loop id="home-video">
                <source src={homeVideo} type="video/mp4" />
            </video>

            <div className="home-form-container">
                {getFormJSX()}
            </div>

            <div className="home-content-container">
                <div className="home-text">
                    <div className={`first-container ${isAnimated} share`}>
                        <h1 className="home-heading" onMouseEnter={handleHeadingHover}>    <span className="home-span" id="one">N</span><span className="home-span">o</span><span className="home-span">t</span><span className="home-span">e</span><span className="home-span">W</span><span className="home-span">o</span><span className="home-span">r</span><span className="home-span">t</span><span className="home-span">h</span><span className="home-span">y</span></h1>
                    </div>
                    <p className="home-tag">Explore A Sea Of Melodies ~  Will You Sink or Swim?</p>
                    {showAbout ? <p className="home-about">(This game is basically "GuitarHero" but for piano)</p> : ""}
                </div>
                <div className="home-search" onClick={handleSearchHover}> <img className="home-search-image" src={search} /> </div>

            </div>

        </div>
    )

};
export default Home;


