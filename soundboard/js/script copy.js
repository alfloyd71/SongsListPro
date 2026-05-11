let songsListInstance;

// ===== Theme Management =====
function initTheme() {
  const savedTheme = localStorage.getItem('soundflow-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = theme === 'dark' ? '#0a0a0f' : '#fafafa';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('soundflow-theme', newTheme);
  
  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = newTheme === 'dark' ? '#0a0a0f' : '#fafafa';
  }
  
  // Announce to screen readers
  announceToScreenReader(`Theme changed to ${newTheme} mode`);
}

// ===== Accessibility Helpers =====
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => announcement.remove(), 1000);
}

// ===== Utility Functions =====
function getCurrentSongIndex() {
  return songsListInstance.userData?.songs.indexOf(songsListInstance.userData?.currentSong);
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateSongCount() {
  const countEl = document.getElementById('song-count');
  const count = songsListInstance.userData?.songs?.length || 0;
  countEl.textContent = `(${count} ${count === 1 ? 'song' : 'songs'})`;
}

// ===== Playback Functions =====
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
  title.textContent = s?.title || "Select a song";
  artist.textContent = s?.artist || "from the playlist below";
}

function highlightCurrentSong() {
  document.querySelectorAll(".playlist-song").forEach(el => el.removeAttribute("aria-current"));
  const el = document.getElementById(`song-${songsListInstance.userData?.currentSong?.id}`);
  if (el) {
    el.setAttribute("aria-current", "true");
    // Smooth scroll to current song
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function setPlayButtonAccessibleText() {
  const s = songsListInstance.userData?.currentSong || songsListInstance.userData?.songs[0];
  songsListInstance.buttonPlay.setAttribute("aria-label", s?.title ? `Play ${s.title}` : "Play");
}

function updatePlayPauseButtons(isPlaying) {
  const playBtn = document.getElementById('play');
  const pauseBtn = document.getElementById('pause');
  
  if (isPlaying) {
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
    pauseBtn.focus();
  } else {
    playBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
  }
}

// ===== Progress & Time =====
function updateProgress() {
  const audio = songsListInstance.audio;
  const progressFill = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent = formatTime(audio.duration);
    
    // Update progress bar aria
    const container = document.querySelector('.progress-container');
    container.setAttribute('aria-valuenow', Math.round(progress));
  }
}

// ===== Volume Control =====
function initVolumeControls() {
  const volumeSlider = document.getElementById('volume-slider');
  const volumeValue = document.getElementById('volume-value');
  const volumeToggle = document.getElementById('volume-toggle');
  const iconVolume = volumeToggle.querySelector('.icon-volume');
  const iconMuted = volumeToggle.querySelector('.icon-muted');
  
  // Load saved volume
  const savedVolume = localStorage.getItem('soundflow-volume');
  if (savedVolume !== null) {
    volumeSlider.value = savedVolume;
    songsListInstance.audio.volume = savedVolume / 100;
    volumeValue.textContent = `${savedVolume}%`;
  } else {
    songsListInstance.audio.volume = 0.8;
  }
  
  volumeSlider.addEventListener('input', () => {
    const value = volumeSlider.value;
    songsListInstance.audio.volume = value / 100;
    volumeValue.textContent = `${value}%`;
    localStorage.setItem('soundflow-volume', value);
    
    // Update mute icon
    if (value === '0') {
      iconVolume.style.display = 'none';
      iconMuted.style.display = 'block';
    } else {
      iconVolume.style.display = 'block';
      iconMuted.style.display = 'none';
    }
  });
  
  let previousVolume = 80;
  volumeToggle.addEventListener('click', () => {
    if (songsListInstance.audio.volume > 0) {
      previousVolume = volumeSlider.value;
      volumeSlider.value = 0;
      songsListInstance.audio.volume = 0;
      volumeValue.textContent = '0%';
      iconVolume.style.display = 'none';
      iconMuted.style.display = 'block';
      announceToScreenReader('Muted');
    } else {
      volumeSlider.value = previousVolume;
      songsListInstance.audio.volume = previousVolume / 100;
      volumeValue.textContent = `${previousVolume}%`;
      iconVolume.style.display = 'block';
      iconMuted.style.display = 'none';
      announceToScreenReader(`Volume set to ${previousVolume}%`);
    }
  });
}

// ===== Search Functionality =====
function initSearch() {
  const searchInput = document.getElementById('search-songs');
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const songs = document.querySelectorAll('.playlist-song');
    
    songs.forEach(song => {
      const title = song.querySelector('.playlist-song-title').textContent.toLowerCase();
      const artist = song.querySelector('.playlist-song-artist')?.textContent.toLowerCase() || '';
      
      if (title.includes(query) || artist.includes(query)) {
        song.style.display = 'flex';
      } else {
        song.style.display = 'none';
      }
    });
  });
}

