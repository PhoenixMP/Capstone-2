
import React, { useState, useEffect, useContext } from "react";

import homeVideo from "./underwater.mp4"
import info from "../images/icons/info.png"
import UserContext from "../auth/UserContext";

import "./Home.css"
import "./heading.css"



/**
 * Routed at /
 *
 * Component for the landing page of the application.
 *
 * This component serves as the main landing page of the application, featuring a captivating
 * background video, an interactive form container, an animated heading, and additional content.
 * Users can engage with the dynamic UI elements on this page, including toggling an "About" text
 * section for additional information.

 *
 * @component
 * @return {JSX.Element} Home component
 * @memberof MyRoutes
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
                <div className="home-info" onClick={handleSearchHover}> <img className="home-info-image" src={info} /> </div>

            </div>

        </div>
    )

};
export default Home;


