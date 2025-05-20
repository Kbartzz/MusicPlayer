import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface Track {
  title: string;
  artist: string;
  path: string;
  image?: string;
  source?: 'local' | 'deezer';
}

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio: HTMLAudioElement | null = null;

  public currentTrack: Track | null = null;
  public isPlaying = false;

  public currentTime = 0;
  public duration = 0;

  public playlist: Track[] = [];
  public currentIndex = -1;

  public shuffleEnabled = false;
  public repeatMode: 'none' | 'one' | 'all' = 'none';

  private playedIndices: number[] = [];

  public shuffle = false;
public repeat = false;

toggleShuffle() {
  this.shuffle = !this.shuffle;
  console.log('Shuffle:', this.shuffle);
}

toggleRepeat() {
  this.repeat = !this.repeat;
  console.log('Repeat:', this.repeat);
}


  setPlaylist(playlist: Track[]) {
    this.playlist = playlist;
    this.playedIndices = [];
  }

  play(track: Track, index: number) {
  this.stop();


  try {
    this.audio = new Audio();
    this.audio.src = track.path;
    this.audio.load();
    this.audio.play();
  } catch (error) {
    console.error('Error playing audio:', error);
    return;
  }

  this.currentTrack = track;
  this.isPlaying = true;
  this.currentIndex = index;

  if (!this.playedIndices.includes(index)) {
    this.playedIndices.push(index);
  }

  this.audio.onloadedmetadata = () => {
    this.duration = this.audio?.duration ?? 0;
  };

  this.audio.ontimeupdate = () => {
    this.currentTime = this.audio?.currentTime ?? 0;
  };

  this.audio.onended = () => {
    if (this.repeat) {
      this.play(this.playlist[this.currentIndex], this.currentIndex);
    } else {
      this.next();
    }
  };
}


  private handleTrackEnd() {
    if (this.repeatMode === 'one') {
      this.play(this.playlist[this.currentIndex], this.currentIndex);
    } else {
      this.next();
    }
  }

  togglePlayPause() {
    if (this.audio) {
      if (this.audio.paused) {
        this.audio.play();
        this.isPlaying = true;
      } else {
        this.audio.pause();
        this.isPlaying = false;
      }
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.currentTrack = null;
  }

next() {
  if (this.shuffle) {
    const nextIndex = Math.floor(Math.random() * this.playlist.length);
    this.play(this.playlist[nextIndex], nextIndex);
    return;
  }

  const nextIndex = this.currentIndex + 1;
  if (nextIndex < this.playlist.length) {
    this.play(this.playlist[nextIndex], nextIndex);
  } else {
    console.log('No next track available');
  }
}


  previous() {
    const prevIndex = this.currentIndex - 1;
    if (prevIndex >= 0) {
      this.play(this.playlist[prevIndex], prevIndex);
    } else {
      console.log('No previous track.');
    }
  }

  private getNextIndex(): number {
    if (this.shuffleEnabled) {
      const remainingIndices = this.playlist
        .map((_, i) => i)
        .filter(i => !this.playedIndices.includes(i));

      if (remainingIndices.length === 0) {
        if (this.repeatMode === 'all') {
          this.playedIndices = [];
          return this.getNextIndex();
        }
        return -1;
      }

      const randomIndex = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
      return randomIndex;
    } else {
      const nextIndex = this.currentIndex + 1;
      if (nextIndex < this.playlist.length) {
        return nextIndex;
      } else if (this.repeatMode === 'all') {
        return 0;
      }
      return -1;
    }
  }

  seekTo(seconds: number) {
    if (this.audio) {
      this.audio.currentTime = seconds;
    }
  }

  formatTime(t: number): string {
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  async addTrack(track: Track, avoidDuplicates: boolean = true) {
    if (avoidDuplicates && this.playlist.some(t => t.path === track.path)) return;

    if (!track.image) {
      track.image = 'assets/default-cover.jpg';
    }

    this.playlist.push(track);
    this.setPlaylist(this.playlist);

    const userTracks = this.playlist.filter(t => !t.path.startsWith('assets/'));
    await Preferences.set({
      key: 'playlist',
      value: JSON.stringify(userTracks),
    });
  }

  cycleRepeatMode() {
    if (this.repeatMode === 'none') {
      this.repeatMode = 'one';
    } else if (this.repeatMode === 'one') {
      this.repeatMode = 'all';
    } else {
      this.repeatMode = 'none';
    }
  }
}
