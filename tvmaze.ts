import axios from "axios";
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesBtn = $(".Show-getEpisodes")


interface MovieInterface {
  show:{ id: number;
    name: string;
    summary: string,
    image: {medium: string, original: string}
  }
}

interface EpisodeInterface {
  id: number,
  name: string,
  season: number,
  number: number
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term:string | number | string[] | undefined):Promise<Array<MovieInterface>> {
  const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`)
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  console.log(response)
  return response.data
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows:Array<MovieInterface>): void {
  $showsList.empty();
console.log(shows)
  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.show.image.medium}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}



$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$episodesBtn.on("click", async function (evt){
  evt.preventDefault()
  const showId = $(evt.target).closest(".Show").data("show-id")
  const episodes = await getEpisodesOfShow(showId)
  populateEpisodes(episodes)
})




/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id:number):Promise<Array<EpisodeInterface>> {
  const episodes = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`)
 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { }