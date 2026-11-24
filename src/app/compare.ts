import { Component } from '@angular/core';

/** What an app does for a row of the table: yes, no, or only in part. */
export type Answer = 'yes' | 'no' | 'part';

export interface Cell {
  answer: Answer;
  /** A few words under the mark, where a bare yes or no would mislead. */
  note?: string;
}

export interface Row {
  what: string;
  /** In the order of `APPS`. */
  cells: Cell[];
}

/** The apps compared, Yaparr first. */
export const APPS = ['Yaparr', 'Discord', 'Signal', 'Matrix', 'TeamSpeak', 'Jami'] as const;

const yes = (note?: string): Cell => ({ answer: 'yes', note });
const no = (note?: string): Cell => ({ answer: 'no', note });
const part = (note?: string): Cell => ({ answer: 'part', note });

/**
 * From each app's public documentation, as of November 2026. Matrix means the protocol with its usual apps (Element, say).
 * A mark that is only partly true says why in its note; if one is out of date, the fix is a change here.
 */
export const ROWS: Row[] = [
  { what: 'No account, email address or phone number', cells: [yes(), no(), no('phone number'), no('a server account'), part('a key, no account'), yes()] },
  { what: 'No server to run or trust for chat and voice', cells: [yes(), no(), no(), no('a homeserver'), no(), yes()] },
  { what: 'Messages no server can read', cells: [yes(), no(), yes(), part('private rooms'), no(), yes()] },
  { what: 'Invite-only rooms that outsiders cannot find', cells: [yes(), part(), part(), part(), part(), part()] },
  { what: 'Text and voice channels, with roles and bans', cells: [yes(), yes(), no(), yes(), part('voice first'), part('basic')] },
  { what: 'Screen sharing', cells: [yes('Windows and Android 14+'), yes(), yes(), part(), no(), yes()] },
  { what: 'Free and open source', cells: [yes('GPL'), no(), yes(), yes(), no(), yes()] },
  { what: 'No company holding your data, no tracking', cells: [yes(), no(), part(), part('your homeserver'), part(), yes()] },
  { what: 'Backup and sync you can host yourself, optional', cells: [yes(), no('n/a'), no(), no('n/a'), no('n/a'), no()] },
];

/** Where Yaparr is not the best choice, said plainly. */
export const LIMITS = [
  'A very large community. Rooms of a few dozen are tested; thousands of people are not something Yaparr is built or tested for.',
  'Messages that must arrive while everyone is offline. Nothing is stored, apart from the optional seven-day copy that a Yaparr Cloud account can leave for people who are away.',
  'Hiding where you are. The other people in a room see your IP address, because your computers connect to each other.',
  'An independent audit. The protocol has not had one yet.',
  'iPhone, iPad or the browser. Yaparr runs on Windows, Linux and Android.',
];

const MARK: Record<Answer, string> = { yes: '✓', no: '✗', part: '~' };
const WORD: Record<Answer, string> = { yes: 'Yes', no: 'No', part: 'Partly' };

@Component({
  selector: 'app-compare',
  template: `
    <section class="wrap compare-table" id="compare">
      <h2>Why Yaparr instead of&hellip;</h2>
      <p class="intro">
        Yaparr does what a chat app for friends and groups does, without a company's server in the middle. Here is how that
        compares with five well-known choices.
      </p>

      <div class="table-scroll" tabindex="0" role="region" aria-label="Comparison of Yaparr with other chat apps">
        <table>
          <caption class="sr">Which chat apps do what</caption>
          <thead>
            <tr>
              <td></td>
              @for (app of apps; track app; let first = $first) {
                <th scope="col" [class.us]="first">{{ app }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.what) {
              <tr>
                <th scope="row">{{ row.what }}</th>
                @for (cell of row.cells; track $index; let first = $first) {
                  <td [class]="(first ? 'us ' : '') + 'a-' + cell.answer">
                    <span class="mark" aria-hidden="true">{{ mark[cell.answer] }}</span>
                    <span class="sr">{{ word[cell.answer] }}</span>
                    @if (cell.note) {
                      <span class="cell-note">{{ cell.note }}</span>
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
      <p class="fine">
        &#10003; yes, &#126; partly, &#10007; no. Based on each app's public documentation. If something here is out of date,
        please tell us.
      </p>

      <div class="grid why">
        @for (r of reasons; track r.title) {
          <article class="card">
            <h3>{{ r.title }}</h3>
            <p>{{ r.text }}</p>
          </article>
        }
      </div>

      <div class="card limits">
        <h3>Where Yaparr is not the best fit</h3>
        <ul>
          @for (l of limits; track l) {
            <li>{{ l }}</li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class Compare {
  protected readonly apps = APPS;
  protected readonly rows = ROWS;
  protected readonly limits = LIMITS;
  protected readonly mark = MARK;
  protected readonly word = WORD;
  protected readonly reasons = [
    { title: 'Nothing to sign up for or host', text: 'A room is a key you share. There is no account to make, no server to rent and no port to open.' },
    { title: 'No middleman in your conversations', text: 'Messages and voice go straight between the people in a room, encrypted. The room key is never sent to this website either.' },
    { title: 'Rooms nobody can find', text: 'Outsiders cannot see a room or who is in it, and a new room key makes a ban hold.' },
    { title: 'A Discord-style room without Discord', text: 'Text and voice channels, replies, mentions, pictures and GIFs, a soundboard, roles and bans, and screen sharing.' },
    { title: 'Open, with no tracking', text: 'Free under the GNU GPL, with no accounts and no telemetry. Backup and sync through Yaparr Cloud is optional, and nothing in the app is held back for those who pay.' },
    { title: 'Copes with hard networks', text: 'Hole punching, relaying through members, your own relay server, a built-in WireGuard client, and a gateway for networks that block UDP.' },
  ];
}
