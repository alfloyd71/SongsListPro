/**
 * Album Art Configuration
 * 
 * Add as many album art images as you want to this array.
 * One will be randomly selected on each page load.
 * 
 * If you want to display a specific album art for a playlist,
 * simply use only one image in the array.
 * 
 * Example configurations:
 * 
 * Single image (specific playlist):
 * const albumArtImages = [
 *   'images/album-art/my-playlist-cover.webp'
 * ];
 * 
 * Multiple images (random on each load):
 * const albumArtImages = [
 *   'images/album-art/cover1.webp',
 *   'images/album-art/cover2.webp',
 *   'images/album-art/cover3.webp'
 * ];
 */

const albumArtImages = [
  '../soundboard/images/album-art/caribbean1.webp',
  '../soundboard/images/album-art/caribbean2.webp',
  '../soundboard/images/album-art/seaturtle1.webp',
  '../soundboard/images/album-art/bahamas2.webp',
  '../soundboard/images/album-art/mountain5.webp',
  '../soundboard/images/album-art/orca1.webp',
  '../soundboard/images/album-art/rainbow1.webp',
  '../soundboard/images/album-art/river2.webp',
  '../soundboard/images/album-art/waterfall1.webp',

];

/**
 * Gets a random album art image from the configured array.
 * If only one image is configured, it returns that image.
 * @returns {string} Path to the selected album art image
 */
function getRandomAlbumArt() {
  if (albumArtImages.length === 0) {
    // Fallback if no images configured
    return 'images/album-art/caribbean2.webp';
  }
  
  if (albumArtImages.length === 1) {
    // Single image configured - return it directly
    return albumArtImages[0];
  }
  
  // Multiple images - select randomly
  const randomIndex = Math.floor(Math.random() * albumArtImages.length);
  return albumArtImages[randomIndex];
}
