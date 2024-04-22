import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

export const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
];
