import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AudioService, Track } from '../services/audio.service';
import { ModalController } from '@ionic/angular';
import { FullPlayerPage } from '../full-player/full-player.page';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-api-player',
  templateUrl: './api-player.page.html',
  styleUrls: ['./api-player.page.scss'],
  standalone: false,
})
export class ApiPlayerPage {
  query: string = '';
  results: any[] = [];

  constructor(
    private http: HttpClient,
    public audioService: AudioService,
    private modalCtrl: ModalController,
      private alertCtrl: AlertController,
  ) {}

  searchDeezer() {
    if (!this.query.trim()) return;

    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(this.query)}`;

    const headers = new HttpHeaders({
      'X-RapidAPI-Key': 'a83d35e7b2mshf5c73a3a5fc8eb1p167a57jsn1260b1763d8a',
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: res => {
        this.results = res.data;
      },
      error: err => {
        console.error('RapidAPI Deezer error:', err);
        alert('Failed to fetch tracks from RapidAPI.');
      }
    });
  }

  playPreview(track: any) {
    const formattedTrack: Track = {
      title: track.title,
      artist: track.artist.name,
      path: track.preview,
      image: track.album.cover_medium,
      source: 'deezer',
    };

    this.audioService.setPlaylist([formattedTrack]);
    this.audioService.play(formattedTrack, 0);
    this.openFullPlayer();
  }

  async openFullPlayer() {
    const modal = await this.modalCtrl.create({
      component: FullPlayerPage,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 1,
      cssClass: 'full-player-modal',
    });
    await modal.present();
  }
async addToPlaylistFromDeezer(track: any) {
  const stored = await Preferences.get({ key: 'playlists' });
  const playlists = stored.value ? JSON.parse(stored.value) : [];

  if (!playlists.length) {
    const alert = await this.alertCtrl.create({
      header: 'No Playlists',
      message: 'Please create a playlist first in Local Player.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  const alert = await this.alertCtrl.create({
    header: 'Select Playlist',
    inputs: playlists.map((p: any, i: number) => ({
      type: 'radio',
      label: p.name,
      value: i,
      checked: i === 0
    })),
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Add',
        handler: async (index: number) => {
          const newTrack: Track = {
            title: track.title,
            artist: track.artist.name,
            path: track.preview,
            image: track.album.cover_medium,
            source: 'deezer'
          };
          playlists[index].tracks.push(newTrack);
          await Preferences.set({ key: 'playlists', value: JSON.stringify(playlists) });

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
}
