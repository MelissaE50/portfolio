/* 
actors-actresses.js

Purpose: Loads actor or actress details from TMDB based on the ID passed in the URL. Displays personal information, Arkansas connection,
awards and fimlography links via resuable actors-actressesDetails page.

Data Sources: TMDB API for actor/actress details and movie info. Local objects for awards and Arkansas connection data.
*/

// The Movie Database configuration
const API_KEY = "2dd0ec4f3c6b8d011e91690d1cd8fa86";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Local reference data for awards info using TMDB IDs 
const ACTOR_AWARDS = {
  2453: [
    "Academy Award winner for Best Supporting Actress (Melvin and Howard)",
    "Golden Globe winner for Best Actress in a Supporting Role (Melvin and Howard)"
  ],
  879: [
    "Academy Award Winner for Best Writing, Screenplay Based on Material Previously Produced or Published (Sling Blade)",
    "Golden Globe winner for Best Performance by an Actor in a Television Series - Drama (Goliath)",
    "Golden Globe winner for Best Performance by an Actor in a Miniseries or Motion Picture Made for Television (Fargo)",
    "Critics Choice Awared winner for Best Supporting Actor (Primary Colors)"
  ],
  14838: [
    "American Movie Award winner for Best Screenplay (The China Syndrome)"
  ],
   27539: [
    "Academy Award Winner for Best Short Film, Live Action (The Accountant)",
    "Stockholm Film Festival winner for Best Actress (Chrystal)"
  ]
};

// Local reference data indicating actor/actress' connection to Arkansas 
const ARKANSAS_CONNECTION = {
  2453: [
    "Born in Arkansas"
  ],
 879: [
    "Born in Arkansas"
  ],
  14838: [
    "Born in Arkansas"
  ],
  4778: [
    "Born in Arkansas"
  ],
  41249: [
    "Born in Arkansas"
  ],
  16484: [
    "Born in Arkansas"
  ],
  27539: [
    "Born in Arkansas"
  ],
  8210: [
    "Born in Arkansas"
  ]
};

document.addEventListener("DOMContentLoaded", loadActorDetails);

// Read the actor/actress ID from the page URL
async function loadActorDetails() {
  const params = new URLSearchParams(window.location.search);
  const actorId = params.get("id");
  const detailsContainer = document.getElementById("actors-actressesDetails");

  if (!actorId) {
    if (detailsContainer) {
      detailsContainer.innerHTML = "<p>No actor/actress ID was provided.</p>";
    }
    return;
  }

  try {
    const actorResponse = await fetch(
      `${BASE_URL}/person/${actorId}?api_key=${API_KEY}`
    );

    if (!actorResponse.ok) {
      throw new Error(`Could not fetch actor/actress details. Status: ${actorResponse.status}`);
    }

    const actor = await actorResponse.json();

    const creditsResponse = await fetch(
      `${BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}`
    );

    if (!creditsResponse.ok) {
      throw new Error(`Could not fetch actor/actress credits. Status: ${creditsResponse.status}`);
    }

    const credits = await creditsResponse.json();

    const profileUrl = actor.profile_path
      ? `${IMAGE_BASE_URL}${actor.profile_path}`
      : "No image available";

    const awards = ACTOR_AWARDS[actorId]
      ? ACTOR_AWARDS[actorId].join(", ")
      : "Not applicable";

    const ark_connect = ARKANSAS_CONNECTION [actorId]
      ? ARKANSAS_CONNECTION[actorId].join(", ")
      : "Not applicable";

    // create list of clickable links for first 10 fiilms that redirects to filmsDetails page (.map loops through an array and creates a new array)
      const filmographyLinks = credits.cast && credits.cast.length > 0
      ? credits.cast
          .slice(0, 10)
          .map(movie => {
            const year = movie.release_date ? ` (${movie.release_date.substring(0, 4)})` : "";
            return `<li><a href="filmsDetails.html?id=${movie.id}" 
                    class="details-link">${movie.title}${year}</a></li>`;}).join("")
      : "<li>Unavailable</li>";

    // Displays actor/actress data pulled through API in details container
    detailsContainer.innerHTML = `
      <h2>${actor.name || "Name not available"}</h2>
      <img
        src="${profileUrl}"
        alt="Photo of ${actor.name || "actor/actress"}"
        class="details-poster">
      <p><strong>Name:</strong> ${actor.name || "Unavailable"}</p>
      <p><strong>Birthday:</strong> ${actor.birthday || "Unavailable"}</p>
      <p><strong>Date of Death:</strong> ${actor.deathday || "Not Applicable"}</p>
      <p><strong>Place of Birth:</strong> ${actor.place_of_birth || "Unavailable"}</p>
      <p><strong>Arkansas Connection:</strong> ${ark_connect}
      <p><strong>Biography:</strong> ${actor.biography || "Unavailable"}</p>
      <p><strong>Awards:</strong> ${awards}</p>

      <div class="filmography-block">
        <p><strong>Filmography:</strong></p>
        <ul class="filmography-list">
          ${filmographyLinks}
        </ul>
      </div>
    `;
  } catch (error) {
    console.error("Error loading actor/actress details:", error);
    if (detailsContainer) {
      detailsContainer.innerHTML = `<p>Sorry, there was a problem loading the actor/actress details.</p>`;
    }
  }
}
