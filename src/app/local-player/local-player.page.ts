import { Component } from '@angular/core';
import { isPlatform } from '@ionic/angular';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { Preferences } from '@capacitor/preferences';
import { AudioService, Track } from '../services/audio.service';

@Component({
  selector: 'app-local-player',
  templateUrl: './local-player.page.html',
  styleUrls: ['./local-player.page.scss'],
  standalone: false,
})
export class LocalPlayerPage {
  playlist: Track[] = [];
  currentTrackIndex = -1;
  isNative: boolean = isPlatform('android');

  constructor(
    private fileChooser: FileChooser,
    public audioService: AudioService
  ) {}

  async ngOnInit() {
    const sampleSongs: Track[] = [
      {
        path: 'assets/music/Kendrick Lamar - luther.mp3',
        ...this.getFileNameFromPath('assets/music/Kendrick Lamar - luther.mp3'),
        image: 'assets/GNX-album-cover.jpeg'
      },
      {
        path: 'assets/music/SZA - BMF.mp3',
        ...this.getFileNameFromPath('assets/music/SZA - BMF.mp3'),
        image: 'assets/SZA-Album.jpg'
      },
      {
        path: 'assets/music/SZA - Good Days.mp3',
        ...this.getFileNameFromPath('assets/music/SZA - Good Days.mp3'),
        image: 'assets/SZA-Good-Days.png'
      }
    ];

    const saved = await Preferences.get({ key: 'playlist' });
    const userTracks: Track[] = saved.value ? JSON.parse(saved.value) : [];

    this.playlist = [...sampleSongs, ...userTracks];
    this.audioService.setPlaylist(this.playlist);
  }

  getFileNameFromPath(path: string): { artist: string; title: string } {
    const fileName = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Unknown';
    const parts = fileName.split(' - ');
    return {
      artist: parts[0]?.trim() || 'Unknown Artist',
      title: parts[1]?.trim() || parts[0] || 'Unknown Title',
    };
  }

  async pickAudio() {
  if (this.isNative) {
    const uri = await this.fileChooser.open();
    const { title, artist } = this.getFileNameFromPath(uri);
    const newTrack: Track = { title, artist, path: uri };

    this.playlist.push(newTrack);
    this.audioService.setPlaylist(this.playlist);

    const userTracks = this.playlist.filter(t => !t.path.startsWith('assets/'));
    await Preferences.set({ key: 'playlist', value: JSON.stringify(userTracks) });

  } else {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.style.display = 'none';

    input.onchange = async (e: any) => {
      const file: File = e.target.files?.[0];
      if (file) {
        const path = URL.createObjectURL(file);
        const { title, artist } = this.getFileNameFromPath(file.name);
        const newTrack: Track = { title, artist, path };

        this.playlist.push(newTrack);
        this.audioService.setPlaylist(this.playlist);

        const userTracks = this.playlist.filter(t => !t.path.startsWith('assets/'));
        await Preferences.set({ key: 'playlist', value: JSON.stringify(userTracks) });
      }

      // ✅ Clean up
      input.remove();
    };

    // ✅ Append and trigger
    document.body.appendChild(input);
    input.click();
  }
}


  async loadTrack(index: number) {
    const track = this.playlist[index];
    if (!track) return;

    this.currentTrackIndex = index;
    this.audioService.play(track, index);

    await Preferences.set({
      key: 'lastTrack',
      value: JSON.stringify(track),
    });
  }

  deleteTrack(index: number) {
    const wasCurrent = index === this.currentTrackIndex;

    this.playlist.splice(index, 1);

    const userTracks = this.playlist.filter(t => !t.path.startsWith('assets/'));
    Preferences.set({
      key: 'playlist',
      value: JSON.stringify(userTracks),
    });

    this.audioService.setPlaylist(this.playlist);

    if (wasCurrent) {
      this.audioService.stop();
    }

    if (this.currentTrackIndex >= this.playlist.length) {
      this.currentTrackIndex = this.playlist.length - 1;
    }
  }
  searchTerm: string = '';

filteredPlaylist(): Track[] {
  const term = this.searchTerm.trim().toLowerCase();
  if (!term) return this.playlist;

  return this.playlist.filter(song =>
    song.title.toLowerCase().includes(term) ||
    song.artist.toLowerCase().includes(term)
  );
}

}
