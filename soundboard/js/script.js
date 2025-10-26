let songsListInstance;

function getCurrentSongIndex() {
  return songsListInstance.userData?.songs.indexOf(songsListInstance.userData?.currentSong);
}

function playNextSong() {
  if (!songsListInstance.userData?.currentSong) {
    playSong(songsListInstance.userData?.songs[0]?.id);
  } else {
    const i = getCurrentSongIndex();
    const next = songsListInstance.userData?.songs[i + 1];
    if (next) playSong(next.id);
  }
}

function playPreviousSong() {
  const i = getCurrentSongIndex();
  const prev = songsListInstance.userData?.songs[i - 1];
  if (prev) playSong(prev.id);
}

function setPlayerDisplay() {
  const title = document.getElementById("player-song-title");
  const artist = document.getElementById("player-song-artist");
  const s = songsListInstance.userData?.currentSong;
  title.textContent = s?.title || "";
  artist.textContent = s?.artist || "";
}

function highlightCurrentSong() {
  document.querySelectorAll(".playlist-song").forEach(el => el.removeAttribute("aria-current"));
  const el = document.getElementById(`song-${songsListInstance.userData?.currentSong?.id}`);
  if (el) el.setAttribute("aria-current", "true");
}

function setPlayButtonAccessibleText() {
  const s = songsListInstance.userData?.currentSong || songsListInstance.userData?.songs[0];
  songsListInstance.buttonPlay.setAttribute("aria-label", s?.title ? `Play ${s.title}` : "Play");
}

// ✅ Save playlist persistently
function savePlaylistToLocalStorage() {
  try {
    const songs = songsListInstance.userData?.songs || [];
    localStorage.setItem("customPlaylist", JSON.stringify(songs));
    console.log("✅ Playlist saved:", songs.length, "songs");
  } catch (err) {
    console.error("localStorage save error:", err);
  }
}

