# Songs List Pro

A modern, customizable music playlist player designed for website owners who want to embed beautiful, fully-featured audio experiences into their sites.

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#usage">Usage</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#license">License</a>
</p>

![App Screenshot](https://freesmartphoneapps.com/images/songs-list-pro/songs-list-pro-screenshot1.png)

## Features

### Core Functionality
- **Playlist Management** - Organize songs into customizable categories
- **Audio Controls** - Play, pause, skip, previous, and shuffle functionality
- **Volume Control** - Adjustable volume slider with mute toggle
- **Progress Bar** - Visual timeline with seek functionality
- **Search** - Real-time filtering across all songs

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
cd soundboard
```

### 2. Add Your Songs

Edit `js/songsListProSongs.js` to add your audio files:

```javascript
const songsData = [
  {
    id: 0,
    title: "Your Song Title",
    artist: "Artist Name",
    duration: "3:45",
    src: "audio/your-song.mp3",
    category: "Your Category"
  },
  // Add more songs...
];
```
---

## Project Structure

```
soundboard/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles (themes, components, responsive)
├── js/
│   ├── script.js           # Core player logic and UI interactions
│   ├── songsListClasses.js # SongsList class definition
│   ├── songsListProSongs.js # Song data configuration
│   └── albumArtConfig.js   # Random album art configuration
├── audio/                  # Your audio files (mp3, wav, ogg)
├── images/                 # Album art and icons
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

### Adding Categories

Categories are automatically generated from your song data. Simply add a `category` field to each song:

```javascript
{
  id: 1,
  title: "Chill Vibes",
  artist: "Lo-Fi Artist",
  duration: "4:20",
  src: "audio/chill-vibes.mp3",
  category: "Lo-Fi"  // This creates/adds to the "Lo-Fi" category
}
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
| `ArrowUp` | Volume up |
| `ArrowDown` | Volume down |
| `M` | Mute / Unmute |
| `Tab` | Navigate controls |
| `Enter` | Activate focused element |

---

## Embedding on Your Website

### Basic Embed

```html
<!-- Add to your HTML -->
<link rel="stylesheet" href="path/to/soundboard/css/styles.css">

<div id="soundboard-container">
  <!-- Copy contents from index.html body -->
</div>

<script src="path/to/soundboard/js/songsListClasses.js"></script>
<script src="path/to/soundboard/js/songsListProSongs.js"></script>
<script src="path/to/soundboard/js/script.js"></script>
```

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
- **Lightweight** - Under 50KB total (excluding audio files)
- **Fast Loading** - Optimized CSS with minimal reflows
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
