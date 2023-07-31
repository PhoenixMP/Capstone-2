import React, { useState } from "react";
import './SearchForm.css'
import '@fortawesome/fontawesome-free/css/all.min.css';


/** Search widget.
 *
 * Appears on CompanyList and JobList so that these can be filtered
 * down.
 *
 * This component doesn't *do* the searching, but it renders the search
 * form and calls the `searchFor` function prop that runs in a parent to do the
 * searching.
 *
 * { CompanyList, JobList } -> SearchForm
 */

function SearchForm({ searchFor }) {


  const [searchTerm, setSearchTerm] = useState("");

  /** Tell parent to filter */
  function handleSubmit(evt) {
    // take care of accidentally trying to search for just spaces
    evt.preventDefault();

    searchFor(searchTerm.trim() || undefined);
    setSearchTerm(searchTerm.trim());
  }

  /** Update form fields */
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
