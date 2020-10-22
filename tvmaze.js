// return array of matching query string
async function searchShows(query) {
  // get request
  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  let showArr = [];

  // ensure array includes an image –– if not default to placeholder img
  for (let showItem of res.data) {
    let showImage;

    if (!showItem.show.image) {
      showImage = 'https://tinyurl.com/tv-missing';
    } else {
      showImage = `${showItem.show.image.medium}`;
    }

    // objects from the array
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

// render show elements to DOM
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
            <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

// handle search form submission
$('#search-form').on('submit', async function handleSearch(e) {
  e.preventDefault();

  // object from query value
  let query = $('#search-query').val();
  if (!query) return;

  // hide episodes-area
  $('#episodes-area').hide();

  let shows = await searchShows(query);

  // call to render show elements
  populateShows(shows);
});

// return a list of episodes
async function getEpisodes(id) {
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = res.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
  return episodes;
}

// render episode elements to DOM
function populateEpisodes(episodes) {
  let $episodesList = $('#episodes-list');
  $episodesList.empty();

  // append episodes list for every name/season/episode
  for (let episode of episodes) {
    let $item = $(
      `
      <li>
        <strong>${episode.name}</strong> 
        (S${episode.season} | E${episode.number})
      </li>
      `
    );
    $episodesList.append($item);
  }
  // remove only style attribute, display
  $('#episodes-area').removeAttr('style');
}

// handle click event on episodes button
$('#shows-list').on('click', '.get-episodes', async function handleEpisodeClick(
  e
) {
  // find the nearest parent episode id
  let showId = $(e.target).closest('.Show').data('show-id');
  // promise if episode id is found, call to populate episodes
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});
