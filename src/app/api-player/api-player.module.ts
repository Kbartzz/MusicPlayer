import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApiPlayerPageRoutingModule } from './api-player-routing.module';

import { ApiPlayerPage } from './api-player.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApiPlayerPageRoutingModule,
     HttpClientModule
  ],
  declarations: [ApiPlayerPage]
})
export class ApiPlayerPageModule {}
