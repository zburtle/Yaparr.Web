import { Routes } from '@angular/router';
import { Home } from './home';
import { OpenLink } from './open-link';
import { Privacy } from './privacy';
import { Signup } from './signup';

export const routes: Routes = [
  { path: '', component: Home, title: 'Yaparr' },
  { path: 'join', component: OpenLink, data: { kind: 'join' }, title: 'Join a room · Yaparr' },
  { path: 'chat', component: OpenLink, data: { kind: 'chat' }, title: 'Start a chat · Yaparr' },
  { path: 'signup', component: Signup, title: 'Sign up · Yaparr' },
  { path: 'privacy', component: Privacy, title: 'Privacy policy � Yaparr' },
  { path: '**', redirectTo: '' },
];
