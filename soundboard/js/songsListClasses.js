class SongsListGlobals{
  constructor(allSongs=[], audio = new Audio()) {
    if (!Array.isArray(allSongs)) {
      console.warn('allSongs should be an array. Initializing with an empty array.');
      allSongs = [];
    }
    this.buttonPlay = this.getElement('#play');
    this.buttonPause = this.getElement('#pause');
    this.playlistSongs = this.getElement('#playlist-songs');
    this.buttonNext = this.getElement('#next');
    this.buttonPrevious = this.getElement('#previous');
    this.buttonShuffle = this.getElement('#shuffle');
    this.audio = audio;
    this.currentSong = null;
    this.songCurrentTime = 0;
    this.allSongs = allSongs 
    this.userData = {
        songs: [...allSongs],
        currentSong: null,
        songCurrentTime: 0,
    };
    this.selectSongList = this.getElement('#select-songlist');
    this.buttonAddSong = this.getElement('#button-addsong');
    this.buttonAddAllSongs = this.getElement('#button-addallsongs');
    this.buttonRemoveAllSongs = this.getElement('#button-removeallsongs');
}

getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Warning: Element not found for selector: ${selector}`);
    }
    return element;
}

}
