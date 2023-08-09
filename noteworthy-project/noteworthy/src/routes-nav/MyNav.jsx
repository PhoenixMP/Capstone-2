import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "./Navigation.css";


/**
 * Navigation bar for the site. Shows up on every page except the game page.
 *
 * This component displays the navigation bar at the top of the page. The content of the navigation bar
 * depends on whether the user is logged in or not. When the user is logged in, it shows links to main
 * areas of the site and a logout button. When the user is not logged in, it shows links to the song search
 * page and a login button.
 *
 * @component
 * @param {function} logout - Function to handle user logout
 * @return {JSX.Element} Navigation bar component
 */

function MyNav({ logout }) {
  const { handleHeadingHover, onGamePage, currentUser, toggleLoginForm, } = useContext(UserContext);


  // Function to render navigation links and content when user is logged in
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

  // Function to render navigation links and content when user is logged out
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


  // Function to determine which navigation content to render based on user's login status and current page
  const getNav = () => {
    if (onGamePage) {
      return
    } else {
      return (
        <div className="navbar-container" onMouseEnter={handleHeadingHover}>
          <div className="left-side-nav">
            <div className="logo-container">
              <Link style={{ textDecoration: 'none', color: "white" }} className="navbar-brand left" to="/">
                NoteWorthy
              </Link >
            </div>
            {currentUser ? (<div className="welcome-nav left"> Sup, {currentUser.firstName || currentUser.username}!</div>) : ""}
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
