let songsListInstance

function getCurrentSongIndex(){
    return songsListInstance.userData?.songs.indexOf(songsListInstance.userData?.current_song)
}

function playNextSong(){
    if(songsListInstance.userData?.current_song===null){
        playSong(songsListInstance.userData?.songs[0].id)
    }
    else{
        const current_song_index = getCurrentSongIndex()
        const next_song = songsListInstance.userData?.songs[current_song_index+1]
        playSong(next_song.id)
    }
}

function playPreviousSong(){
    if(songsListInstance.userData?.current_song===null){
        return
    }
    else{
        const current_song_index = getCurrentSongIndex()
        const previous_song = songsListInstance.userData?.songs[current_song_index-1]
        playSong(previous_song.id)
    }
}

function setPlayerDisplay(){
  const song_title=document.getElementById("player-song-title")
  const song_artist=document.getElementById("player-song-artist")
  const current_title=songsListInstance.userData?.current_song?.title
  const current_artist=songsListInstance.userData?.current_song?.artist  
  song_title.textContent=current_title?current_title:""
  song_artist.textContent=current_artist?current_artist:""
}

function highlightCurrentSong(){
    const playlist_song_elements=document.querySelectorAll(".playlist-song")
    const songto_highlight=document.getElementById(`song-${songsListInstance.userData?.current_song?.id}`)

    playlist_song_elements.forEach((songEl)=>{
        songEl.removeAttribute("aria-current")
    })

    if(songto_highlight){
        songto_highlight.setAttribute("aria-current","true")
    }
}

function setPlayButtonAccessibleText(){
    const song = songsListInstance.userData?.currentSong || songsListInstance.userData?.songs[0];
    songsListInstance.buttonPlay.setAttribute("aria-label", song?.title ?`Play ${song.title}`:"Play")
    
  }

function shuffle(){
    // returns negative and positive random sorted numbers
    songsListInstance.userData?.songs.sort(()=>Math.random()-0.5)
    songsListInstance.userData.current_song=null
    songsListInstance.userData.song_current_time=0
    renderSongs(songsListInstance.userData?.songs)
    pauseSong()
    setPlayerDisplay()
    setPlayButtonAccessibleText()
}

function deleteSong(id){
    if(songsListInstance.userData?.current_song?.id===id){
        songsListInstance.userData.current_song=null
        songsListInstance.userData.song_current_time=0
        pauseSong()
        setPlayerDisplay()
    }
        // exclude a song or delete a song if song.id===id
        songsListInstance.userData.songs = songsListInstance.userData?.songs.filter((song)=>song.id!==id)
        songsListInstance.customSongs = songsListInstance.customSongs?.filter((song)=>song.id!==id)
        // songsListInstance.customSongs = songsListInstance.customSongs?.filter((song)=>song.id!==id)
        renderSongs(songsListInstance.userData?.songs)
        highlightCurrentSong()
        setPlayButtonAccessibleText()
}

function playSong(id){
  songsListInstance.buttonPlay.classList.remove('button-active');
  songsListInstance.buttonPause.classList.add('button-active');
  const song = songsListInstance.userData?.songs.find((song) => song.id === id);

  if (song) {
      songsListInstance.audio.src = song?.src;
      songsListInstance.audio.title = song?.title;

      // Wait for the songsListInstance.audio to be fully loaded before playing
      songsListInstance.audio.addEventListener('canplaythrough', () => {
          if (songsListInstance.userData?.current_song === null || songsListInstance.userData?.current_song?.id !== song.id) {
              songsListInstance.audio.currentTime = 0;
          } else {
              songsListInstance.audio.currentTime = songsListInstance.userData?.song_current_time;
          }
          songsListInstance.userData.current_song = song;
          songsListInstance.buttonPlay.classList.add("playing");
          songsListInstance.audio.play().catch(error => {
              console.error('Error playing audio:', error);
          });
          highlightCurrentSong();
          setPlayerDisplay();
      }, { once: true });

      // Remove the previous 'canplaythrough' event listener
      songsListInstance.audio.load();
  } else {
      return;
  }
};

function pauseSong(){
    songsListInstance.userData.song_current_time=songsListInstance.audio.currentTime
    songsListInstance.buttonPause.classList.remove('button-active')
    songsListInstance.buttonPlay.classList.add('button-active')
   
    songsListInstance.buttonPlay.classList.remove("playing")
    songsListInstance.audio.pause()

}

function renderSongs(array){
    const songsHTML = array.map((song)=>{
        return `<li id="song-${song.id}" class="playlist-song">
        <button onclick="playSong(${song.id})" class="playlist-song-info">
          <span class="playlist-song-title">${song.title}</span><span class="playlist-song-artist">${song.artist}</span><span class="playlist-song-duration">${song.duration}</span>
        </button>
        <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg></button>
        </li>
        `
    }).join("")

    songsListInstance.playlistSongs.innerHTML=songsHTML

}

