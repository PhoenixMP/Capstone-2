import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "./Navigation.css";


/** Navigation bar for site. Shows up on every page.
 *
 * When user is logged in, shows links to main areas of site. When not,
 * shows link to Login and Signup forms.
 *
 * Rendered by App.
 */

function MyNav({ logout }) {
  const { currentUser, toggleSignupForm, toggleLoginForm } = useContext(UserContext);



  function loggedInNav() {
    return (
      <ul className="nav-items">

        <li className="nav-link">
          <NavLink style={{ textDecoration: 'none', color: "white" }} to="/songs">
            Song Search
          </NavLink>
        </li>
        <li className="nav-link">
          <NavLink style={{ textDecoration: 'none', color: "white" }} to="/profile">
            Profile
          </NavLink>
        </li>
        <div className="login-register">
          <button id="logout" className="button" onClick={logout}>
            Logout {currentUser.first_name || currentUser.username}
          </button>
        </div>
      </ul>
    );
  }

  function loggedOutNav() {
    return (
      <ul className="nav-items">

        <li className="nav-link">
          <NavLink style={{ textDecoration: 'none', color: "white" }} to="/songs">
            Song Search
          </NavLink>
        </li>


        <NavLink style={{ textDecoration: 'none' }} to="/">
          <div className="login-register">
            <button id="login" className="button" onClick={toggleLoginForm}>
              Login
            </button>
            <button id="signup" className="button" onClick={toggleSignupForm}>
              Signup
            </button>
          </div>
        </NavLink>


      </ul >
    );
  }

  return (
    <div className="navbar-container">
      <div className="logo-container">
        <Link style={{ textDecoration: 'none', color: "white" }} className="navbar-brand" to="/">
          MelodicNotes
        </Link >
      </div>

      {currentUser ? loggedInNav() : loggedOutNav()}
    </div>
  );
}

export default MyNav;
