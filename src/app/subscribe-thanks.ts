import { Component } from '@angular/core';
import { ACCOUNT_PAGE } from './plan';
import { Downloads } from './downloads.component';

/** Where someone lands if the page that follows a payment could not finish by itself: short, and says what to do. */
@Component({
  selector: 'app-subscribe-thanks',
  imports: [Downloads],
  template: `
    <section class="wrap link-page">
      <div class="panel">
        <img class="panel-icon" src="yaparr-icon.svg" alt="" width="64" height="64" />
        <h1>Thank you</h1>
        <p>
          Your payment has been sent to Polar. It can take a minute to reach Yaparr Cloud. If you were asked to choose a password, do that
          on the page you were sent back to. If you already had an account, sign in at
          <a [href]="account">cloud.yaparr.com</a> to see where it stands.
        </p>
        <hr />
        <h2>Don't have Yaparr yet?</h2>
        <app-downloads [compact]="true" />
      </div>
    </section>
  `,
})
export class SubscribeThanks {
  protected readonly account = ACCOUNT_PAGE;
}
