
const API_KEY = "2dd0ec4f3c6b8d011e91690d1cd8fa86";
const BASE_URL = "https://api.themoviedb.org/3";

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

  if (!query) {
    alert("Please enter a film, actor, or actress name.");
    return;
  }

  try {
    // Search for a movie first
    const movieResponse = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!movieResponse.ok) {
      throw new Error(`Movie search failed. Status: ${movieResponse.status}`);
    }

    const movieData = await movieResponse.json();

    if (movieData.results && movieData.results.length > 0) {
      window.location.href = `filmsDetails.html?id=${movieData.results[0].id}`;
      return;
    }

    // If no movie found, search for a person
    const personResponse = await fetch(
      `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!personResponse.ok) {
      throw new Error(`Person search failed. Status: ${personResponse.status}`);
    }

    const personData = await personResponse.json();

    if (personData.results && personData.results.length > 0) {
      window.location.href = `actor-actressesDetails.html?id=${personData.results[0].id}`;
      return;
    }

    alert("No matching film, acotr, or actress was found.");
  } catch (error) {
    console.error("Search error:", error);
    alert("Sorry, there was a problem with your search.");
  }
}


