import axios from "axios";
import * as $ from "jquery";

const BASE_URL = "http://api.tvmaze.com";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesBtn = $(".Show-getEpisodes");
const $episodesList = $("#episodesList");

interface ShowInterface {
  id: number;
  name: string;
  summary: string;
  image: {
    medium: string;
    original: string;
  } | null;
}

interface EpisodeInterface {
  id: number;
  name: string;
  season: number;
  number: number;
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<Array<ShowInterface>> {
  const response = await axios.get(`${BASE_URL}/search/shows`, {
    params: { q: term },
  });

  const shows = response.data.map((result: { show: ShowInterface }) => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image,
    };
  });
  return shows;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: Array<ShowInterface>): void {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image?.medium || "https://tinyurl.com/tv-missing"}
              alt=${show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): Promise<void> {
  const term = $("#searchForm-term").val() as string;
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on(
  "submit",
  async function (evt: JQuery.SubmitEvent): Promise<void> {
    evt.preventDefault();
    await searchForShowAndDisplay();
  }
);

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id: number): Promise<EpisodeInterface[]> {
  const response = await axios.get(`${BASE_URL}/shows/${id}/episodes`);

  const episodes = response.data.map((result: EpisodeInterface) => ({
    id: result.id,
    name: result.name,
    season: result.season,
    number: result.number,
  }));

  return episodes;
}

/** Given an array of episode objects, populate the episode lists with episode
 * information.
 *
 * Make sure to show episode area and empty episode list beforehand.
 */

function populateEpisodes(episodes: EpisodeInterface[]): void {
  $episodesArea.show();
  $episodesList.empty();

  for (let episode of episodes) {
    const $episode = $(
      `<li>
      ${episode.name} (season ${episode.season}, number ${episode.number})
      </li>
      `
    );
    $episodesList.append($episode);
  }
}

/** Fetches episodes based on the show ID associated with the button clicked.
 * Then populates the episodes list with episodes of said show.
 */
async function getEpisodeAndPopulate(evt: JQuery.ClickEvent): Promise<void> {
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on(
  "click",
  $episodesBtn,
  async function (evt: JQuery.ClickEvent): Promise<void> {
    getEpisodeAndPopulate(evt);
  }
);
