import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../home/Home";
import Songs from "../songs/Songs";
import SongDetails from "../song-details/SongDetails";
import Profile from "../profile/Profile"
import Game from "../game/Game"
import UserContext from "../auth/UserContext";



/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function MyRoutes({ login, signup, updateUser }) {
  const { currentUser } = useContext(UserContext);

  console.debug(
    "Routes",
    `login=${typeof login}`,
    `register=${typeof register}`,
  );

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

