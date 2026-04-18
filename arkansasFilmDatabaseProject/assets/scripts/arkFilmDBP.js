
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

  // Search query using if statement and displays message if box is empty, try/catch block for error handling
  if (!query) {
    alert("Please enter a film, actor, or actress name.");
    return;
  }

  try {
    // Search for a movie first on TMDB, use API to retrieve information, if applicable
    const movieResponse = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!movieResponse.ok) {
      throw new Error(`Movie search failed. Status: ${movieResponse.status}`);
    }

    const movieData = await movieResponse.json(); // Convert movieResponse from JSON into js object for display

    // Returns movie info if there are results for the movie searched for    
    if (movieData.results && movieData.results.length > 0) {
      window.location.href = `filmsDetails.html?id=${movieData.results[0].id}`;
      return;
    }

    // If no movie is found, search for actor/actress, uses API to retrieve information
    const personResponse = await fetch(
      `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!personResponse.ok) {
      throw new Error(`Person search failed. Status: ${personResponse.status}`);
    }

    const personData = await personResponse.json(); // Convert personResponse from JSON into js object for display

     // Returns actor/actress info if there are results for the actor/actress searched for
    if (personData.results && personData.results.length > 0) {
      window.location.href = `actor-actressesDetails.html?id=${personData.results[0].id}`;
      return;
    }

     // Returns error message if there are no results found for the film, actor, or actress
    alert("No matching film, acotr, or actress was found.");
  } catch (error) {
    console.error("Search error:", error);
    alert("Sorry, there was a problem with your search.");
  }
}


