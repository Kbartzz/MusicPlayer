import { Component } from '@angular/core';
import { isPlatform, AlertController } from '@ionic/angular';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { Preferences } from '@capacitor/preferences';
import { AudioService, Track } from '../services/audio.service';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';

interface Playlist {
  name: string;
  tracks: Track[];
}

@Component({
  selector: 'app-local-player',
  templateUrl: './local-player.page.html',
  styleUrls: ['./local-player.page.scss'],
  standalone: false,
})
export class LocalPlayerPage {
  playlists: Playlist[] = [];
  selectedPlaylistIndex: number = 0;
  searchTerm: string = '';
  isNative: boolean = isPlatform('android');

  constructor(
    private fileChooser: FileChooser,
    public audioService: AudioService,
    private alertCtrl: AlertController,
      private filePath: FilePath,
  ) {}

  get currentPlaylist(): Track[] {
    return this.playlists[this.selectedPlaylistIndex]?.tracks || [];
  }

  async ngOnInit() {
    const saved = await Preferences.get({ key: 'playlists' });
    this.playlists = saved.value ? JSON.parse(saved.value) : [];

    if (this.playlists.length === 0) {
      this.playlists.push({
        name: 'My Songs',
        tracks: [
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
        ]
      });
    }

    this.audioService.setPlaylist(this.currentPlaylist);
    this.savePlaylists();
  }

  getFileNameFromPath(path: string): { artist: string; title: string } {
    const fileName = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Unknown';
    const parts = fileName.split(' - ');
    return {
      artist: parts[0]?.trim() || 'Unknown Artist',
      title: parts[1]?.trim() || parts[0] || 'Unknown Title',
    };
  }

  async createPlaylist() {
    const alert = await this.alertCtrl.create({
      header: 'New Playlist',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Playlist name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: data => {
            if (data.name?.trim()) {
              this.playlists.push({ name: data.name.trim(), tracks: [] });
              this.selectedPlaylistIndex = this.playlists.length - 1;
              this.savePlaylists();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async savePlaylists() {
    await Preferences.set({
      key: 'playlists',
      value: JSON.stringify(this.playlists)
    });
  }

switchPlaylist(index: number) {
  this.selectedPlaylistIndex = index;

  // If no track is playing, update playlist for playback
  if (!this.audioService.currentTrack) {
    this.audioService.setPlaylist(this.currentPlaylist);
  }
}

async addToAnotherPlaylist(track: Track) {
  const alert = await this.alertCtrl.create({
    header: 'Select Playlist',
    inputs: this.playlists.map((p, i) => ({
      type: 'radio',
      label: p.name,
      value: i,
      checked: i === this.selectedPlaylistIndex
    })),
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Add',
        handler: async (index: number) => {
          this.playlists[index].tracks.push({ ...track });
          await this.savePlaylists();

          const toast = document.createElement('ion-toast');
          toast.message = 'Track added to playlist!';
          toast.duration = 1500;
          toast.color = 'success';
          document.body.appendChild(toast);
          await toast.present();
        }
      }
    ]
  });

  await alert.present();
}



 async pickAudio() {
  if (this.isNative) {
    try {
      const uri = await this.fileChooser.open();

      const response = await fetch(uri);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const fileName = uri.split('/').pop() || 'Unknown';
      const { title, artist } = this.getFileNameFromPath(fileName);

      const newTrack: Track = {
        title,
        artist,
        path: blobUrl, // use Blob URL to ensure it can play
        image: 'assets/default-cover.jpg',
      };

      this.currentPlaylist.push(newTrack);
      this.audioService.setPlaylist(this.currentPlaylist);
      await this.savePlaylists();

    } catch (error) {
      console.error('Error selecting file:', error);
    }

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

        this.currentPlaylist.push(newTrack);
        this.audioService.setPlaylist(this.currentPlaylist);
        await this.savePlaylists();
      }
      input.remove();
    };

    document.body.appendChild(input);
    input.click();
  }
}



  async addTrack(track: Track) {
    this.currentPlaylist.push(track);
    this.audioService.setPlaylist(this.currentPlaylist);
    await this.savePlaylists();
  }

  async addExternalTrack(track: Track) {
  this.currentPlaylist.push(track);
  this.audioService.setPlaylist(this.currentPlaylist);
  await this.savePlaylists();
}

async loadTrack(index: number) {
  const track = this.currentPlaylist[index];
  if (!track) return;

  this.audioService.setPlaylist(this.currentPlaylist);
  this.audioService.play(track, index);

  await Preferences.set({
    key: 'lastTrack',
    value: JSON.stringify(track),
  });
}


  deleteTrack(index: number) {
    const wasCurrent = this.audioService.currentTrack?.path === this.currentPlaylist[index]?.path;

    this.currentPlaylist.splice(index, 1);
    this.audioService.setPlaylist(this.currentPlaylist);
    this.savePlaylists();

    if (wasCurrent) {
      this.audioService.stop();
    }
  }

  filteredPlaylist(): Track[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.currentPlaylist;

    return this.currentPlaylist.filter(song =>
      song.title.toLowerCase().includes(term) ||
      song.artist.toLowerCase().includes(term)
    );
  }
}