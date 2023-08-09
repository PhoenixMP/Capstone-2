import React from "react";
import "./LoadingSpinner.css";

/**
 * Loading message used by components that fetch API data.
 *
 * This component displays a loading spinner, indicating that data is being fetched
 * from an API. It is commonly used to provide visual feedback to users while waiting
 * for content to load.
 *
 * @component
 * @return {JSX.Element} LoadingSpinner component
 */

function LoadingSpinner() {
  return (
    <div className="loader"></div>

  );
}

export default LoadingSpinner;