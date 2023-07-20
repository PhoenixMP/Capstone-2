import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";


import Home from "../home/Home";
import Songs from "../songs/Songs";
import SongDetails from "../songs/SongDetails";

import Profile from "../profile/Profile"
import Game from "../game/Game"


import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import updateUserForm from "../profile/UpdateUserForm";
import UserContext from "../auth/UserContext";



/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function MyRoutes({ login, signup }) {
  const { currentUser } = useContext(UserContext);

  console.debug(
    "Routes",
    `login=${typeof login}`,
    `register=${typeof register}`,
  );

  return (
    <div>
      <Routes>

        <Route exact path="/" element={<Home />} />

        <Route exact path="/login" element={!currentUser ? (<LoginForm login={login} />) : (<Navigate replace to={"/profile"} />)} />

        <Route exact path="/signup" element={!currentUser ? (<SignupForm signup={signup} />) : (<Navigate replace to={"/profile"} />)} />

        <Route exact path="/profile" element={currentUser ? (<Profile />) : (<Navigate replace to={"/login"} />)} />

        <Route exact path="/songs" element={<Songs />} />

        <Route exact path="/song/:mp3Id" element={<SongDetails />} />

        <Route exact path="/game/:mp3Id" element={<Game />} />



        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

export default MyRoutes;

