window.onload = function test() {
    refreshToken();
};

var user_id;
var spotify_uris = [];
var share_playlist_id;

var refreshToken = async () => {
    const response = await fetch("/token-api");
    try {
        const data = await response.json();
        apiToken = data.access_token;
        getUserData(apiToken);
        getTopArtists(apiToken);
        getTopTracks(apiToken);
    } catch (e) {
        console.log(e);
        window.location.replace("/login");
    }
};

const getUserData = async (apiToken) => {
  const result = await fetch(`https://api.spotify.com/v1/me`, {
    method: "GET",
    headers: { Authorization: "Bearer " + apiToken },
  });
  const data = await result.json();
  if (data.error != undefined) {
    window.location.replace("/login");
  }
  user_id = data.id;
};

const getTopArtists = async (apiToken) => {
    const result = await fetch(
        'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=5&offset=0',
        {
            method: "GET",
            headers: {Authorization: "Bearer " + apiToken},
        }
    );
    //const data = await result.text();
    const data = await result.json();
    if (data.error != undefined) {
        window.location.replace("/login");
    }

    if (data.error != undefined) {
        console.log("Something went wrong getting data from Spotify API :(");
        window.localtion.replace("/login");
    }

    displayTopArtistData(data);
}

const getTopTracks = async (apiToken) => {
    const result = await fetch(
        'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=5&offset=0',
        {
            method: "GET",
            headers: {Authorization: "Bearer " + apiToken},
        }
    )

    const data = await result.json();
    if (data.error != undefined) {
        window.location.replace("/login");
    }

    if (data.error != undefined) {
        console.log("Something went wrong getting data from Spotify API :(");
        window.location.replace("/login");
    }

    for (let i = 0; i < data.items.length; i++) {
      spotify_uris.push("spotify:track:" + data.items[i].id);
    }

    displayTopTrackData(data);
}

const createPlaylist = async () => {
    var playlistName = document.getElementById("playlist-name").value;
    if(playlistName == "") {
      document.getElementById("playlist-status-msg").innerHTML = "***Enter a name!***";
      return;
    }
    else {
      document.getElementById("playlist-status-msg").innerHTML = "Playlist created!";
    }
  
    const result = await fetch(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        method: "POST",
        headers: { Authorization: "Bearer " + apiToken },
        body: JSON.stringify({
          name: playlistName,
          description: "Personalized Year in Review playlist generated via Persongify",
          public: true,
        }),
      }
    );

  const data = await result.json();
  share_playlist_id = data.id;
  addTracksToPlaylist(share_playlist_id);
}

function displayTopArtistData(data) {
  // replace html elements with artist name
  document.getElementsByClassName("top-artist-1")[0].innerHTML = data.items[0].name;
  document.getElementsByClassName("top-artist-1")[1].innerHTML = "1. " + data.items[0].name;
  document.getElementsByClassName("top-artist-2")[0].innerHTML = "2. " + data.items[1].name;
  document.getElementsByClassName("top-artist-3")[0].innerHTML = "3. " + data.items[2].name;
  document.getElementsByClassName("top-artist-4")[0].innerHTML = "4. " + data.items[3].name;
  document.getElementsByClassName("top-artist-5")[0].innerHTML = "5. " + data.items[4].name;

  // var stringURL = "url(" + data.items[0].images[1].url + ")";
  // console.log(stringURL);
  // document.getElementsByClassName("artist-img").style.backgroundImage = stringURL;

  console.log(data.items[0].images[1].url);
  //document.getElementsByClassName("artist-img")[0].style.backgroundImage = `url(${data.items[0].images[1].url})`;
}

function displayTopTrackData(data) {
    // replace html elements with parsed data from the json object
    document.getElementsByClassName("top-tracks-1")[0].innerHTML = data.items[0].name;
    document.getElementsByClassName("top-track-artist")[0].innerHTML = data.items[0].artists[0].name;
    document.getElementsByClassName("top-tracks-1")[1].innerHTML = "1. " + data.items[0].name;
    document.getElementsByClassName("top-tracks-2")[0].innerHTML = "2. " + data.items[1].name;
    document.getElementsByClassName("top-tracks-3")[0].innerHTML = "3. " + data.items[2].name;
    document.getElementsByClassName("top-tracks-4")[0].innerHTML = "4. " + data.items[3].name;
    document.getElementsByClassName("top-tracks-5")[0].innerHTML = "5. " + data.items[4].name;
}

const addTracksToPlaylist = async (playlist_id) => {
    if (spotify_uris.length == 0) {
      return;
    }
  
    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks `,
      {
        method: "POST",
        headers: { Authorization: "Bearer " + apiToken },
        body: JSON.stringify({
          uris: spotify_uris,
        }),
      }
    );

    if (result != null) {
      document.getElementById("playlist-status-msg").innerHTML = "Playlist added!";

      /** Change save playlist button into share playlist button */
      document.getElementById("p-button").innerHTML = "Share Playlist";
      document.getElementById("p-button").setAttribute("class", "btn btn-primary");
      document.getElementById("p-button").setAttribute("onclick", "checkLoginState()");
    } else {
      document.getElementById("playlist-status-msg").innerHTML = "Unsuccessful. Please try again.";
    }
};


/** Asynchronously loads Facebook SDK */
window.fbAsyncInit = function() {
    FB.init({
        appId      : '1169143580322957',
        cookie     : true,
        xfbml      : true,
        version    : 'v14.0'
    });
};

function testAPI() {   
    // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');

    FB.ui({
      method: 'share',
      href: `https://open.spotify.com/playlist/${share_playlist_id}`,
    }, function(response){});

    // FB.api('/me', function(response) {
    //     console.log('Successful login for: ' + response.name);
    //     console.log("data: " + JSON.stringify(response));
    //     document.getElementById('playlist-status-msg').innerHTML = 'Thanks for logging in, ' + response.name + '!';
    // });
}

function checkLoginState() {               // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // See the onlogin handler
      statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      testAPI();  
    } else {                                 // Not logged into your webpage or we are unable to tell.
      FB.login();
      console.log("couldn't login to facbeook ;("); 
    }
}

// front end stuff
const carousel = document.querySelector(".carousel");
const slides = document.querySelectorAll(".slide");
const numberOfSlides = slides.length;
var slideNumber = 0;

// automatically shuffle through the slides
var currentInterval;

var loopThrough = () => {
  currentInterval = setInterval(function() {
    // remove active class from all slides and icons
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });
    // increase the slideNumber by 1
    slideNumber++;
    // ensure slides loop around
    if (slideNumber > (numberOfSlides -1)) {
        slideNumber = 0;
    }
    // add active class to a slide/icon to display/highlight them
    slides[slideNumber].classList.add("active");
  }, 5000);   // switch slides every 5 seconds
}

loopThrough();

// stop the image carousel autoplay when mousing over the slides
carousel.addEventListener("mouseover", () => {
  clearInterval(currentInterval);
});

// restart the image carousel autoplay after mouseout
carousel.addEventListener("mouseout", () => {
  loopThrough();
});