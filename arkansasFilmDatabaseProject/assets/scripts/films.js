/* 
films.js

Purpose: Loads film details from TMDB based on the ID passed in the URL. Displays film information, Arkansas connection,
awards and actor/acress links via resuable filmsDetails page.

Data Sources: TMDB API for actor/actress details and film info. Local objects for awards and Arkansas connection data.
*/

// The Movie Database configuration
const API_KEY = "2dd0ec4f3c6b8d011e91690d1cd8fa86";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Local reference data for awards info using TMDB IDs 
const FILM_AWARDS = {
  103731: [
    "Critics Choice Award winner for Best Young Actor/Actress (Tye Sheridan)"
  ],
  69: [
    "Academy Award winner for Best Actress (Reese Witherspoon)",
    "Critics Choice Award winner for Best Actress (Reese Witherspoon) and Best Soundtrack",
    "Golden Globe winner for Best Performance by an Actor in a Motion Picture (Joaquin Phoenix), Best Performance by an Actress in a Motion Picture (Reese Witherspoon), and Best Motion Picture - Comedy or Musical",
    "Grammy Award winner for Best Compilation Soundtrack Album for Motion Picture, Television, or Other Visual Media"
  ],
  26522: [
    "Image Awards (NAACP) winner for Outstanding Actor in a Motion Picture (Adolph Caesar) and Outstanding Motion Picture"
  ],
  31894: [
    "Image Awards (NAACP) winner for Outstanding Actor in a Television Movie or Mini-Series (Laurence Fishburne) and Outstanding Television Movie or Mini-Series"
  ],
  9440: [
    "Critics Choice Award winner for Best Supporting Actor (Billy Bob Thornton) and Best Supporting Actress (Kathy Bates)"
  ],
  12498: [
    "Academy Award Winner for Best Writing, Screenplay Based on Material Previously Produced or Published (Billy Bob Thornton)"
  ],
  17529: [
    "Academy Award winner for Best Actor in a Leading Role (John Wayne)",
    "Golden Globe Award winner for Best Actor - Drama (John Wayne)"
  ]
}; 

// Local reference data indicating film's connection to Arkansas 
const ARKANSAS_CONNECTION = {
  103731: [
    "Filmed in Dumas, DeWitt, and Lake Village, Arkansas"
  ],
  69: [
    "Johnny Cash grew up in Dyess, Arkansas."
  ],
  26522: [
    "Filmed entirely in Arkansas including Fort Chaffee, Clarendon, and Little Rock's Lamar Porter Field."
  ],
  31894: [
    "Arkansas natives served as pilots, instructors, and support staff in the segregated Tuskegee Airmen during WWII."
  ],
  9440: [
    "The story is based on the 1992 presidential campaign of Arkansas native Bill Clinton."
  ],
  12498: [
    "Sling Blade was written, directed by, and starred in by Arkansas native Billy Bob Thornton. The film was also shot on location in Benton and Saline Counties in Arkansas."
  ],
  17529: [
    "The story was written by Arkansas native Charles Portis and is set in Yell County and Fort Smith, Arkansas."
  ],
  560204: [
    "The story takes place in Little Rock, Arkansas"
  ]
};

document.addEventListener("DOMContentLoaded", loadFilmDetails);

// Read the film ID from the TMDB page URL, if it exists proceed, if not return error message
async function loadFilmDetails() {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");
  const detailsContainer = document.getElementById("filmDetails");

  if (!movieId) {
    detailsContainer.innerHTML = "<p>No film ID was provided.</p>";
    return;
  }

  try {
    const filmResponse = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );

    if (!filmResponse.ok) {
      throw new Error("Could not fetch film details.");
    }

    const movie = await filmResponse.json();

    const creditsResponse = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    );

    if (!creditsResponse.ok) {
      throw new Error("Could not fetch cast details.");
    }

    const credits = await creditsResponse.json();

    // If TMDB provides a film poster path, build the image URL. If not, use placeholder image.
    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "assets/images/no-image.png";

    // If genres exist, list their names separated by a comma. If no genre exists, display "Unavailable".
    const genres = movie.genres && movie.genres.length > 0
      ? movie.genres.map(genre => genre.name).join(", ")
      : "Unavailable";

      // Check if cast exists, if so, create clickable links that redirects to actors-actressesDetails page for the first 10 cast members
    const cast = credits.cast && credits.cast.length > 0
        ? credits.cast
        .slice(0, 10)
        .map(person => {
        return `<a href="actors-actressesDetails.html?id=${person.id}" class="details-link">${person.name}</a>`;
      }).join(", ")
        : "Unavailable";

    const awards = FILM_AWARDS[movieId]
      ? FILM_AWARDS[movieId].join(", ")
      : "Not applicable";

    const ark_connect = ARKANSAS_CONNECTION [movieId]
      ? ARKANSAS_CONNECTION[movieId].join(", ")
      : "Not applicable";

    // Displays film data pulled through API in details container
    detailsContainer.innerHTML = `
      <h2>${movie.title || "Title not available"}</h2>
      <img
        src="${posterUrl}"
        alt="Poster for ${movie.title || "film"}"
        class="details-poster"
      >
      <p><strong>Full Title:</strong> ${movie.title || "Unavailable"}</p>
      <p><strong>Release Date:</strong> ${movie.release_date || "Unavailable"}</p>
      <p><strong>Arkansas Connection:</strong> ${ark_connect}
      <p><strong>Genre:</strong> ${genres || "Unavailable"}</p>
      <p><strong>Original Language:</strong> ${movie.original_language || "Unavailable"}</p>
      <p><strong>Budget:</strong> ${movie.budget || "Unavailable"}</p>
      <p><strong>Cast:</strong> ${cast || "Unavailable"}</p>
      <p><strong>Awards:</strong> ${awards}</p>
      <p><strong>Overview:</strong> ${movie.overview || "Unavailable"}</p>
    `;
  } 

  // Returns error message if no film are results found
  catch (error) {
    console.error("Error loading film details:", error);
    detailsContainer.innerHTML = `
      <p>Sorry, there was a problem loading the film details.</p>
    `;
  }
}