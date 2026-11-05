import { Component } from '@angular/core';

/** Four plain-language steps, each with a small diagram drawn in the site's own colours (see the .d-* rules in styles.css). */
@Component({
  selector: 'app-how-it-works',
  template: `
    <section class="wrap explain" id="behind-the-scenes">
      <h2>What happens behind the scenes</h2>
      <p class="intro">
        Most chat apps send everything through a company's computer in the middle. Yaparr has no such computer, so here is how
        your friends find you anyway.
      </p>

      <div class="step-row">
        <div class="step-text">
          <span class="step-no">1</span>
          <h3>A room starts as a secret</h3>
          <p>
            When you make a room, Yaparr creates a long random key, like a password that only your group knows. From it, Yaparr
            works out a code name for a meeting spot. The code name can't be turned back into the key, so knowing it doesn't get
            anyone into your room.
          </p>
        </div>
        <figure class="diagram">
          <svg viewBox="0 40 360 130" role="img" aria-labelledby="d1">
            <title id="d1">A secret room key is scrambled into a code name for a meeting spot</title>
            <rect class="d-box" x="14" y="62" width="120" height="86" rx="12" />
            <circle class="d-accent-line" cx="52" cy="93" r="11" />
            <path class="d-accent-line" d="M63 93 H100 M90 93 V103 M99 93 V101" />
            <text class="d-text" x="74" y="127" text-anchor="middle">Room key</text>
            <text class="d-sub" x="74" y="142" text-anchor="middle">only your group has it</text>

            <path class="d-flow" d="M142 105 H206" />
            <polygon class="d-accent-fill" points="214,105 204,99 204,111" />
            <text class="d-sub" x="177" y="92" text-anchor="middle">scramble</text>
            <text class="d-sub" x="177" y="128" text-anchor="middle">one way only</text>

            <rect class="d-box" x="226" y="62" width="120" height="86" rx="12" />
            <text class="d-big" x="286" y="104" text-anchor="middle">#</text>
            <text class="d-text" x="286" y="127" text-anchor="middle">Meeting spot</text>
            <text class="d-sub" x="286" y="142" text-anchor="middle">code name 4c1e…</text>
          </svg>
        </figure>
      </div>

      <div class="step-row">
        <div class="step-text">
          <span class="step-no">2</span>
          <h3>Leave a note at the meeting spot</h3>
          <p>
            Yaparr uses the BitTorrent network: a huge public noticeboard, run by ordinary computers around the world, with
            nobody in charge. Your computer leaves a note under your room's code name saying how to reach it. Without the key,
            nobody can tell which code name is yours or what it is for.
          </p>
        </div>
        <figure class="diagram">
          <svg viewBox="0 0 360 210" role="img" aria-labelledby="d2">
            <title id="d2">Your computer leaves a note on a huge shared network, under the room's code name</title>
            <rect class="d-cloud" x="180" y="20" width="166" height="166" rx="26" />
            @for (d of dots; track $index) {
              <circle class="d-dot" [attr.cx]="d[0]" [attr.cy]="d[1]" r="4" />
            }
            <circle class="d-ring" cx="248" cy="92" r="11" />
            <circle class="d-accent-fill" cx="248" cy="92" r="6" />
            <text class="d-sub" x="263" y="204" text-anchor="middle">The BitTorrent network</text>

            <rect class="d-box" x="18" y="84" width="64" height="44" rx="6" />
            <path class="d-line" d="M50 128 V138 M36 140 H64" />
            <text class="d-text" x="50" y="162" text-anchor="middle">You</text>

            <path class="d-flow" d="M90 106 C130 106 190 94 232 93" />
            <polygon class="d-accent-fill" points="238,93 228,87 228,99" />
            <text class="d-sub" x="125" y="140" text-anchor="middle">leaves a note:</text>
            <text class="d-sub" x="125" y="154" text-anchor="middle">“reach me here”</text>
          </svg>
        </figure>
      </div>

      <div class="step-row">
        <div class="step-text">
          <span class="step-no">3</span>
          <h3>Find each other, then connect directly</h3>
          <p>
            A friend with the same key works out the same code name, reads the note and gets your address. Both computers then
            reach out to each other at the same moment, which is how they get past home routers and firewalls. From then on they
            talk directly, and the connection is encrypted.
          </p>
        </div>
        <figure class="diagram">
          <svg viewBox="0 0 360 210" role="img" aria-labelledby="d3">
            <title id="d3">Two friends look up the same code name, then connect straight to each other</title>
            <rect class="d-cloud" x="120" y="10" width="120" height="56" rx="16" />
            <circle class="d-dot" cx="146" cy="26" r="3.5" /><circle class="d-dot" cx="170" cy="22" r="3.5" />
            <circle class="d-dot" cx="196" cy="30" r="3.5" /><circle class="d-dot" cx="220" cy="24" r="3.5" />
            <circle class="d-dot" cx="158" cy="42" r="3.5" /><circle class="d-dot" cx="186" cy="46" r="3.5" />
            <circle class="d-dot" cx="214" cy="44" r="3.5" />
            <text class="d-sub" x="180" y="60" text-anchor="middle">BitTorrent network</text>

            <path class="d-line d-dash" d="M54 108 Q58 58 116 40" />
            <path class="d-line d-dash" d="M306 108 Q302 58 244 40" />
            <text class="d-sub" x="180" y="88" text-anchor="middle">both ask: who is at #4c1e…?</text>

            <rect class="d-box" x="24" y="110" width="60" height="40" rx="6" />
            <path class="d-line" d="M54 150 V158 M42 160 H66" />
            <text class="d-text" x="54" y="182" text-anchor="middle">You</text>
            <rect class="d-box" x="276" y="110" width="60" height="40" rx="6" />
            <path class="d-line" d="M306 150 V158 M294 160 H318" />
            <text class="d-text" x="306" y="182" text-anchor="middle">Your friend</text>

            <path class="d-flow" d="M100 132 H260" />
            <polygon class="d-accent-fill" points="92,132 102,126 102,138" />
            <polygon class="d-accent-fill" points="268,132 258,126 258,138" />
            <text class="d-text" x="180" y="124" text-anchor="middle">Direct and encrypted</text>
            <text class="d-sub" x="180" y="150" text-anchor="middle">they knock at the same moment</text>
          </svg>
        </figure>
      </div>

      <div class="step-row">
        <div class="step-text">
          <span class="step-no">4</span>
          <h3>Messages travel between members</h3>
          <p>
            Everyone in a room connects to others in it, and messages are passed along between them. Each message is signed, so
            it's clear who sent it. If you were away, you catch up from whoever was online. Nothing is kept on a server,
            because there isn't one.
          </p>
        </div>
        <figure class="diagram">
          <svg viewBox="0 0 360 210" role="img" aria-labelledby="d4">
            <title id="d4">Members of a room connected to each other, passing a message along, with no server</title>
            @for (l of links; track $index) {
              <line [class]="l[4] ? 'd-flow' : 'd-line'" [attr.x1]="l[0]" [attr.y1]="l[1]" [attr.x2]="l[2]" [attr.y2]="l[3]" />
            }
            <rect class="d-mail" x="113" y="38" width="16" height="11" rx="2" />
            <path class="d-mail-fold" d="M113 39 L121 45 L129 39" />
            @for (p of people; track $index) {
              <circle class="d-box" [attr.cx]="p[0]" [attr.cy]="p[1]" r="18" />
              <circle class="d-person" [attr.cx]="p[0]" [attr.cy]="p[1] - 5" r="5" />
              <path class="d-person" [attr.d]="'M' + (p[0] - 9) + ' ' + (p[1] + 11) + ' a9 9 0 0 1 18 0'" />
            }
            <rect class="d-box d-dash" x="302" y="150" width="40" height="26" rx="4" />
            <path class="d-line" d="M312 160 H332 M312 168 H332" />
            <path class="d-strike" d="M296 184 L348 142" />
            <text class="d-sub" x="322" y="202" text-anchor="middle">no server</text>
          </svg>
        </figure>
      </div>

      <p class="fine">
        A direct chat works the same way, using a person's ID in place of a room key. If a direct connection isn't possible on a
        strict network, other members can pass traffic along for you.
      </p>
    </section>
  `,
})
export class HowItWorks {
  /** Computers on the shared network: just scenery. */
  protected readonly dots: [number, number][] = [
    [200, 48], [232, 38], [264, 54], [304, 40], [332, 66], [208, 90], [288, 84], [322, 112], [198, 130],
    [230, 142], [268, 126], [306, 152], [334, 168], [212, 170], [254, 168], [292, 174],
  ];
  /** The people in a room, and the links between them: x1, y1, x2, y2, and whether the message travels along it. */
  protected readonly people: [number, number][] = [[60, 62], [180, 30], [300, 62], [110, 150], [240, 150]];
  protected readonly links: [number, number, number, number, boolean][] = [
    [60, 62, 180, 30, true], [180, 30, 300, 62, true], [180, 30, 240, 150, true],
    [60, 62, 110, 150, false], [110, 150, 240, 150, false], [300, 62, 240, 150, false], [180, 30, 110, 150, false],
  ];
}
