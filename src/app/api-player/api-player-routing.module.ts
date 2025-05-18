import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiPlayerPage } from './api-player.page';

const routes: Routes = [
  {
    path: '',
    component: ApiPlayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiPlayerPageRoutingModule {}
