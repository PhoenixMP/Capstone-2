import React, { useState } from "react";
import './SearchForm.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

/**
 * Search form component for filtering content.
 *
 * This component provides a search input field and a search button for users to input
 * search terms. It interacts with a parent component by invoking the provided 'searchFor'
 * function with the entered search term when the form is submitted.
 *
 * @component
 * @param {function} searchForm - Function to perform content filtering based on the search term.
 * @return {JSX.Element} SearchForm component
 */


function SearchForm({ searchFor }) {


  const [searchTerm, setSearchTerm] = useState("");


  function handleSubmit(evt) {
    evt.preventDefault();

    searchFor(searchTerm.trim() || undefined);
    setSearchTerm(searchTerm.trim());
  }


  function handleChange(evt) {
    setSearchTerm(evt.target.value);
  }

  return (
    <div className="wrap">
      <form id="search-form" onSubmit={handleSubmit}>
        <input

          id="song-search"
          name="searchTerm"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit" className="searchButton">
          <i className="fa fa-search"></i>
        </button>
      </form>
    </div>
  );
}

export default SearchForm;
