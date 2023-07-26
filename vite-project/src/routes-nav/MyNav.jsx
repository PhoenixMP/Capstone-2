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
  const { onGamePage, currentUser, toggleSignupForm, toggleLoginForm } = useContext(UserContext);



  function loggedInNav() {
    return (
      <ul className="nav-items">

        <li className="nav-link">
          <NavLink style={{ textDecoration: 'none', color: "white" }} to="/songs">
            Search Songs
          </NavLink>
        </li>
        <li className="nav-link">
          <NavLink style={{ textDecoration: 'none', color: "white" }} to="/profile">
            Your Scores
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
            Search Songs
          </NavLink>
        </li>



        <div className="login-register">

          <button id="login" className="button" onClick={toggleLoginForm}>
            Login
          </button>
        </div>



      </ul >
    );
  }

  const getNav = () => {
    if (onGamePage) {
      return
    } else {
      return (
        <div className="navbar-container">
          <div className="left-side-nav">
            <div className="logo-container">
              <Link style={{ textDecoration: 'none', color: "white" }} className="navbar-brand" to="/">
                Note-Worthy
              </Link >
            </div>
            {currentUser ? (<div className="welcome-nav"> Sup, {currentUser.firstName || currentUser.username}?</div>) : ""}
          </div>
          {currentUser ? loggedInNav() : loggedOutNav()}
        </div>
      );
    }

  }

  return (
    <div>
      {getNav()}
    </div>
  );
}

export default MyNav;
