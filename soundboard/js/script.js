const button_play = document.getElementById("play")
const button_pause = document.getElementById("pause")
const playlist_songs = document.getElementById("playlist-songs")
const button_next = document.getElementById("next")
const button_previous = document.getElementById("previous")
const button_shuffle = document.getElementById("shuffle")


const audio = new Audio()

let user_data={
    songs: [...all_user_data_songs], current_song:null, song_current_time:0, 
}

const getCurrentSongIndex=()=>{
    return user_data?.songs.indexOf(user_data?.current_song)
}

const playNextSong=()=>{
    if(user_data?.current_song===null){
        playSong(user_data?.songs[0].id)
    }
    else{
        const current_song_index = getCurrentSongIndex()
        const next_song = user_data?.songs[current_song_index+1]
        playSong(next_song.id)
    }
}

const playPreviousSong=()=>{
    if(user_data?.current_song===null){
        return
    }
    else{
        const current_song_index = getCurrentSongIndex()
        const previous_song = user_data?.songs[current_song_index-1]
        playSong(previous_song.id)
    }
}

const setPlayerDisplay=()=>{
  const song_title=document.getElementById("player-song-title")
  const song_artist=document.getElementById("player-song-artist")
  const current_title=user_data?.current_song?.title
  const current_artist=user_data?.current_song?.artist  
  song_title.textContent=current_title?current_title:""
  song_artist.textContent=current_artist?current_artist:""
}

const highlightCurrentSong=()=>{
    const playlist_song_elements=document.querySelectorAll(".playlist-song")
    const songto_highlight=document.getElementById(`song-${user_data?.current_song?.id}`)

    playlist_song_elements.forEach((songEl)=>{
        songEl.removeAttribute("aria-current")
    })

    if(songto_highlight){
        songto_highlight.setAttribute("aria-current","true")
    }
}

const setPlayButtonAccessibleText = () => {
    const song = user_data?.currentSong || user_data?.songs[0];
    button_play.setAttribute("aria-label", song?.title ?`Play ${song.title}`:"Play")
    
  }

const shuffle=()=>{
    // returns negative and positive random sorted numbers
    user_data?.songs.sort(()=>Math.random()-0.5)
    user_data.current_song=null
    user_data.song_current_time=0
    renderSongs(user_data?.songs)
    pauseSong()
    setPlayerDisplay()
    setPlayButtonAccessibleText()
}

const deleteSong=(id)=>{
    if(user_data?.current_song?.id===id){
        user_data.current_song=null
        user_data.song_current_time=0
        pauseSong()
        setPlayerDisplay()
    }
        // exclude a song or delete a song if song.id===id
        user_data.songs = user_data?.songs.filter((song)=>song.id!==id)
        custom_songs = custom_songs?.filter((song)=>song.id!==id)
        // custom_songs = custom_songs?.filter((song)=>song.id!==id)
        renderSongs(user_data?.songs)
        highlightCurrentSong()
        setPlayButtonAccessibleText()
}

button_shuffle.addEventListener("click",shuffle)

const playSong=(id)=>{

    const song = user_data?.songs.find((song)=>song.id===id)
    if(song){
      audio.src = song?.src
      audio.title = song?.title
    
        if(user_data?.current_song===null || user_data?.current_song?.id!==song.id){
          audio.currentTime=0
        }
        else{
            audio.currentTime=user_data?.song_current_time
        }
        // no need to verify that current_song exists - user_data?.current_song=song
        user_data.current_song=song
        button_play.classList.add("playing")
        audio.play()
        highlightCurrentSong()
        setPlayerDisplay()
    }
    else{
        return
    }
        
   
}

const pauseSong=()=>{
   user_data.song_current_time=audio.currentTime
    button_play.classList.remove("playing")
    audio.pause()

}

// event listeners
button_play.addEventListener("click",(event)=>{
    if(!user_data?.current_song){
        playSong(user_data?.songs[0]?.id)
    }
    else{
        playSong(user_data?.current_song?.id)
    }
})

button_pause.addEventListener("click", pauseSong)
button_next.addEventListener("click", playNextSong)
button_previous.addEventListener("click", playPreviousSong)

// event listener for the audio element
audio.addEventListener("ended",()=>{
    const current_song_index=getCurrentSongIndex()
    const next_song_exists=current_song_index<user_data?.songs.length-1
    if(next_song_exists){
        playNextSong()
    }
    else{
        user_data.current_song=null
        user_data.song_current_time=0
        pauseSong()
        setPlayerDisplay()
        highlightCurrentSong()
        setPlayButtonAccessibleText()
    }
})

const renderSongs=(array)=>{
    const songsHTML = array.map((song)=>{
        return `<li id="song-${song.id}" class="playlist-song">
        <button onclick="playSong(${song.id})" class="playlist-song-info">
          <span class="playlist-song-title">${song.title}</span><span class="playlist-song-artist">${song.artist}</span><span class="playlist-song-duration">${song.duration}</span>
        </button>
        <button onclick="deleteSong(${song.id})"  class="playlist-song-delete" aria-label="Delete ${song.title}"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg></button>
        </li>
        `
    }).join("")

    playlist_songs.innerHTML=songsHTML

}

const sortSongs=()=>{
    user_data?.songs.sort((a,b)=>{
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
    return user_data?.songs
}

const select_songlist = document.getElementById("select-songlist")
const button_addsong = document.getElementById("button-addsong")
const button_addallsongs = document.getElementById("button-addallsongs")
const button_removeallsongs = document.getElementById("button-removeallsongs")

let custom_songs = []
let song_selected_id=parseInt(0)
let song_to_be_added={}

// Add onchange event listener
select_songlist.addEventListener("change", function() {
    // Get the selected option
    const selected_option = this.options[this.selectedIndex];
    
    // Get the value and text of the selected option
    const selected_value = selected_option.value;
    const selected_text = selected_option.text;
    const selected_id = selected_option.id
    
    // You can perform further actions here based on the selected option
    song_selected_id = parseInt(selected_id)
  });

button_addsong.addEventListener("click", (event) => {
    event.preventDefault();

    const option_songs = Array.from(document.getElementsByClassName("option-song"))
    option_songs.sort((a, b) => a.innerHTML.localeCompare(b.innerHTML))
    custom_songs=[...user_data?.songs]
    all_songs.filter((song) => {
        for (let i = 0; i < option_songs.length; i++) {
            if (parseInt(song.id) === parseInt(song_selected_id)) {
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
    user_data?.songs.map((song)=>{
      if(song.id ===song_selected_id){
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
  user_data.songs = unique_songs;
  renderSongs(user_data?.songs);
}
  // endif allsongsadded
    
});

button_addallsongs.addEventListener("click", (event)=>{
    event.preventDefault()
    user_data.songs = all_songs;
    //custom_songs = all_songs
    renderSongs(sortSongs());
})

button_removeallsongs.addEventListener("click", (event)=>{
    event.preventDefault()
    const comfirm_removal=window.confirm("remove all songs from the playlist?")
    if(comfirm_removal){
      user_data.current_song=null
      user_data.song_current_time=0  
      user_data.songs = []
      pauseSong()
      setPlayerDisplay()
      renderSongs(user_data?.songs)
      highlightCurrentSong()
      setPlayButtonAccessibleText()
      
    }
    else{
      return
    }
})

window.onload = () => {
    //user_data.songs=all_songs
    all_songs.forEach((song) => {
        select_songlist.innerHTML += `<option class="option-song" id="${song.id}">${song.title}</option>`;
    });
};