// ===== LocalStorage =====
function savePlaylistToLocalStorage() {
  try {
    const songs = songsListInstance.userData?.songs || [];
    localStorage.setItem("customPlaylist", JSON.stringify(songs));
  } catch (err) {
    console.error("localStorage save error:", err);
  }
}

// ===== Playlist Management =====
function shuffle() {
  songsListInstance.userData.songs.sort(() => Math.random() - 0.5);
  songsListInstance.userData.currentSong = null;
  songsListInstance.userData.song_current_time = 0;
  renderSongs(songsListInstance.userData.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  savePlaylistToLocalStorage();
  updateSongCount();
  announceToScreenReader('Playlist shuffled');
}

function deleteSong(id) {
  const song = songsListInstance.userData.songs.find(s => s.id === id);
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
  updateSongCount();
  
  if (song) {
    announceToScreenReader(`${song.title} removed from playlist`);
  }
}

function playSong(id) {
  const s = songsListInstance.userData?.songs.find(x => x.id === id);
  if (!s) return;

  // Check if we're resuming the same song that was paused
  const isSameSong = songsListInstance.userData?.currentSong?.id === id;
  const wasPaused = songsListInstance.audio.paused && songsListInstance.audio.currentTime > 0;

  if (isSameSong && wasPaused) {
    // Resume playback without resetting
    updatePlayPauseButtons(true);
    songsListInstance.audio.play().catch(err => {
      console.error("Playback failed:", err);
      updatePlayPauseButtons(false);
    });
    announceToScreenReader(`Resumed ${s.title}`);
    return;
  }

  // Playing a new song - load fresh
  songsListInstance.audio.src = s.src;
  songsListInstance.audio.title = s.title;
  songsListInstance.userData.currentSong = s;

  updatePlayPauseButtons(true);
  highlightCurrentSong();
  setPlayerDisplay();

  songsListInstance.audio.play().catch(err => {
    console.error("Playback failed:", err);
    updatePlayPauseButtons(false);
  });
  
  announceToScreenReader(`Now playing ${s.title} by ${s.artist}`);
}

function pauseSong() {
  songsListInstance.userData.song_current_time = songsListInstance.audio.currentTime;
  updatePlayPauseButtons(false);
  songsListInstance.audio.pause();
}

function renderSongs(arr) {
  const container = songsListInstance.playlistSongs;
  
  if (arr.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = arr.map(s => `
    <li id="song-${s.id}" class="playlist-song" role="listitem">
      <button onclick="playSong(${s.id})" class="playlist-song-info" aria-label="Play ${s.title} by ${s.artist}">
        <span class="playlist-song-title">${escapeHtml(s.title)}</span>
        <span class="playlist-song-artist">${escapeHtml(s.artist)}</span>
        <span class="playlist-song-duration">${s.duration}</span>
      </button>
      <button onclick="deleteSong(${s.id})" class="playlist-song-delete" aria-label="Remove ${s.title} from playlist" title="Remove song">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </li>
  `).join("");
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function sortSongs() {
  songsListInstance.userData.songs.sort((a, b) => a.title.localeCompare(b.title));
  return songsListInstance.userData.songs;
}

function addAllSongs() {
  songsListInstance.userData.songs = [...songsListInstance.allSongs];
  renderSongs(sortSongs());
  savePlaylistToLocalStorage();
  updateSongCount();
  announceToScreenReader(`Added all ${songsListInstance.allSongs.length} songs to playlist`);
}

// ===== Event Listeners =====
function registerEventListeners() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Player controls
  songsListInstance.buttonShuffle.addEventListener("click", shuffle);
  songsListInstance.buttonPause.addEventListener("click", pauseSong);
  songsListInstance.buttonNext.addEventListener("click", playNextSong);
  songsListInstance.buttonPrevious.addEventListener("click", playPreviousSong);

  songsListInstance.buttonPlay.addEventListener("click", () => {
    const s = songsListInstance.userData?.currentSong || songsListInstance.userData?.songs[0];
    if (s) playSong(s.id);
  });

  // Progress bar click
  const progressBar = document.querySelector('.progress-bar');
  progressBar.addEventListener('click', (e) => {
    if (songsListInstance.audio.duration) {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      songsListInstance.audio.currentTime = percent * songsListInstance.audio.duration;
    }
  });

  // Audio time update
  songsListInstance.audio.addEventListener('timeupdate', updateProgress);

  // Populate dropdown
  songsListInstance.allSongs.forEach(s => {
    const option = document.createElement('option');
    option.value = s.id;
    option.textContent = s.title;
    songsListInstance.selectSongList.appendChild(option);
  });

  // Add song button
  document.querySelector('#button-addsong').addEventListener("click", (e) => {
    e.preventDefault();
    const selectedId = parseInt(songsListInstance.selectSongList.value);
    const s = songsListInstance.allSongs.find(x => x.id === selectedId);
    
    if (s && !songsListInstance.userData.songs.some(x => x.id === s.id)) {
      songsListInstance.userData.songs.push(s);
      renderSongs(songsListInstance.userData.songs);
      savePlaylistToLocalStorage();
      updateSongCount();
      announceToScreenReader(`${s.title} added to playlist`);
    } else if (s) {
      announceToScreenReader(`${s.title} is already in your playlist`);
    }
  });

  // Add all songs
  songsListInstance.buttonAddAllSongs.addEventListener("click", (e) => {
    e.preventDefault();
    addAllSongs();
  });

  // Remove all songs
  songsListInstance.buttonRemoveAllSongs.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Remove all songs from playlist?")) {
      songsListInstance.userData.songs = [];
      songsListInstance.userData.currentSong = null;
      pauseSong();
      setPlayerDisplay();
      renderSongs([]);
      localStorage.removeItem("customPlaylist");
      updateSongCount();
      announceToScreenReader('Playlist cleared');
    }
  });

  // Audio ended
  songsListInstance.audio.addEventListener("ended", () => {
    const i = getCurrentSongIndex();
    if (i < songsListInstance.userData.songs.length - 1) {
      playNextSong();
    } else {
      songsListInstance.userData.currentSong = null;
      updatePlayPauseButtons(false);
      setPlayerDisplay();
      announceToScreenReader('Playlist finished');
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Only handle shortcuts when not focused on input/select
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        if (songsListInstance.audio.paused) {
          const s = songsListInstance.userData?.currentSong || songsListInstance.userData?.songs[0];
          if (s) playSong(s.id);
        } else {
          pauseSong();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        playNextSong();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        playPreviousSong();
        break;
      case 'KeyM':
        e.preventDefault();
        document.getElementById('volume-toggle').click();
        break;
    }
  });
}

// ===== Initialization =====
window.addEventListener("load", () => {
  // Initialize theme first
  initTheme();
  
  // Initialize player
  songsListInstance = new SongsListGlobals(allSongs);

  // Load saved playlist
  const saved = localStorage.getItem("customPlaylist");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        songsListInstance.userData.songs = parsed;
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  }

  // Setup
  registerEventListeners();
  initVolumeControls();
  initSearch();
  renderSongs(songsListInstance.userData.songs);
  savePlaylistToLocalStorage();
  updateSongCount();
  
  // Set initial button state
  updatePlayPauseButtons(false);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('soundflow-theme')) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});
