import { Component, inject, input } from '@angular/core';
import { ReleaseInfo } from './release';
import { RELEASES_PAGE } from './downloads';

@Component({
  selector: 'app-downloads',
  template: `
    @let p = info.plan();
    <div class="downloads" [class.compact]="compact()">
      @if (p.primary; as primary) {
        <a class="button large" [href]="primary.url">Download for {{ systemName() }}</a>
        <p class="meta">{{ primary.label }} · {{ primary.detail }}</p>
      } @else {
        <p class="meta">Yaparr is for Windows and Linux. Pick a download for another computer:</p>
      }
      @if (p.others.length) {
        <details class="others" [open]="!p.primary">
          <summary>{{ p.primary ? 'Other downloads' : 'Downloads' }}</summary>
          <ul>
            @for (d of p.others; track d.url) {
              <li><a [href]="d.url">{{ d.label }}</a><span>{{ d.detail }}</span></li>
            }
            <li><a [href]="releasesPage">All releases and older versions</a></li>
          </ul>
        </details>
      }
    </div>
  `,
})
export class Downloads {
  protected readonly info = inject(ReleaseInfo);
  protected readonly releasesPage = RELEASES_PAGE;
  readonly compact = input(false);

  protected systemName(): string {
    return this.info.platform().os === 'windows' ? 'Windows' : 'Linux';
  }
}
