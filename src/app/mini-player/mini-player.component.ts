import { Component } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { FullPlayerPage } from '../full-player/full-player.page';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss'],
  standalone: false,
})
export class MiniPlayerComponent {
  constructor(public audioService: AudioService, private modalCtrl: ModalController) {}

  onSeekChange(event: any) {
    const value = event.detail.value;
    this.audioService.seekTo(value);
  }

 async openFullPlayer() {
  const modal = await this.modalCtrl.create({
    component: FullPlayerPage,
    showBackdrop: true,
    breakpoints: [0, 0.5, 1],
    initialBreakpoint: 1,
  });

  await modal.present();
}
}
