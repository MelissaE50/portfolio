/* 
arkFilmDBP.js

Purpose: Search button on home page. Loads film, actor, or actress details from TMDB based on the query. It will search for a film first and if that faiils, it will search for an actor/actress. Displays information, Arkansas connection,
awards, and cast or fimlography links, respectively, via resuable fiilmsDetails and/ or actors-actressesDetails page. 

Data Sources: TMDB API for actor/actress and film details and movie info. Local objects for awards and Arkansas connection data.
*/

// The Movie Database configuration
const API_KEY = "2dd0ec4f3c6b8d011e91690d1cd8fa86";
const BASE_URL = "https://api.themoviedb.org/3";

// Search button on home page
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  if (!searchBtn || !searchInput) {
    return;
  }

  searchBtn.addEventListener("click", handleSearch);

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  });
});

async function handleSearch() {
  const searchInput = document.getElementById("searchInput");
  const query = searchInput.value.trim();

  // Prevent empty searches before calling the API
  if (!query) {
    alert("Please enter a film, actor, or actress name.");
    return;
  }

  try {
    // Search for a film title first on TMDB (encodeURIComponent prevents spaces and special characters from breaking the URL)
    const filmResponse = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    // Throws an error if no film is found
    if (!filmResponse.ok) {
      throw new Error(`Film search failed. Status: ${filmResponse.status}`);
    }

    // Convert filmResponse from JSON into js object for display
    const movieData = await filmResponse.json(); 

    // Redirect to filmsDetails page if there are results  
    if (movieData.results && movieData.results.length > 0) {
      window.location.href = `filmsDetails.html?id=${movieData.results[0].id}`;
      return;
    }

    // If no film is found, search for actor/actress on TMDB
    const actorResponse = await fetch(
      `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    // Convert actorResponse from JSON into js object for display
    const actorData = await actorResponse.json(); 

     // Redirect to actors-actressesDetails page if there are results
    if (actorData.results && actorData.results.length > 0) {
      window.location.href = `actors-actressesDetails.html?id=${actorData.results[0].id}`;
      return;
    }

     // Returns error message if there are no results found
    alert("No matching film, acotr, or actress was found.");
  } catch (error) {
    console.error("Search error:", error);
    alert("Sorry, there was a problem with your search.");
  }
}


