const API_KEY = "2dd0ec4f3c6b8d011e91690d1cd8fa86";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

/* Local awards data keyed by TMDB movie ID */
const FILM_AWARDS = {
  12498: [
    "Academy Award winner for Best Adapted Screenplay"
  ],
  69: [
    "Academy Award winner for Best Actress",
    "Academy Award winner for Best Sound Mixing",
    "Golden Globe winner"
  ],
  9440: [
    "Academy Award nominations"
  ],
  17529: [
    "Academy Award nominations"
  ]
};

document.addEventListener("DOMContentLoaded", loadFilmDetails);

async function loadFilmDetails() {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");
  const detailsContainer = document.getElementById("filmDetails");

  if (!movieId) {
    detailsContainer.innerHTML = "<p>No film ID was provided.</p>";
    return;
  }

  try {
    const movieResponse = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );

    if (!movieResponse.ok) {
      throw new Error("Could not fetch movie details.");
    }

    const movie = await movieResponse.json();

    const creditsResponse = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    );

    if (!creditsResponse.ok) {
      throw new Error("Could not fetch cast and crew details.");
    }

    const credits = await creditsResponse.json();

    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "assets/images/no-image.png";

    const genres = movie.genres && movie.genres.length > 0
      ? movie.genres.map(genre => genre.name).join(", ")
      : "Unavailable";

    const directors = credits.crew
      ? credits.crew
          .filter(person => person.job === "Director")
          .map(person => person.name)
          .join(", ")
      : "Unavailable";

    const cast = credits.cast
      ? credits.cast
          .slice(0, 8)
          .map(person => person.name)
          .join(", ")
      : "Unavailable";

    const awards = FILM_AWARDS[movieId]
      ? FILM_AWARDS[movieId].join(", ")
      : "No award information available";

    detailsContainer.innerHTML = `
      <h2>${movie.title || "Title not available"}</h2>
      <img
        src="${posterUrl}"
        alt="Poster for ${movie.title || "film"}"
        class="details-poster"
      >
      <p><strong>Full Title:</strong> ${movie.title || "Unavailable"}</p>
      <p><strong>Release Date:</strong> ${movie.release_date || "Unavailable"}</p>
      <p><strong>Genre:</strong> ${genres}</p>
      <p><strong>Original Language:</strong> ${movie.original_language || "Unavailable"}</p>
      <p><strong>Budget:</strong> ${
        movie.budget ? "$" + movie.budget.toLocaleString() : "Unavailable"
      }</p>
      <p><strong>Director:</strong> ${directors || "Unavailable"}</p>
      <p><strong>Main Cast:</strong> ${cast || "Unavailable"}</p>
      <p><strong>Awards:</strong> ${awards}</p>
      <p><strong>Overview:</strong> ${movie.overview || "Unavailable"}</p>
    `;
  } catch (error) {
    console.error("Error loading film details:", error);
    detailsContainer.innerHTML = `
      <p>Sorry, there was a problem loading the film details.</p>
    `;
  }
}