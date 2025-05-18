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

  private progressInterval: any;

  setPlaylist(playlist: Track[]) {
    this.playlist = playlist;
  }

  play(track: Track, index: number) {
    this.stop();

    this.audio = new Audio(track.path);
    this.audio.play();

    this.currentTrack = track;
    this.isPlaying = true;
    this.currentIndex = index;

    this.audio.onloadedmetadata = () => {
      this.duration = this.audio?.duration ?? 0;
    };

    this.audio.ontimeupdate = () => {
      this.currentTime = this.audio?.currentTime ?? 0;
    };

    this.audio.onended = () => {
      this.next(); // auto-play next when track ends
    };
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
    const nextIndex = this.currentIndex + 1;
    if (nextIndex < this.playlist.length) {
      const nextTrack = this.playlist[nextIndex];
      this.play(nextTrack, nextIndex);
    } else {
      console.log('No next track available');
    }
  }

  previous() {
    const prevIndex = this.currentIndex - 1;
    if (prevIndex >= 0) {
      const prevTrack = this.playlist[prevIndex];
      this.play(prevTrack, prevIndex);
    } else {
      console.log('No previous track available');
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

  /**
   * ✅ Add a new track to the playlist and save it to Preferences
   */
  async addTrack(track: Track, avoidDuplicates: boolean = true) {
    // Optional: skip if path already exists
    if (
      avoidDuplicates &&
      this.playlist.some(t => t.path === track.path)
    ) {
      console.log('Track already exists in playlist.');
      return;
    }

    // Assign default cover if none
    if (!track.image) {
      track.image = 'assets/default-cover.jpg';
    }

    this.playlist.push(track);
    this.setPlaylist(this.playlist);

    // Save only user-added tracks (not sample assets)
    const userTracks = this.playlist.filter(t => !t.path.startsWith('assets/'));
    await Preferences.set({
      key: 'playlist',
      value: JSON.stringify(userTracks),
    });

    console.log('Track added:', track);
  }
}
