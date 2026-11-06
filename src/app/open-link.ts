import { Component, OnDestroy, inject, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Downloads } from './downloads.component';
import { LinkKind, androidLink, appLink, validate } from './links';

@Component({
  selector: 'app-open-link',
  imports: [Downloads],
  template: `
    <section class="wrap link-page">
      <div class="panel">
        <img class="panel-icon" src="yaparr-icon.svg" alt="" width="64" height="64" />
        @if (target(); as t) {
          <h1>{{ kind === 'join' ? 'Join a room in Yaparr' : 'Start a chat in Yaparr' }}</h1>
          <p>
            @if (kind === 'join') { Opening Yaparr to join the room. } @else { Opening Yaparr to start the chat. }
            Yaparr will ask you to confirm before anything happens.
          </p>
          <p class="actions"><a class="button large" [href]="t">Open Yaparr</a></p>
          @if (unanswered()) {
            <p class="hint">Nothing happened? Yaparr may not be installed yet. Install it below, then open this link again.</p>
          }
          <p class="note">
            The part of this link that identifies {{ kind === 'join' ? 'the room' : 'the person' }} stays in your browser: it is
            never sent to yaparr.com.
          </p>
          <hr />
          <h2>Don't have Yaparr yet?</h2>
          <app-downloads [compact]="true" />
        } @else {
          <h1>That link doesn't look right</h1>
          <p>It may have been cut short when it was copied. Ask the person who sent it for a new one.</p>
          <p class="actions"><a class="button secondary" href="/">Back to Yaparr</a></p>
        }
      </div>
    </section>
  `,
})
export class OpenLink implements OnDestroy {
  protected readonly kind: LinkKind = inject(ActivatedRoute).snapshot.data['kind'];
  protected readonly target = signal<SafeUrl | null>(null);
  /** True when, a moment after trying to open the app, the page is still in front: the app probably did not take over. */
  protected readonly unanswered = signal(false);
  private timer?: ReturnType<typeof setTimeout>;
  private handedOff = false;
  private readonly onHandoff = () => { if (document.hidden || !document.hasFocus()) this.handedOff = true; };

  constructor() {
    const value = validate(this.kind, inject(ActivatedRoute).snapshot.fragment);
    if (value === null) return;
    // On Android the link is an intent that names the app, so nothing else can take it.
    const link = /android/i.test(navigator.userAgent) ? androidLink(this.kind, value) : appLink(this.kind, value);
    // Angular would rewrite a yaparr: or intent: address to "unsafe:"; this one is built only from a value that passed validate().
    this.target.set(inject(DomSanitizer).bypassSecurityTrustUrl(link));
    // Take the secret out of the address bar and history so it does not linger there or get shared by accident.
    history.replaceState(history.state, '', location.pathname);
    // Browsers ask before handing a link to an app; if Yaparr is not installed nothing happens and the buttons remain.
    window.addEventListener('blur', this.onHandoff);
    document.addEventListener('visibilitychange', this.onHandoff);
    location.href = link;
    this.timer = setTimeout(() => { if (!this.handedOff) this.unanswered.set(true); }, 2500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    window.removeEventListener('blur', this.onHandoff);
    document.removeEventListener('visibilitychange', this.onHandoff);
  }
}
