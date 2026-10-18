# Songs List Pro

A modern, customizable music playlist player designed for website owners who want to embed beautiful, fully-featured audio experiences into their sites.

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#usage">Usage</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#license">License</a>
</p>

## Screenshots
<p align="center">
  <img src="https://freesmartphoneapps.com/soundboard/images/screenshots/album-art.jpg" alt="Album Art" width="300">&nbsp;&nbsp;<img src="https://freesmartphoneapps.com/soundboard/images/screenshots/song-library.jpg" alt="Song Library" width="300">
</p>

## Features

### Core Functionality
- **Multiple Curated Playlists** - Offer visitors several playlists to choose from in the Song Library. Each playlist is its own file, and new ones are picked up automatically.
- **Personal Playlist** - Visitors build their own playlist from any of your curated playlists. It is saved in their browser between visits.
- **Audio Controls** - Play, pause, skip, previous, and shuffle functionality
- **Volume Control** - Adjustable volume slider with mute toggle
- **Progress Bar** - Visual timeline with seek functionality
- **Search** - Real-time filtering of the personal playlist by title or artist
- **Demo Playlists Included** - Two sample playlists with demo songs so the player works out of the box

### Design & UX
- **Dark/Light Mode** - Toggle between themes with persistent user preference
- **Glassmorphism UI** - Modern frosted glass aesthetic with gradient accents
- **Smooth Animations** - Polished transitions and hover effects
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Random Album Art** - Display randomized album artwork on each page load, or set a single image for playlist-specific branding

### Accessibility
- **WCAG 2.1 Compliant** - Full keyboard navigation and screen reader support
- **ARIA Labels** - Comprehensive labeling for assistive technologies
- **Focus Management** - Visible focus indicators for keyboard users
- **Reduced Motion** - Respects user motion preferences
- **Skip Links** - Quick navigation for screen reader users

---

## Demo

Explore the features of the Songs List Pro App by checking out our live demo:

**[View Live Demo](https://freesmartphoneapps.com/soundboard/)**

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/alfloyd71/SongsListPro.git
cd SongsListPro
```

### 2. Try the Demo Playlists

Open `index.html` in your browser. Two demo playlists, **AI Playlist #1** and **AI Playlist #2**, are already set up in the Song Library.

### 3. Add Your Own Playlist

Playlists live in `songs/playlists/js/` and are named with a number:

```
songs/playlists/js/songsListProSongsList1.js
songs/playlists/js/songsListProSongsList2.js
songs/playlists/js/songsListProSongsList3.js   <- your new playlist
```

To add a playlist, copy an existing playlist file, rename it with the next number, and edit it:

```javascript
songsListProPlaylists.push({
  name: "My New Playlist",          // Shown in the playlist dropdown
  songs: [
    {
      id: 0,
      title: "Your Song Title",
      artist: "Artist Name",
      duration: "3:45",
      src: "./songs/playlists/playlist3/your-song.mp3",
    },
    {
      id: 1,
      title: "Another Song",
      artist: "Artist Name",
      duration: "4:10",
      src: "./songs/playlists/playlist3/another-song.mp3",
    },
    // Add more songs...
  ],
});
```

Then put the audio files where each `src` points (for example `songs/playlists/playlist3/`). That's it. You don't need to edit `index.html` or any other file. The new playlist appears in the dropdown the next time the page loads.

**Playlist file rules:**
- **Number in order, with no gaps.** The app loads `List1`, `List2`, `List3`… and stops at the first number it can't find. If you have files 1, 2 and 4, playlist 4 won't load.
- **`name`** is the label shown in the playlist dropdown. If you leave it out, the playlist is called "Playlist 3" (using its number).
- **`id`** only needs to be unique within that one file. Different playlists can reuse the same ids.
- **`src`** paths are relative to `index.html`, or you can use a full URL (`https://...`).

> **Note:** Each time the page loads, your browser's developer console shows one "file not found" message for the playlist number after your last one (for example `songsListProSongsList3.js` when you have two playlists). This is how the app knows there are no more playlists. It's expected and doesn't affect anything.

---

## Usage

### Running Locally

Since this is a vanilla JavaScript application with no build step required, you can run it directly:

- **Open the file** - Double-click `index.html` to open it in your browser.
- **Or use a local server** - From the project folder, run a simple web server and open the address it prints:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

### Player Controls

- **Play/Pause** - Click the center play button or press `Space`
- **Next/Previous** - Use the skip buttons or `ArrowRight`/`ArrowLeft` keys
- **Shuffle** - Click the shuffle button to randomize playback order
- **Volume** - Drag the volume slider below the controls
- **Mute** - Click the volume icon or press `M` to toggle mute
- **Seek** - Click anywhere on the progress bar to jump to that position

### Managing Your Playlist

1. **Choose a playlist** - Pick one of the curated playlists from the first dropdown in the "Song Library". The song dropdown next to it updates to show that playlist's songs.
2. **Add individual songs** - Select a song from the song dropdown and click "Add Song"
3. **Add all songs** - Click "Add All" to add every song from the chosen playlist. Songs already in your playlist are skipped, so you can combine several playlists.
4. **Remove songs** - Click the × icon on any song in the playlist
5. **Clear playlist** - Click "Clear All" to remove all songs
6. **Search** - Use the search box to filter songs by title or artist

The first time someone visits, their playlist starts with the songs from the first curated playlist. After that, their own playlist and their last-chosen library playlist are remembered in their browser.

### Theme Switching

Click the sun/moon icon in the top-right corner to toggle between dark and light modes. Your preference is saved to localStorage and persists across sessions.

## Project Structure

```
SongsListPro/
├── index.html                  # Main HTML file
├── css/
│   └── styles.css              # All styles (themes, components, responsive)
├── js/
│   ├── script.js               # Core player logic and UI interactions
│   ├── songsListClasses.js     # SongsList class definition
│   ├── playlistLoader.js       # Finds and loads the numbered playlist files
│   └── albumArtConfig.js       # Random album art configuration
├── songs/
│   └── playlists/
│       ├── js/
│       │   ├── songsListProSongsList1.js   # Playlist 1 (demo: AI Playlist #1)
│       │   └── songsListProSongsList2.js   # Playlist 2 (demo: AI Playlist #2)
│       ├── playlist1/          # Audio files for playlist 1
│       └── playlist2/          # Audio files for playlist 2
├── images/                     # Album art and icons
└── README.md
```

## Audio Files Disclaimer

**Important:** Ensure you have the rights to use and distribute any audio files included in your playlists. This application is a player/organizer tool only. The user is solely responsible for:

- Obtaining proper licenses for any copyrighted music
- Ensuring compliance with local copyright laws
- Respecting the intellectual property rights of artists and content creators

Do not distribute copyrighted audio files without proper authorization from the rights holders.

---

## Configuration

### Playlist Location

Playlist files are loaded from `songs/playlists/js/` by default. To keep them somewhere else, change these settings at the top of `js/playlistLoader.js`:

```javascript
const PLAYLIST_FOLDER = './songs/playlists/js/';      // Folder containing the playlist files
const PLAYLIST_FILE_PREFIX = 'songsListProSongsList'; // File name before the number
const PLAYLIST_MAX = 100;                             // Safety limit on the number of playlists
```

### Random Album Art

Customize the album artwork displayed on each page load by editing `js/albumArtConfig.js`:

```javascript
const albumArtImages = [
  'images/album-art/artwork1.webp',
  'images/album-art/artwork2.webp',
  'images/album-art/artwork3.webp',
  // Add as many images as you like...
];
```

**How it works:**
- **Multiple images** - Add any number of image paths to the array. A random image is selected on each page load.
- **Single image** - For playlist-specific branding, include only one image in the array. It will always display that image.
- **Supported formats** - WEBP, PNG, JPG, GIF, or any browser-supported image format.

```javascript
// Example: Playlist-specific single image
const albumArtImages = [
  'images/album-art/jazz-collection.webp'
];

// Example: Randomized artwork pool
const albumArtImages = [
  'images/album-art/abstract1.webp',
  'images/album-art/abstract2.webp',
  'images/album-art/gradient1.webp',
  'images/album-art/nature1.webp'
];
```

### Customizing Theme Colors

Edit the CSS custom properties in `css/styles.css`:

```css
:root {
  /* Dark theme (default) */
  --background: #0a0a0f;           /* Main background */
  --background-secondary: #12121a; /* Card backgrounds */
  --background-tertiary: #1a1a24;  /* Elevated surfaces */
  --foreground: #fafafa;           /* Primary text */
  --foreground-secondary: #a1a1aa; /* Secondary text */
  
  --primary: #00d4ff;              /* Primary accent (cyan) */
  --primary-hover: #00b8e6;        /* Primary hover state */
  --primary-glow: rgba(0, 212, 255, 0.3); /* Glow effects */
  
  --accent: #7c3aed;               /* Secondary accent (purple) */
  --accent-hover: #6d28d9;         /* Accent hover state */
}

[data-theme="light"] {
  /* Light theme overrides */
  --background: #fafafa;
  --background-secondary: #ffffff;
  --background-tertiary: #f4f4f5;
  --foreground: #18181b;
  --foreground-secondary: #52525b;
  
  --primary: #0891b2;
  --primary-hover: #0e7490;
}
```

### Supported Audio Formats

- MP3 (recommended for best browser support)
- WAV
- OGG
- AAC
- FLAC (limited browser support)

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `ArrowRight` | Next track |
| `ArrowLeft` | Previous track |
| `M` | Mute / Unmute |
| `Tab` | Navigate controls |
| `Enter` | Activate focused element |

Shortcuts are paused while a text box or dropdown has focus, so typing in the search box or using the arrow keys in a dropdown won't control playback.

---

## Embedding on Your Website

### Basic Embed

```html
<!-- Add to your HTML -->
<link rel="stylesheet" href="path/to/soundboard/css/styles.css">

<div id="soundboard-container">
  <!-- Copy contents from index.html body -->
</div>

<script src="path/to/soundboard/js/albumArtConfig.js"></script>
<script src="path/to/soundboard/js/playlistLoader.js"></script>
<script src="path/to/soundboard/js/songsListClasses.js"></script>
<script src="path/to/soundboard/js/script.js"></script>
```

When embedding this way, playlist and song paths are relative to **your page**, not the soundboard folder. Set `PLAYLIST_FOLDER` in `playlistLoader.js` (for example `'path/to/soundboard/songs/playlists/js/'`) and use matching `src` paths in your playlist files, or use full URLs.

### iframe Embed

```html
<iframe 
  src="https://yourdomain.com/soundboard/" 
  width="100%" 
  height="600" 
  frameborder="0"
  title="Music Playlist"
  allow="autoplay"
></iframe>
```

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Opera | 67+ |
| iOS Safari | 13+ |
| Chrome Android | 80+ |

---

## Performance

- **Zero Dependencies** - Pure vanilla JavaScript, no frameworks required
- **Lightweight** - About 60KB total (excluding audio and image files)
- **Fast Loading** - Optimized CSS with minimal reflows
- **Non-Blocking Playlists** - The player is ready right away while playlist files load in the background
- **Efficient Rendering** - Template literals with batch DOM updates for smooth playlist rendering

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/alfloyd71/SongsListPro?tab=MIT-1-ov-file#readme) file for details.

---

## Acknowledgments

- Design inspiration from modern music streaming interfaces
- Accessibility patterns from [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Support

If you find this project helpful, please consider:

- Giving it a star on GitHub
- Sharing it with others who might benefit
- [Reporting issues](https://github.com/alfloyd71/SongsListPro/issues) you encounter

---

**Made with care for the web audio community**
