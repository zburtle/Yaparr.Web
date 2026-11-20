import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REPO } from './downloads';
import { Node, nodeById } from './guide-data';
import { Rich } from './rich';

interface Pair {
  title: string;
  without: Node;
  with: Node;
}

function need(id: string): Node {
  const n = nodeById(id);
  if (!n?.steps) throw new Error(`guide step list missing: ${id}`);
  return n;
}

/**
 * Yaparr Cloud next to doing it by hand. The step lists are the guide's own (guide-data.ts), so what is compared here is always what the guide
 * tells people to do, and the counts cannot drift from it.
 */
@Component({
  selector: 'app-guide-cloud',
  imports: [RouterLink, Rich],
  template: `
    <section class="wrap guide">
      <h1>Why Yaparr Cloud makes linking easier</h1>
      <p class="intro">
        Without it, a new device has to be set up from a device you already have, or from a backup you remembered to make. With it, a new
        device takes your Sync key and a sign-in, and the old device does not need to be there.
      </p>

      @for (p of pairs; track p.title) {
        <section class="compare">
          <h2>{{ p.title }}</h2>
          <div class="cols">
            <article class="col">
              <h3>By hand <span class="count">{{ p.without.steps!.length }} steps</span></h3>
              <ol>
                @for (s of p.without.steps!; track $index) {
                  <li>
                    <app-rich [text]="s.text" />
                  </li>
                }
              </ol>
              <p class="col-note">You need both devices at hand, and the old one switched on.</p>
            </article>
            <article class="col with">
              <h3>With Yaparr Cloud <span class="count">{{ p.with.steps!.length }} steps</span></h3>
              <ol>
                @for (s of p.with.steps!; track $index) {
                  <li>
                    <app-rich [text]="s.text" />
                  </li>
                }
              </ol>
              <p class="col-note">Your old device can be across town, off, or gone.</p>
            </article>
          </div>
        </section>
      }

      <section class="compare">
        <h2>And after that</h2>
        <div class="grid">
          @for (r of rows; track r.title) {
            <article class="card">
              <h3>{{ r.title }}</h3>
              <p><strong>By hand:</strong> {{ r.without }}</p>
              <p><strong>With Yaparr Cloud:</strong> {{ r.with }}</p>
            </article>
          }
        </div>
      </section>

      <section class="compare">
        <h2>Turn it on</h2>
        <ol class="guide-steps plain">
          <li><span class="step-body">You need an account on a Yaparr Cloud server: <strong>https://cloud.yaparr.com</strong>, or one that you or a friend run.</span></li>
          <li><span class="step-body">On any device you already use open <strong class="ui">Settings > Yaparr Cloud</strong> and choose <strong class="ui">Sign in with your browser</strong>. Sign in with your email address and password on the page that opens.</span></li>
          <li>
            <span class="step-body">
              Yaparr shows your <strong class="ui">Sync key</strong> once. Save it in a password manager or on paper.
              <span class="step-warn"><strong>Careful: </strong>Nobody can recover the Sync key, Yaparr included. If it is lost and every device is gone, what the server holds cannot be opened.</span>
            </span>
          </li>
          <li><span class="step-body">That is all. Yaparr keeps your account in step by itself from then on.</span></li>
        </ol>
        <p class="hint">
          Everything the server holds is locked on your devices with the Sync key first, so the server keeps bytes it cannot read. Yaparr
          works without it. It is optional and never needed to chat. The details are in
          <a [href]="repo + '/blob/master/docs/yaparr-cloud.md'">what it does and what it keeps</a>.
        </p>
      </section>

      <p class="actions">
        <a class="button large" routerLink="/guide">Back to the setup guide</a>
      </p>
    </section>
  `,
})
export class GuideCloud {
  protected readonly repo = REPO;
  protected readonly pairs: Pair[] = [
    { title: 'A new phone', without: need('phone-link'), with: need('phone-cloud') },
    { title: 'A new computer', without: need('computer-link'), with: need('computer-cloud') },
  ];
  protected readonly rows = [
    {
      title: 'You lose your only device',
      without: 'The account is gone unless you made a backup, and the backup only holds what was there when you made it.',
      with: 'Restore from Yaparr Cloud on the new device with your Sync key. Rooms and history come back.',
    },
    {
      title: 'Your rooms, name and pins',
      without: 'They move between devices when the devices meet, so a device that was off catches up later.',
      with: 'They are kept on the server as locked copies, so a new device has them the moment it is set up.',
    },
    {
      title: 'Message history',
      without: 'Each device only has what it received, and earlier messages are asked from other devices.',
      with: 'Your history is kept in step as locked pieces, a piece for each month of each room, so a new device has it.',
    },
    {
      title: 'Your own emoji and GIFs',
      without: 'They stay on the device you added them on.',
      with: 'They are on every device you set up.',
    },
    {
      title: 'Being away',
      without: 'People who are offline get a message when you both happen to be online.',
      with: 'A locked copy waits for them for 7 days, and a push wakes their phone.',
    },
  ];
}
