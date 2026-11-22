import { DEFAULT_SERVER } from './signup-link';

/**
 * What the Yaparr Cloud subscription is, in one place, so the page and its tests agree. The server is the one in {@link DEFAULT_SERVER}: the form posts
 * there, the payment page and the account pages are its, and this site never sees a password, a card or an answer from the payment provider.
 *
 * Nothing here is linked from the guides, and the guides say nothing about prices or how to subscribe: the Google Play build of the app links to the guides, and
 * Google's payments policy does not let it lead anywhere that sells (see docs/billing.md, "Android and Google Play", in the Yaparr repository).
 */
export const PRICE_MONTH = '$4';
export const PRICE_YEAR = '$40';

/** Where the form is posted: the server starts the payment, whoever is paying. */
export const START_ACTION = `${DEFAULT_SERVER}/billing/start`;

/** Where someone who already has an account looks after the subscription. */
export const ACCOUNT_PAGE = `${DEFAULT_SERVER}/account/subscription`;

/** The refund rules, as published. The wording is the design's (docs/billing.md, "Refunds"); change them together. */
export const REFUND_RULES: readonly string[] = [
  'Monthly: a full refund if you ask within 48 hours of the payment.',
  'Yearly: a refund of the unused time, prorated, whenever you ask: the price times the days left in the period over the days in it, counted from the day you ask, rounded down to the cent.',
  'Otherwise there is no refund, unless there are special circumstances, which are decided case by case.',
];

/** The sentence about the law that goes with the rules. */
export const REFUND_LAW =
  'If you live where the law gives you a right to withdraw from an online purchase (the EU and the UK give 14 days), that right applies, and we refund the unused part of what you paid.';
