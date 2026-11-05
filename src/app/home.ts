import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <main>
      <img class="logo" src="yaparr-logo.svg" alt="Yaparr" width="320" />
      <p>
        Serverless chat, voice calls and screen sharing. Peers find each other on the BitTorrent DHT and talk directly, with
        no server in the middle.
      </p>
      <p class="actions">
        <a class="button" href="https://github.com/zburtle/Yaparr/releases/latest">Download</a>
        <a class="button secondary" href="https://github.com/zburtle/Yaparr">Source on GitHub</a>
      </p>
      <p class="note">On Linux, <a href="https://flatpak.yaparr.com">install the Flatpak</a> to get updates with the rest of your software.</p>
    </main>
  `,
})
export class Home {}
