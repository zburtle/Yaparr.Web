import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { REPO } from './downloads';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="site-header">
      <div class="wrap bar">
        <a class="brand" routerLink="/"><img src="yaparr-icon.svg" alt="" width="32" height="32" /><span>Yaparr</span></a>
        <nav aria-label="Main">
          <a [href]="repo + '/tree/master/docs'">Docs</a>
          <a [href]="repo">GitHub</a>
        </nav>
      </div>
    </header>
    <router-outlet />
    <footer class="site-footer">
      <div class="wrap">
        <span>Yaparr is free software under the GNU GPL.</span>
        <nav aria-label="Footer">
          <a [href]="repo + '/releases'">Releases</a>
          <a href="https://flatpak.yaparr.com">Flatpak repository</a>
          <a [href]="repo + '/blob/master/docs/security.md'">Security</a>
          <a [href]="repo + '/issues'">Report a problem</a>
        </nav>
      </div>
    </footer>
  `,
})
export class App {
  protected readonly repo = REPO;
}
