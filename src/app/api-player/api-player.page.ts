import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AudioService, Track } from '../services/audio.service';
import { ModalController } from '@ionic/angular';
import { FullPlayerPage } from '../full-player/full-player.page';

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
    private modalCtrl: ModalController
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
}
