import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalPlayerPageRoutingModule } from './local-player-routing.module';

import { LocalPlayerPage } from './local-player.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalPlayerPageRoutingModule
  ],
  declarations: [LocalPlayerPage]
})
export class LocalPlayerPageModule {}
