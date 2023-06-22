import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import UserContext from "../auth/UserContext";
import Profile from "../profile/Profile"

/** "Higher-Order Component" for private routes.
 *
 * In routing component, use these instead of <Route ...>. This component
 * will check if there is a valid current user and only continues to the
 * route if so. If no user is present, redirects to login form.
 */

function PrivateRoute({ exact, path, children }) {
  const { currentUser } = useContext(UserContext);

  console.debug(
    "PrivateRoute",
    "exact=", exact,
    "path=", path,
    "component=", children
  );

  if (currentUser) {
    return <Navigate replace to="/login" />;
  }

  return (

    <Routes>
      <Route path={path} element={children} />
    </Routes>
  );
}

export default PrivateRoute;
