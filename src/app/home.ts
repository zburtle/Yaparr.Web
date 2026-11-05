import { Component } from '@angular/core';
import { Downloads } from './downloads.component';
import { REPO } from './downloads';

@Component({
  selector: 'app-home',
  imports: [Downloads],
  template: `
    <section class="hero">
      <div class="wrap">
        <img class="hero-icon" src="yaparr-icon.svg" alt="" width="96" height="96" />
        <h1>Chat, call and share your screen.<br /><span>No server in the middle.</span></h1>
        <p class="lead">
          Yaparr finds your friends on the BitTorrent network and talks to them directly, with everything encrypted. There is
          no account to make and no company's computer between you.
        </p>
        <app-downloads />
      </div>
    </section>

    <section class="wrap features" id="features">
      <h2>Everything you expect from a chat app</h2>
      <div class="grid">
        @for (f of features; track f.title) {
          <article class="card">
            <h3>{{ f.title }}</h3>
            <p>{{ f.text }}</p>
          </article>
        }
      </div>
    </section>

    <section class="band" id="how">
      <div class="wrap">
        <h2>How it works</h2>
        <ol class="steps">
          <li><strong>Make a room</strong><span>A room is a random key that only you hold until you share it. Outsiders can't find it or read it.</span></li>
          <li><strong>Send a link</strong><span>Copy the room's link and send it. Opening it starts Yaparr and asks if you want to join.</span></li>
          <li><strong>Talk directly</strong><span>Your computers connect to each other, through firewalls too, with nothing for anyone to shut down.</span></li>
        </ol>
        <p class="fine">
          Other members of a room see your IP address, because they connect to you directly. The
          <a [href]="repo + '/blob/master/docs/security.md'">security notes</a> say what is and isn't protected.
        </p>
      </div>
    </section>

    <section class="wrap open">
      <h2>Free software</h2>
      <p>
        Yaparr is free under the GNU GPL, with the source and every release on <a [href]="repo">GitHub</a>. It has no ads, no
        telemetry and no account.
      </p>
    </section>
  `,
})
export class Home {
  protected readonly repo = REPO;
  protected readonly features = [
    { title: 'Rooms and direct chats', text: 'Private rooms with channels and roles, and one-to-one chats. Replies, @mentions, pictures and GIFs.' },
    { title: 'Voice channels', text: 'Talk in any room, with echo cancellation and noise suppression, and a soundboard for fun.' },
    { title: 'Screen sharing', text: 'Share a monitor or a window with the room, and watch from any system.' },
    { title: 'Private by design', text: 'Messages are signed and every connection is encrypted, with no server that could read them or keep them.' },
    { title: 'Works on hard networks', text: 'Hole punching, port mapping, relaying through members, an optional TURN server and a built-in WireGuard client.' },
    { title: 'Moderation that holds', text: 'Owners, admins and bans, and a new room key so a ban cannot be walked around.' },
  ];
}
