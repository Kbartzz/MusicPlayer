import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'local-player',
    loadChildren: () => import('./local-player/local-player.module').then(m => m.LocalPlayerPageModule),
  },
 {
  path: 'api-player',
  loadChildren: () =>
    import('./api-player/api-player.module').then(m => m.ApiPlayerPageModule)
},
  {
    path: 'full-player',
    loadChildren: () => import('./full-player/full-player.module').then( m => m.FullPlayerPageModule)
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
