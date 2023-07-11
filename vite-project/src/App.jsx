
import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";

import MyRoutes from './routes-nav/MyRoutes'
import MyNav from './routes-nav/MyNav'
import UserContext from "./auth/UserContext";
import musicContext from "./songs/MusicContext";
import useLocalStorage from "./hooks/useLocalStorage";
import Melodic2API from "./api/api";
import "./routes-nav/Navigation.css";


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



  const [token, setToken] = useLocalStorage("token", null);
  const [userInfoLoaded, setUserInfoLoaded] = useState(false)



  //Register new User
  async function signup(data) {
    const res = await Melodic2API.registerUser(data);
    setToken(res);
  }

  //Login User
  async function login(data) {
    const res = await Melodic2API.loginUser(data);
    setToken(res);
  }


  /** Handles site-wide logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  //Update User
  async function updateUser(data) {
    const user = await Melodic2API.updateUser(currentUser.username, data)
    setCurrentUser(user)
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
      setUserInfoLoaded(true)
    }
    setUserInfoLoaded(false)
    checkToken();


  }, [token]);





  return (

    <BrowserRouter>
      <UserContext.Provider value={{ currentUser }}>
        <musicContext.Provider value={{ song, setSong, notes, setNotes, encodedData, setEncodedData, hasRefreshedGame, setHasRefreshedGame }}>
          <div>
            <MyNav logout={logout} />
            <MyRoutes login={login} signup={signup} />
          </div>
        </musicContext.Provider>
      </UserContext.Provider >
    </BrowserRouter>

  );
}

export default App;
