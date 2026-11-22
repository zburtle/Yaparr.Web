import { Routes } from '@angular/router';
import { Guide } from './guide';
import { GuideCloud } from './guide-cloud';
import { Home } from './home';
import { Learn, LearnPage, learnTitle } from './learn';
import { OpenLink } from './open-link';
import { Privacy } from './privacy';
import { Signup } from './signup';
import { Subscribe } from './subscribe';
import { SubscribeThanks } from './subscribe-thanks';

export const routes: Routes = [
  { path: '', component: Home, title: 'Yaparr' },
  { path: 'join', component: OpenLink, data: { kind: 'join' }, title: 'Join a room · Yaparr' },
  { path: 'chat', component: OpenLink, data: { kind: 'chat' }, title: 'Start a chat · Yaparr' },
  { path: 'guide', component: Guide, title: 'Set up your profile · Yaparr' },
  { path: 'guide/cloud', component: GuideCloud, title: 'Why Yaparr Cloud makes linking easier · Yaparr' },
  { path: 'learn', component: Learn, title: 'Guides · Yaparr' },
  { path: 'learn/:slug', component: LearnPage, title: learnTitle },
  { path: 'signup', component: Signup, title: 'Sign up · Yaparr' },
  { path: 'subscribe', component: Subscribe, title: 'Yaparr Cloud subscription · Yaparr' },
  { path: 'subscribe/thanks', component: SubscribeThanks, title: 'Thank you · Yaparr' },
  { path: 'privacy', component: Privacy, title: 'Privacy policy · Yaparr' },
  { path: '**', redirectTo: '' },
];
