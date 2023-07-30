import React, { useState, useEffect, ReactElement, ReactNode, } from "react";
import jwt_decode from "jwt-decode";
import { BrowserRouter } from "react-router-dom";
import MyRoutes from './routes-nav/MyRoutes'
import MyNav from './routes-nav/MyNav'
import UserContext from "./auth/UserContext";
import musicContext from "./songs/MusicContext";
import useLocalStorage from "./hooks/useLocalStorage";
import Melodic2API from "./api/api";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";


import './index.css'
import './App.css'







/** Jobly application.

 * - currentUser: user obj from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app.
 *
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 * App -> MyRoutes
 */


function App() {

  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);
  const [song, setSong] = useLocalStorage("song", null);
  const [notes, setNotes] = useLocalStorage("notes", null);
  const [encodedData, setEncodedData] = useState(null);

  const [hasRefreshedGame, setHasRefreshedGame] = useState(false);
  const [userBestScore, setUserBestScore] = useLocalStorage("UserBestScore", false);
  const [topScore, setTopScore] = useLocalStorage("topScore", null);
  const [userHasTop, setUserHasTop] = useLocalStorage("userHasTop", null);

  const [userBeatTop, setUserBeatTop] = useLocalStorage("userBeatTop", null);
  const [userBeatPersonalBest, setUserBeatPersonalBest] = useLocalStorage("userBeatPersonalBest", null);
  const [totalScore, setTotalScore] = useLocalStorage("totalScore", null);
  const [recalcGameResults, setRecalcGameResults] = useLocalStorage("recalcGameResults", false);

  const [loginFormError, setLoginFormError] = useState(false)
  const [signupFormError, setSignupFormError] = useState(false)

  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const [onGamePage, setOnGamePage] = useState(false)


  const [token, setToken] = useLocalStorage("token", null);



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
    const res = await Melodic2API.registerUser(data);
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
    const res = await Melodic2API.loginUser(data);
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



  function toggleLoginForm() {
    setShowLogin(prevState => !prevState)
    setShowSignup(false)
    setLoginFormError(false)


  }
  function toggleSignupForm() {
    setShowSignup(prevState => !prevState)
    setShowLogin(false)
    setSignupFormError(false)

  }




  async function getUserBestScore(mp3Id, username, highScore) {
    if (highScore && (highScore.username === username)) {

      setUserHasTop(true)
      setUserBestScore(highScore)
    } else {
      setUserHasTop(false)
      const score = await Melodic2API.getUserSongTopScore(mp3Id, username);

      if (score === null) {
        setUserBestScore(false);

      } else {
        setUserBestScore(score);
      }
    }
  }



  // Load user info from API. Until a user is logged in and they have a token,
  // this should not run. It only needs to re-run when a user logs out, so
  // the value of the token is a dependency for this effect.
  useEffect(() => {
    async function checkToken() {
      if (token) {
        try {
          let { username } = jwt_decode(token);
          Melodic2API.userToken = token;
          const user = await Melodic2API.getUser(username);
          setCurrentUser(user);

        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
    }

    checkToken();


  }, [token]);


  const getFormJSX = () => {
    if (showLogin) {
      return (
        <LoginForm login={login} toggleSignupForm={toggleSignupForm} />)

    } else if (showSignup) {
      return (<SignupForm signup={signup} toggleLoginForm={toggleLoginForm} />)
    }
  }

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
