const API_Key = "2dd0ec4f3c6b8d011e91690d1cd8fa86";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

document.addEventListener("DOMContentLoaded", loadFilmDetails);

async function loadFilmDetails() {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");
  const detailsContainer = document.getElementById("filmDetails");

  if (!movieId) {
    detailsContainer.innerHTML = "<p>No film ID was provided in the URL.</p>";
    return;
  }

  try {
    const movieResponse = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );

    if (!movieResponse.ok) {
      throw new Error(`Could not fetch movie details. Status: ${movieResponse.status}`);
    }

    const movie = await movieResponse.json();

    const creditsResponse = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    );

    if (!creditsResponse.ok) {
      throw new Error(`Could not fetch cast and crew details. Status: ${creditsResponse.status}`);
    }

    const credits = await creditsResponse.json();

    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "assets/images/no-image.png";

    const genres = movie.genres && movie.genres.length > 0
      ? movie.genres.map(genre => genre.name).join(", ")
      : "Not available";

    const directors = credits.crew && credits.crew.length > 0
      ? credits.crew
          .filter(person => person.job === "Director")
          .map(person => person.name)
          .join(", ") || "Not available"
      : "Not available";

    const producers = credits.crew && credits.crew.length > 0
      ? credits.crew
          .filter(person => person.job === "Producer")
          .map(person => person.name)
          .slice(0, 5)
          .join(", ") || "Not available"
      : "Not available";

    const cast = credits.cast && credits.cast.length > 0
      ? credits.cast
          .slice(0, 8)
          .map(person => person.name)
          .join(", ")
      : "Not available";

    detailsContainer.innerHTML = `
      <h2>${movie.title || "Title not available"}</h2>
      <img
        src="${posterUrl}"
        alt="Poster for ${movie.title || "film"}"
        class="details-poster"
      >
      <p><strong>Full Title:</strong> ${movie.title || "Not available"}</p>
      <p><strong>Release Date:</strong> ${movie.release_date || "Not available"}</p>
      <p><strong>Genre:</strong> ${genres}</p>
      <p><strong>Original Language:</strong> ${movie.original_language || "Not available"}</p>
      <p><strong>Popularity:</strong> ${movie.popularity || "Not available"}</p>
      <p><strong>Budget:</strong> ${
        movie.budget ? "$" + movie.budget.toLocaleString() : "Not available"
      }</p>
      <p><strong>Director(s):</strong> ${directors}</p>
      <p><strong>Producer(s):</strong> ${producers}</p>
      <p><strong>Main Cast:</strong> ${cast}</p>
      <p><strong>Overview:</strong> ${movie.overview || "Not available"}</p>
      <p><strong>TMDB Rating:</strong> ${
        movie.vote_average ? movie.vote_average.toFixed(1) + " / 10" : "Not available"
      }</p>
      <p><strong>Vote Count:</strong> ${movie.vote_count || "Not available"}</p>
    `;
  } catch (error) {
    console.error("Error loading film details:", error);
    detailsContainer.innerHTML = `
      <p>Sorry, there was a problem loading the film details.</p>
      <p>Please check your API key, the movie ID in the URL, and your internet connection.</p>
    `;
  }
}