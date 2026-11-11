import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Downloads } from './downloads.component';
import { SignupLink, parseSignupLink, signupAction } from './signup-link';

/**
 * The page a sign-up link opens. It reads the server and the code from the fragment, shows which server the account will be on, and posts the email
 * address and the code to that server's own /signup as an ordinary form, so the browser goes there to choose a password. Nothing is read or sent by
 * script, and nothing about the link or the person reaches this site's host.
 */
@Component({
  selector: 'app-signup',
  imports: [Downloads],
  template: `
    <section class="wrap link-page">
      <div class="panel">
        <img class="panel-icon" src="yaparr-icon.svg" alt="" width="64" height="64" />
        @if (link; as l) {
          <h1>Sign up for Yaparr</h1>
          <p>You have been invited to an account on the backup server <strong>{{ l.host }}</strong>, with a lifetime pass.</p>
          <form class="signup" method="post" [attr.action]="action">
            <input type="hidden" name="code" [value]="l.code" />
            <label for="email">Your email address</label>
            <input id="email" name="email" type="email" autocomplete="email" autocapitalize="none" spellcheck="false" maxlength="254" required />
            <p class="actions"><button class="button large" type="submit">Sign up</button></p>
          </form>
          <p class="note">
            This sends your email address and the code from your link to <strong>{{ l.host }}</strong>, which then asks you to choose a
            password on its own page. No password is typed here, and the code never reaches yaparr.com. Nothing is emailed to you. Only
            continue if the person who sent you the link runs {{ l.host }}.
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
export class Signup {
  protected readonly link: SignupLink | null = parseSignupLink(inject(ActivatedRoute).snapshot.fragment);
  protected readonly action: string | null = this.link ? signupAction(this.link.server) : null;

  constructor() {
    // The code is a secret: take it out of the address bar and history so it does not linger there or get shared by accident.
    if (this.link) history.replaceState(history.state, '', location.pathname);
  }
}