function sortSongs(){
    songsListInstance.userData?.songs.sort((a,b)=>{
        if(a.title<b.title){
            return -1
        }
        if(a.title>b.title){
            return 1
        }
        if(a.title===b.title){
            return 0
        }
    })
    return songsListInstance.userData?.songs
}

function addAllSongs(){
    songsListInstance.userData.songs = songsListInstance.allSongs;
    //songsListInstance.customSongs = songsListInstance.allSongs
    renderSongs(sortSongs());
}

function registerEventListeners(){
  songsListInstance.buttonShuffle.addEventListener("click",shuffle)
  songsListInstance.buttonPause.addEventListener("click", pauseSong)
  songsListInstance.buttonNext.addEventListener("click", playNextSong)
  songsListInstance.buttonPrevious.addEventListener("click", playPreviousSong)

  // event listeners
  songsListInstance.buttonPlay.addEventListener("click",(event)=>{
    
    if(!songsListInstance.userData?.current_song){
        playSong(songsListInstance.userData?.songs[0]?.id)
    }
    else{
        playSong(songsListInstance.userData?.current_song?.id)
    }
  })

//songsListInstance.userData.songs=songsListInstance.allSongs
songsListInstance.allSongs.forEach((song) => {
  if(songsListInstance.selectSongList){
    songsListInstance.selectSongList.innerHTML += `<option class="option-song" id="${song.id}">${song.title}</option>`;
  }
});
addAllSongs()

let customSongs = []
let songSelectedId=parseInt(0)
let songToBeAdded={}

// Add onchange event listener
songsListInstance.selectSongList.addEventListener("change", function() {
    // Get the selected option
    const selectedOption = this.options[this.selectedIndex];
    
    // Get the value and text of the selected option
    const selectedValue = selectedOption.value;
    const selectedText = selectedOption.text;
    const selectedId = selectedOption.id
    
    // You can perform further actions here based on the selected option
    songSelectedId = parseInt(selectedId)
  });

  buttonAddSong = document.querySelector('#button-addsong')
  buttonAddSong.addEventListener("click", (event) => {
    event.preventDefault();

    const option_songs = Array.from(document.getElementsByClassName("option-song"))
    option_songs.sort((a, b) => a.innerHTML.localeCompare(b.innerHTML))
    custom_songs=[...songsListInstance.userData?.songs]
    songsListInstance.allSongs.filter((song) => {
        for (let i = 0; i < option_songs.length; i++) {
            if (parseInt(song.id) === parseInt(songSelectedId)) {
                song_to_be_added = {
                    id: song?.id,
                    title: song?.title,
                    artist: song?.artist,
                    duration: song?.duration,
                    src: song?.src
                };
                custom_songs.push(song_to_be_added);
                return true;
            }
        }
        return false;
    });

    let match=false
    songsListInstance?.userData?.songs.map((song)=>{
      if(song.id ===songSelectedId){
        match=true
        return

      }
      else{
        match=false
        return
      }
    })

    if (!match) {
  // Create a Set to keep track of unique song IDs
  const unique_songids = new Set();
  
  // Filter out duplicate songs based on the song ID
  const unique_songs = custom_songs?.filter((song) => {
    // Check if the song ID is already in the Set
    if (unique_songids.has(song.id)) {
      return false; // Duplicate, filter it out
    } else {
      // Add the song ID to the Set and return true to keep the song
      unique_songids.add(song.id);
      return true;
    }
  });

  // Update user_data.songs with unique songs and render them
  songsListInstance.userData.songs = unique_songs;
  renderSongs(songsListInstance.userData.songs);
}
  // endif allsongsadded
    
});  


songsListInstance.buttonAddAllSongs.addEventListener("click", (event)=>{
    event.preventDefault()
    addAllSongs()
})

songsListInstance.buttonRemoveAllSongs.addEventListener("click", (event)=>{
    event.preventDefault()
    const comfirmRemoval=window.confirm("remove all songs from the playlist?")
    if(comfirmRemoval){
      songsListInstance.userData.currentSong=null
      songsListInstance.userData.songCurrentTime=0  
      songsListInstance.userData.songs = []
      pauseSong()
      setPlayerDisplay()
      renderSongs(songsListInstance.userData?.songs)
      highlightCurrentSong()
      setPlayButtonAccessibleText()
      
    }
    else{
      return
    }
})

// event listener for the songsListInstance.audio element
songsListInstance.audio.addEventListener("ended",()=>{
  const currentSongIndex=getCurrentSongIndex()
  const nextSongExists=currentSongIndex<songsListInstance.userData?.songs.length-1
  if(nextSongExists){
      playNextSong()
  }
  else{
      songsListInstance.userData.currentSong=null
      songsListInstance.userData.songCurrentTime=0
      pauseSong()
      setPlayerDisplay()
      highlightCurrentSong()
      setPlayButtonAccessibleText()
  }
})

// end registerEventListeners()
}

window.addEventListener('load',()=>{
  songsListInstance = new SongsListGlobals(allSongs)
  registerEventListeners()
})