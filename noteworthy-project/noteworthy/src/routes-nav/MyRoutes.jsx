import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../home/Home";
import Songs from "../songs/Songs";
import SongDetails from "../song-details/SongDetails";
import Profile from "../profile/Profile"
import Game from "../game/Game"
import UserContext from "../auth/UserContext";



/**
 * Site-wide routes.

 *
 * @component
 * @param {function} login - Function to handle user login
 * @param {function} signup - Function to handle user signup
 * @return {JSX.Element} Routes component defining site-wide routes
 */
function MyRoutes({ login, signup }) {
  const { currentUser } = useContext(UserContext);


  return (

    <Routes>
      <Route exact path="/" element={<Home login={login} signup={signup} />} />

      <Route exact path="/profile" element={currentUser ? (<Profile />) : (<Navigate replace to={"/"} />)} />

      <Route exact path="/songs" element={<Songs login={login} signup={signup} />} />

      <Route exact path="/song/:mp3Id" element={<SongDetails login={login} signup={signup} />} />

      <Route exact path="/game/:mp3Id" element={<Game />} />



      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>

  );
}

export default MyRoutes;

