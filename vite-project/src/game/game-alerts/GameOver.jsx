
import SaveScore from "../game-control/SaveScore";



function GameOver({ score, maxStreak }) {
    return (


        <div >
            <div> Your Max Streak This Round:{maxStreak}</div>
            <div>Your Score This Round: {score}</div>
            <SaveScore score={score} />
        </div>

    )

};
export default GameOver;

