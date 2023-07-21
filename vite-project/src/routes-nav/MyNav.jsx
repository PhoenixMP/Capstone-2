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
      <ul className="nav-link">

        <li className="nav-link">
          <NavLink style={{ textDecoration: 'none' }} to="/songs">
            Songs
          </NavLink>

          <NavLink style={{ textDecoration: 'none' }} to="/profile">
            Profile
          </NavLink>
        </li>
        <div className="login-register">
          <button style={{ textDecoration: 'none' }} className="button" onClick={logout}>
            Logout {currentUser.first_name || currentUser.username}
          </button>
        </div>
      </ul>
    );
  }

  function loggedOutNav() {
    return (
      <ul className="nav-link">

        <li className="nav-item">
          <NavLink style={{ textDecoration: 'none' }} to="/songs">
            Songs
          </NavLink>
        </li>

        <div className="login-register">
          <NavLink style={{ textDecoration: 'none' }} to="/">
            <button className="button" onClick={toggleLoginForm}>
              Login
            </button>
            <button style={{ textDecoration: 'none' }} className="button" onClick={toggleSignupForm}>
              Signup
            </button>
          </NavLink>
        </div>

      </ul>
    );
  }

  return (
    <div className="navbar-container">
      <div className="logo-container">
        <Link style={{ textDecoration: 'none' }} className="navbar-brand" to="/">
          MelodicNotes
        </Link >
      </div>

      {currentUser ? loggedInNav() : loggedOutNav()}
    </div>
  );
}

export default MyNav;
