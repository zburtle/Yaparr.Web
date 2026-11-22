import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REPO } from './downloads';
import { ACCOUNT_PAGE, PRICE_MONTH, PRICE_YEAR, REFUND_LAW, REFUND_RULES, START_ACTION } from './plan';

/**
 * The Yaparr Cloud subscription: what it is, the price, what happens when it ends, the refund rules, and the form that starts a payment. The form is an ordinary
 * post to the Yaparr Cloud server, which makes the account, sends the browser to the payment page, and asks for the password on its own page afterwards: nothing is
 * read or sent by script, and no password, card or payment detail passes through this site.
 */
@Component({
  selector: 'app-subscribe',
  imports: [RouterLink],
  template: `
    <section class="wrap prose">
      <h1>Yaparr Cloud subscription</h1>

      <p>
        Yaparr works for free, with no account. <strong>Yaparr Cloud</strong> is an optional account on our server that keeps your devices
        in step, backs up your profile (locked so that we cannot read it), leaves messages and pictures for people who are away, and lets
        you chat on networks that block UDP. <a routerLink="/learn/yaparr-cloud">What it does and doesn't do</a>.
      </p>

      <h2>Price</h2>
      <p>
        <strong>{{ month }} a month</strong> or <strong>{{ year }} a year</strong>. There is no trial. Tax may be added when you pay.
        Payments are taken by <a href="https://polar.sh">Polar</a>, who is the seller and sends your receipt; we never see your card.
        Accounts made before there were paid plans, and accounts we have given a lifetime pass, stay free.
      </p>

      <h2>Subscribe</h2>
      <form class="subscribe" method="post" [attr.action]="action">
        <label for="email">Your email address</label>
        <input id="email" name="email" type="email" autocomplete="email" autocapitalize="none" spellcheck="false" maxlength="254" required />
        <fieldset>
          <legend>Pay</legend>
          <label class="choice"><input type="radio" name="interval" value="monthly" checked /> Monthly, {{ month }}</label>
          <label class="choice"><input type="radio" name="interval" value="yearly" /> Yearly, {{ year }}</label>
        </fieldset>
        <p class="actions"><button class="button large" type="submit">Go to payment</button></p>
      </form>
      <p class="note">
        This sends your email address to <strong>cloud.yaparr.com</strong>, which then sends you to Polar's page to pay. When you come
        back you choose your password on cloud.yaparr.com's own page, so no password is typed here. Your email address only names the
        account: nothing is emailed to you by Yaparr (Polar emails the receipt). If you already have an account, sign in instead:
        <a [href]="account">manage your subscription</a>.
      </p>

      <h2>When a subscription ends</h2>
      <p>
        If it is cancelled, or a payment fails and is not put right, the account keeps working until the end of the period you paid
        for, plus three days. After that it stops syncing, and it cannot be signed in on a new device, until it is renewed. Nothing is
        deleted: your data stays, you can still take your backup away, delete the account, and renew whenever you like. Devices that
        are already signed in keep their sign-in.
      </p>

      <h2>Refunds</h2>
      <ul>
        @for (rule of rules; track rule) {
          <li>{{ rule }}</li>
        }
      </ul>
      <p>{{ law }}</p>
      <p>
        When a refund goes through, the subscription ends with it. To ask for one, or if you paid and lost the page you were sent back
        to, open an issue on <a [href]="repo + '/issues'">the project's page</a> or ask whoever runs your server.
      </p>
    </section>
  `,
})
export class Subscribe {
  protected readonly repo = REPO;
  protected readonly action = START_ACTION;
  protected readonly account = ACCOUNT_PAGE;
  protected readonly month = PRICE_MONTH;
  protected readonly year = PRICE_YEAR;
  protected readonly rules = REFUND_RULES;
  protected readonly law = REFUND_LAW;
}
