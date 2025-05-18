import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullPlayerPage } from './full-player.page';

const routes: Routes = [
  {
    path: '',
    component: FullPlayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullPlayerPageRoutingModule {}
