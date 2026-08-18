import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'explore', 
    loadComponent: () => import('./features/explore/explore').then(m => m.ExploreComponent) 
  },
  { 
    path: 'theories', 
    loadComponent: () => import('./features/theories/theories').then(m => m.TheoriesComponent) 
  },
  { 
    path: 'lab', 
    loadComponent: () => import('./features/lab/lab.component').then(m => m.LabComponent) 
  },
  { path: '**', redirectTo: 'home' }
];