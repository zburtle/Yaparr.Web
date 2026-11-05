import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkKind, appLink, validate } from './links';

const RELEASES = 'https://github.com/zburtle/Yaparr/releases/latest';

@Component({
  selector: 'app-open-link',
  template: `
    <main>
      @if (target(); as t) {
        <h1>{{ kind === 'join' ? 'Join a room in Yaparr' : 'Start a chat in Yaparr' }}</h1>
        <p>
          @if (kind === 'join') { Opening Yaparr to join the room. } @else { Opening Yaparr to start the chat. }
          Yaparr will ask you to confirm before anything happens.
        </p>
        <p class="actions">
          <a class="button" [href]="t">Open Yaparr</a>
          <a class="button secondary" [href]="releases">Get Yaparr</a>
        </p>
        <p class="note">
          The part of this link that identifies {{ kind === 'join' ? 'the room' : 'the person' }} stays in your browser: it is
          never sent to yaparr.com.
        </p>
      } @else {
        <h1>That link doesn't look right</h1>
        <p>It may have been cut short when it was copied. Ask the person who sent it for a new one.</p>
        <p class="actions"><a class="button secondary" href="/">Back to Yaparr</a></p>
      }
    </main>
  `,
})
export class OpenLink {
  protected readonly kind: LinkKind = inject(ActivatedRoute).snapshot.data['kind'];
  protected readonly releases = RELEASES;
  protected readonly target = signal<string | null>(null);

  constructor() {
    const value = validate(this.kind, inject(ActivatedRoute).snapshot.fragment);
    if (value === null) return;
    const link = appLink(this.kind, value);
    this.target.set(link);
    // Take the secret out of the address bar and history so it does not linger there or get shared by accident.
    history.replaceState(history.state, '', location.pathname);
    // Browsers ask before handing a link to an app; if Yaparr is not installed nothing happens and the buttons remain.
    location.href = link;
  }
}
