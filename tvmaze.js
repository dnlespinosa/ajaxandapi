/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
  // console.log(res);
  let arr = [];
  for (let show of res.data) {
    let obj={};
    obj.id = show.show.id;
    obj.name = show.show.name;
    obj.summary = show.show.summary;
    if(show.show.image!=null){
    obj.image = show.show.image.medium;
    } else {
      obj.image = 'https://tinyurl.com/tv-missing';
    }
    arr.push(obj);
  }
  return arr;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id='episode-button'>GET EPISODES</button>
           </div>
         </div>

       </div>
       
      `);

    $showsList.append($item);
    
    }
    let btn = document.querySelectorAll('episode-button');
    btn.forEach(
      addEventListener('click', function(event){
        event.preventDefault();
        let btn = event.target
        let id = btn.parentElement.parentElement.dataset.showId;
        populateEpsiodes(getEpisodes(id))
      }))
  };



/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

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
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  // console.log(res.data);
  let arr = [];
  for (let episode of res.data){
    let obj = {};
    obj.id = episode.id;
    obj.name = episode.name;
    obj.season = episode.season;
    obj.number = episode.number
    arr.push(obj);
  }
  // TODO: return array-of-episode-info, as described in docstring above
  return arr;
}

function populateEpsiodes(arr){
  let epiList = document.getElementById('episodes-list');
  document.getElementById('episodes-area').style.display = 'inline';
  Promise.resolve(arr).then(function(arrVal){
    for (let episode of arrVal){
      let li = document.createElement('li');
      li.innerText = `${episode.name} (season: ${episode.season}, episode:${episode.number})`;
      li.id = 'list-item';
      epiList.append(li);
    }
})
};




