import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gameSymbol from '../../images/icons/controller.png'


/**
 * Component representing a score card displayed on the profile page.
 *
 * This component renders a score card with title, dir, a decorative progress bar, score,
 * and timestamp information. The appearance of each score card is dynamically
 * determined based on its order and total number of cards. The component also
 * provides a link to the detailed song page for further exploration.
 *
 * @component
 * @param {Object} props - Component props containing score card data.
 * @return {JSX.Element} HomeScoreCard component
 */

function HomeScoreCard(props) {

  const [backgroundColor, setBackgroundColor] = useState(null)
  const [textColor, setTextColor] = useState(null)
  const [imageColor, setImageColor] = useState(null)

  useEffect(() => {
    const startingHue = 150;
    const bkgSaturation = '60%';
    const bkgLightness = '60%';

    const textSaturation = '70%';
    const textLightness = '60%';

    const hue = (props.order * (360 / props.cardNumber) + startingHue) % 360;
    setBackgroundColor(`hsl(${hue}, ${bkgSaturation}, ${bkgLightness})`)
    const oppositeHue = (hue + 180) % 360;
    setTextColor(`hsl(${oppositeHue}, ${textSaturation}, ${textLightness})`)
    setImageColor(`invert(90%) sepia(13%) saturate(3207%) hue-rotate(${oppositeHue}deg) brightness(95%) contrast(80%)`)

  }, [])



  return (

    <div className="score-card" style={{ backgroundColor: backgroundColor, }}>
      <Link style={{ textDecoration: 'none', color: "white" }} className="score-card-link" to={`/song/${props.mp3Id}`} key={props.mp3Id}>


        <div className="score-card-header" style={{ color: textColor }} >
          <div className="score-card-title">
            {props.title} </div>
          <div className="score-card-dir">

            {props.dir}
          </div>
          <div class="bar">
            <div class="emptybar"></div>
            <div class="filledbar"></div>
          </div>
        </div>
        <img className='profile-card-image' src={gameSymbol} style={{ filter: imageColor }}></img>

        <div className="score-card-score-container">
          <p className="score-card-score" >Score: {props.score}</p>
          <p >🕒{props.scoreTimestamp}</p>
        </div>


      </Link>
    </div>



  );
}


export default HomeScoreCard;