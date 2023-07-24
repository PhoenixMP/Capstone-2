import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gameSymbol from '../../images/icons/controller.png'



/** Loading message used by components that fetch API data. */

function HomeScoreCard(props) {

  const [backgroundColor, setBackgroundColor] = useState(null)
  const [textColor, setTextColor] = useState(null)
  const [imageColor, setImageColor] = useState(null)

  useEffect(() => {
    const startingHue = 150;
    const bkgSaturation = '60%'; // You can adjust this value to control the saturation
    const bkgLightness = '60%';

    const textSaturation = '70%'; // You can adjust this value to control the saturation
    const textLightness = '60%';

    const hue = (props.order * (360 / props.cardNumber) + startingHue) % 360;
    setBackgroundColor(`hsl(${hue}, ${bkgSaturation}, ${bkgLightness})`)
    const oppositeHue = (hue + 180) % 360;
    setTextColor(`hsl(${oppositeHue}, ${textSaturation}, ${textLightness})`)
    setImageColor(`invert(90%) sepia(13%) saturate(3207%) hue-rotate(${oppositeHue}deg) brightness(95%) contrast(80%)`)



  }, [])




  function getCardInfo() {
    if (props.undefeated) {
      return (
        <div className="score-card-score">
          <p >🎯 Your Undefeated Score: {props.score}</p>
          <p >🕒 Recorded At: {props.scoreTimestamp}</p>
        </div>

      )
    } else {
      return (
        <div className="score-card-score">
          <p >🎯Your Best Score: {props.score}</p>
          <p >🕒 Recorded At: {props.scoreTimestamp}</p>
        </div>

      )
    }
  }




  return (
    <Link style={{ textDecoration: 'none', color: "white" }} className="score-card-link" to={`/song/${props.mp3Id}`} key={props.mp3Id}>

      <div style={{ backgroundColor: backgroundColor, color: textColor }} className="score-card ">

        <div className="img-section">
          <img className="img" style={{ filter: imageColor }} src={gameSymbol} alt="" />         </div>
        <div className="score-card-header">
          <div className="score-card-title">
            {props.title}
            <p>{props.dir}</p>
          </div>
        </div>

        {getCardInfo()}


      </div>
    </Link>


  );
}


export default HomeScoreCard;