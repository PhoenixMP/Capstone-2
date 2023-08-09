import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { BrowserRouter } from "react-router-dom";
import MyRoutes from './routes-nav/MyRoutes'
import MyNav from './routes-nav/MyNav'
import UserContext from "./auth/UserContext";
import musicContext from "./songs/MusicContext";
import useLocalStorage from "./hooks/useLocalStorage";
import NoteworthyAPI from "./api/api";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";


import './index.css'
import './App.css'




/**
 * Main component of the Noteworthy web application.
 *
 * This component serves as the entry point for the application. It handles
 * user authentication, routing, and context management. It provides the
 * top-level structure of the application, including navigation and routes.
 *
 * @component
 * @return {JSX.Element} App component
 */




function App() {

  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);
  const [song, setSong] = useLocalStorage("song", null);
  const [notes, setNotes] = useLocalStorage("notes", null);
  const [encodedData, setEncodedData] = useState(null);// Encoded audio data for the selected song

  const [hasRefreshedGame, setHasRefreshedGame] = useState(false); // Flag to indicate whether the game page has been refreshed
  const [userBestScore, setUserBestScore] = useLocalStorage("UserBestScore", false);
  const [topScore, setTopScore] = useLocalStorage("topScore", null);
  const [userHasTop, setUserHasTop] = useLocalStorage("userHasTop", null);

  const [userBeatTop, setUserBeatTop] = useLocalStorage("userBeatTop", null);// Flag to indicate whether the user beat the top score
  const [userBeatPersonalBest, setUserBeatPersonalBest] = useLocalStorage("userBeatPersonalBest", null);// Flag to indicate whether the user beat their personal best score
  const [totalScore, setTotalScore] = useLocalStorage("totalScore", null);// Total score achieved by the user
  const [recalcGameResults, setRecalcGameResults] = useLocalStorage("recalcGameResults", false);// Flag to indicate whether game results need to be recalculated after login

  const [loginFormError, setLoginFormError] = useState(false)
  const [signupFormError, setSignupFormError] = useState(false)

  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const [onGamePage, setOnGamePage] = useState(false)


  const [token, setToken] = useLocalStorage("token", null);


  // Handling login and signup form errors...
  useEffect(() => {
    if (loginFormError) {
      setShowLogin(true)
      setShowSignup(false)
      setSignupFormError(false)
    } else if (signupFormError) {
      setShowLogin(false)
      setShowSignup(true)
      setLoginFormError(false)
    }
  }, [loginFormError, signupFormError])



  //Register new User
  async function signup(data, mp3Id = null) {
    setLoginFormError(false)
    const res = await NoteworthyAPI.registerUser(data);
    if (res.status === 400) {
      setSignupFormError(res.data.error.message)
    } else {
      setToken(res.token);
      setShowLogin(false)
      setShowSignup(false)
      if (mp3Id) {

        setRecalcGameResults(true)
        setUserBestScore(false)
      }
    }
  }


  //Login User
  async function login(data, mp3Id = null) {
    setSignupFormError(false)
    const res = await NoteworthyAPI.loginUser(data);
    if (res.status === 401) {

      setLoginFormError(res.data.error.message)

    } else {
      setToken(res.token);
      setShowLogin(false)
      setShowSignup(false)
      if (mp3Id) {
        let { username } = jwt_decode(res)
        getUserBestScore(mp3Id, username, topScore)
        setRecalcGameResults(true)
      }

    }
  }


  /** Handles site-wide logout. */
  function logout() {
    console.log('logging out')
    setCurrentUser(null);
    setToken(null);
    setUserBestScore(null);
    setUserHasTop(null);

  }


  //Toggle display of the login form.
  function toggleLoginForm() {
    setShowLogin(prevState => !prevState)
    setShowSignup(false)
    setLoginFormError(false)


  }

  //Toggle display of the signup form.
  function toggleSignupForm() {
    setShowSignup(prevState => !prevState)
    setShowLogin(false)
    setSignupFormError(false)

  }



  /**
   * Fetches the user's best score for a specific song.
   * 
   * @param {string} mp3Id - The ID of the song.
   * @param {string} username - The username of the user.
   * @param {Object} highScore - The top score object.
   */
  async function getUserBestScore(mp3Id, username, highScore) {
    if (highScore && (highScore.username === username)) {

      setUserHasTop(true)
      setUserBestScore(highScore)
    } else {
      setUserHasTop(false)
      const score = await NoteworthyAPI.getUserSongTopScore(mp3Id, username);

      if (score === null) {
        setUserBestScore(false);

      } else {
        setUserBestScore(score);
      }
    }
  }



  /**
   * Checks the token and fetches user information if available.
   */
  useEffect(() => {
    async function checkToken() {
      if (token) {
        try {
          let { username } = jwt_decode(token);
          NoteworthyAPI.userToken = token;
          const user = await NoteworthyAPI.getUser(username);
          setCurrentUser(user);

        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
    }
    checkToken();

  }, [token]);



  /**
 * Renders the appropriate form based on the current display state.
 * 
 * @returns {JSX.Element} JSX of the login or signup form.
 */
  const getFormJSX = () => {
    if (showLogin) {
      return (
        <LoginForm login={login} toggleSignupForm={toggleSignupForm} />)

    } else if (showSignup) {
      return (<SignupForm signup={signup} toggleLoginForm={toggleLoginForm} />)
    }
  }


  /**
 * Sets the `isAnimated` state to trigger animation effects on heading hover.
 */
  const handleHeadingHover = () => {
    setIsAnimated('animated')
  }





  return (

    <BrowserRouter>
      <UserContext.Provider value={{ loginFormError, signupFormError, isAnimated, handleHeadingHover, recalcGameResults, setRecalcGameResults, totalScore, setTotalScore, userBeatPersonalBest, setUserBeatPersonalBest, userBeatTop, setUserBeatTop, getUserBestScore, onGamePage, setOnGamePage, getFormJSX, userHasTop, setUserHasTop, toggleSignupForm, toggleLoginForm, setShowLogin, setShowSignup, showLogin, showSignup, currentUser, userBestScore, setUserBestScore, topScore, setTopScore }}>
        <musicContext.Provider value={{ song, setSong, notes, setNotes, encodedData, setEncodedData, hasRefreshedGame, setHasRefreshedGame }}>
          <MyNav logout={logout} onGamePage={onGamePage} />
          <MyRoutes login={login} signup={signup} />
        </musicContext.Provider>
      </UserContext.Provider >
    </BrowserRouter>

  );
}

export default App;
