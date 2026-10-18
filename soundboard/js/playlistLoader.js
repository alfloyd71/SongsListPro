/**
 * Playlist Loader
 *
 * Finds playlist files named songsListProSongsList1.js, songsListProSongsList2.js, ...
 * in PLAYLIST_FOLDER and loads them in order, stopping at the first number that
 * doesn't exist. Each file calls songsListProPlaylists.push({ name, songs }).
 *
 * Song ids are prefixed with the playlist number (e.g. "2-0") so ids never
 * clash between playlists.
 */
const PLAYLIST_FOLDER = './songs/playlists/js/';
const PLAYLIST_FILE_PREFIX = 'songsListProSongsList';
const PLAYLIST_MAX = 100; // safety cap

var songsListProPlaylists = [];

function loadPlaylistScript(n) {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = `${PLAYLIST_FOLDER}${PLAYLIST_FILE_PREFIX}${n}.js`;
    script.onload = () => resolve(true);
    script.onerror = () => { script.remove(); resolve(false); };
    document.head.appendChild(script);
  });
}

async function loadAllPlaylists() {
  const playlists = [];
  for (let n = 1; n <= PLAYLIST_MAX; n++) {
    const before = songsListProPlaylists.length;
    const found = await loadPlaylistScript(n);
    if (!found) break;

    const entry = songsListProPlaylists[before];
    if (!entry || !Array.isArray(entry.songs)) {
      console.warn(`${PLAYLIST_FILE_PREFIX}${n}.js loaded but did not add a playlist.`);
      continue;
    }
    playlists.push({
      key: String(n),
      name: entry.name || `Playlist ${n}`,
      songs: entry.songs.map(s => ({ ...s, id: `${n}-${s.id}` })),
    });
  }
  return playlists;
}