function shuffle() {
  songsListInstance.userData.songs.sort(() => Math.random() - 0.5);
  songsListInstance.userData.currentSong = null;
  songsListInstance.userData.song_current_time = 0;
  renderSongs(songsListInstance.userData.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  savePlaylistToLocalStorage();
}

function deleteSong(id) {
  songsListInstance.userData.songs = songsListInstance.userData.songs.filter(s => s.id !== id);
  if (songsListInstance.userData.currentSong?.id === id) {
    songsListInstance.userData.currentSong = null;
    songsListInstance.userData.song_current_time = 0;
    pauseSong();
    setPlayerDisplay();
  }
  renderSongs(songsListInstance.userData.songs);
  highlightCurrentSong();
  setPlayButtonAccessibleText();
  savePlaylistToLocalStorage();
}

function playSong(id) {
  const s = songsListInstance.userData?.songs.find(x => x.id === id);
  if (!s) return;

  songsListInstance.audio.src = s.src;
  songsListInstance.audio.title = s.title;

  // set current song before play
  songsListInstance.userData.currentSong = s;

  // reset time
  songsListInstance.audio.currentTime =
    songsListInstance.userData?.song_current_time && songsListInstance.userData?.currentSong?.id === s.id
      ? songsListInstance.userData.song_current_time
      : 0;

  // Immediately reflect state visually
  songsListInstance.buttonPlay.classList.remove("button-active");
  songsListInstance.buttonPause.classList.add("button-active");

  // ✅ once audio actually begins playing
  songsListInstance.audio.addEventListener(
    "playing",
    () => {
      songsListInstance.buttonPlay.classList.remove("button-active");
      songsListInstance.buttonPause.classList.add("button-active");
      highlightCurrentSong();
      setPlayerDisplay();
    },
    { once: true }
  );

  // in case audio pauses later
  songsListInstance.audio.addEventListener("pause", () => {
    songsListInstance.buttonPause.classList.remove("button-active");
    songsListInstance.buttonPlay.classList.add("button-active");
  });

  songsListInstance.audio.play().catch(err => {
    console.error("Playback failed:", err);
    songsListInstance.buttonPause.classList.remove("button-active");
    songsListInstance.buttonPlay.classList.add("button-active");
  });
}


function pauseSong(){
    songsListInstance.userData.song_current_time=songsListInstance.audio.currentTime

    if (songsListInstance.userData.currentSong) {
      songsListInstance.buttonPause.classList.remove('button-active')
      songsListInstance.buttonPlay.classList.add('button-active')
    }

    else{
      songsListInstance.buttonPause.classList.remove('button-active')
      songsListInstance.buttonPlay.classList.remove('button-active')
    }
   
    songsListInstance.buttonPlay.classList.remove("playing")
    songsListInstance.audio.pause()

}

function renderSongs(arr) {
  songsListInstance.playlistSongs.innerHTML = arr
    .map(s => `
    <li id="song-${s.id}" class="playlist-song">
      <button onclick="playSong(${s.id})" class="playlist-song-info">
        <span class="playlist-song-title">${s.title}</span>
        <span class="playlist-song-artist">${s.artist}</span>
        <span class="playlist-song-duration">${s.duration}</span>
      </button>
      <button onclick="deleteSong(${s.id})" class="playlist-song-delete" aria-label="Delete ${s.title}">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd"
          d="M5.3 5.18C5.7 4.9 6.28 4.94 6.6 5.28L8 6.75L9.4 5.28C9.7 4.94 10.29 4.9 10.67 5.18C11.06 5.47 11.11 5.97 10.79 6.31L9.18 8L10.79 9.69C11.11 10.03 11.06 10.53 10.67 10.81C10.29 11.1 9.72 11.05 9.39 10.71L8 9.24L6.6 10.71C6.28 11.05 5.71 11.1 5.33 10.81C4.94 10.53 4.89 10.03 5.21 9.69L6.82 8L5.21 6.31C4.89 5.97 4.94 5.47 5.33 5.18Z" fill="white"/>
        </svg>
      </button>
    </li>`).join("");
}

function sortSongs() {
  songsListInstance.userData.songs.sort((a, b) => a.title.localeCompare(b.title));
  return songsListInstance.userData.songs;
}

function addAllSongs() {
  songsListInstance.userData.songs = [...songsListInstance.allSongs];
  renderSongs(sortSongs());
  savePlaylistToLocalStorage();
}

function registerEventListeners() {
  songsListInstance.buttonShuffle.addEventListener("click", shuffle);
  songsListInstance.buttonPause.addEventListener("click", pauseSong);
  songsListInstance.buttonNext.addEventListener("click", playNextSong);
  songsListInstance.buttonPrevious.addEventListener("click", playPreviousSong);

  songsListInstance.buttonPlay.addEventListener("click", () => {
    const s = songsListInstance.userData?.currentSong || songsListInstance.userData?.songs[0];
    if (s) playSong(s.id);
  });

  // Dropdown songs
  songsListInstance.allSongs.forEach(s => {
    songsListInstance.selectSongList.innerHTML += `<option id="${s.id}">${s.title}</option>`;
  });

  let songSelectedId = 0;
  songsListInstance.selectSongList.addEventListener("change", function () {
    songSelectedId = parseInt(this.options[this.selectedIndex].id);
  });

  document.querySelector('#button-addsong').addEventListener("click", (e) => {
    e.preventDefault();
    const s = songsListInstance.allSongs.find(x => x.id === songSelectedId);
    if (s && !songsListInstance.userData.songs.some(x => x.id === s.id)) {
      songsListInstance.userData.songs.push(s);
      renderSongs(songsListInstance.userData.songs);
      savePlaylistToLocalStorage();
    }
  });

  songsListInstance.buttonAddAllSongs.addEventListener("click", (e) => {
    e.preventDefault();
    addAllSongs();
  });

  songsListInstance.buttonRemoveAllSongs.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Remove all songs from playlist?")) {
      songsListInstance.userData.songs = [];
      renderSongs([]);
      localStorage.removeItem("customPlaylist");
      console.log("🗑 Playlist cleared");
    }
  });

  songsListInstance.audio.addEventListener("ended", () => {
    const i = getCurrentSongIndex();
    if (i < songsListInstance.userData.songs.length - 1) playNextSong();
    else {
      songsListInstance.userData.currentSong = null;
      pauseSong();
      setPlayerDisplay();
    }
  });
}

window.addEventListener("load", () => {
  songsListInstance = new SongsListGlobals(allSongs);

  // ✅ Load saved playlist first
  const saved = localStorage.getItem("customPlaylist");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        songsListInstance.userData.songs = parsed;
        console.log("🎵 Loaded saved playlist:", parsed.length);
      }
    } catch (err) {
      console.error("load error:", err);
    }
  }

  registerEventListeners();
  renderSongs(songsListInstance.userData.songs);

  // ✅ Ensure initial save (creates entry if none)
  savePlaylistToLocalStorage();
  console.log("Pause button element:", songsListInstance.buttonPause);
  console.log("Play button element:", songsListInstance.buttonPlay);

});
