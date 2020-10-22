async function searchShows(query) {
  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  let showArr = [];

  for (let showItem of res.data) {
    let showImage;

    if (!showItem.show.image) {
      showImage = 'https://tinyurl.com/tv-missing';
    } else {
      showImage = `${showItem.show.image.medium}`;
    }

    let showObj = {
      id: `${showItem.show.id}`,
      name: `${showItem.show.name}`,
      summary: `${showItem.show.summary}`,
      image: showImage,
    };
    showArr.push(showObj);
  }
  return showArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $('#shows-list');
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `
      <div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top img-fluid" src=${show.image}>
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
            <button data-show-id="${show.id}" id="${show.id}" class="btn btn-primary my-2">Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

function removeLink() {
  $('#a-link').remove();
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
  evt.preventDefault();

  let query = $('#search-query').val();
  if (!query) return;

  $('#episodes-area').hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let ep = res.data.map((eps) => ({
    id: ep.id,
    name: ep.name,
    season: ep.season,
    number: ep.number,
  }));
}
