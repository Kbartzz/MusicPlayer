import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { MiniPlayerComponent } from './mini-player/mini-player.component';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';



@NgModule({
  declarations: [AppComponent,MiniPlayerComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Media, FileChooser,FilePath, AndroidPermissions],
  bootstrap: [AppComponent],
})
export class AppModule {}
