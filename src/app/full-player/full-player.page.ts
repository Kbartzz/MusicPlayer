import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-full-player',
  templateUrl: './full-player.page.html',
  styleUrls: ['./full-player.page.scss'],
  standalone: false,
})
export class FullPlayerPage {
  progress = 0;
  duration = 0;
  interval: any;

  constructor(
    public audioService: AudioService,
    private modalCtrl: ModalController
  ) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    this.setupProgressTracking();
  }

get albumCover(): string {
  return this.audioService.currentTrack?.image || 'assets/default-cover.jpg';
}


  setupProgressTracking() {
    const audio = this.audioService['audio'];
    if (audio) {
      this.duration = audio.duration || 0;
      this.interval = setInterval(() => {
        this.progress = audio.currentTime;
      }, 500);
    }
  }

  seekTo(event: any) {
    const audio = this.audioService['audio'];
    if (audio) {
      audio.currentTime = event.detail.value;
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
