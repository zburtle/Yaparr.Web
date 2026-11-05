import { Routes } from '@angular/router';
import { Home } from './home';
import { OpenLink } from './open-link';

export const routes: Routes = [
  { path: '', component: Home, title: 'Yaparr' },
  { path: 'join', component: OpenLink, data: { kind: 'join' }, title: 'Join a room · Yaparr' },
  { path: 'chat', component: OpenLink, data: { kind: 'chat' }, title: 'Start a chat · Yaparr' },
  { path: '**', redirectTo: '' },
];
