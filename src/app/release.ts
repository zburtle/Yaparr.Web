import { Injectable, computed, signal } from '@angular/core';
import { Release, downloadsFor, parseRelease } from './downloads';
import { Platform, currentPlatform } from './platform';

/** Finds the newest Yaparr release and the visitor's system, once per page load. Nothing is sent to GitHub but the request itself. */
@Injectable({ providedIn: 'root' })
export class ReleaseInfo {
  readonly release = signal<Release | null>(null);
  readonly platform = signal<Platform>({ os: 'other', arch: 'x64' });
  readonly plan = computed(() => downloadsFor(this.platform(), this.release()));

  constructor() {
    void currentPlatform().then(p => this.platform.set(p));
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const response = await fetch('https://api.github.com/repos/zburtle/Yaparr/releases/latest', {
        headers: { Accept: 'application/vnd.github+json' },
        referrerPolicy: 'no-referrer',
      });
      if (response.ok) this.release.set(parseRelease(await response.json()));
    } catch {
      // Offline, blocked or rate limited: the page still offers the releases page.
    }
  }
}
