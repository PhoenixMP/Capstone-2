import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute"
import Home from "../home/Home";
import Songs from "../songs/Songs";
import SongDetails from "../songs/SongDetails";
import TrackDetails from "../songs/TrackDetails";
import Piano from "../piano/Piano"
import Profile from "../profile/Profile"


import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import updateUserForm from "../profile/UpdateUserForm";



/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function MyRoutes({ login, signup }) {
  console.debug(
    "Routes",
    `login=${typeof login}`,
    `register=${typeof register}`,
  );

  return (
    <div className="pt-5">
      <Routes>

        <Route exact path="/" element={<Home />} />

        <Route exact path="/login" element={<LoginForm login={login} />} />

        <Route exact path="/signup" element={<SignupForm signup={signup} />} />

        <Route exact path="/songs" element={<Songs />} />

        <Route exact path="/song/:midiId" element={<SongDetails />} />

        <Route exact path="track/:id" element={<TrackDetails />} />

        <Route exact path="/piano" element={<Piano />} />


        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

export default MyRoutes;

