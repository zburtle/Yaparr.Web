import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { CONTENT } from './learn-content';
import { ACCOUNT_PAGE, PRICE_MONTH, PRICE_YEAR, REFUND_LAW, REFUND_RULES, START_ACTION } from './plan';
import { Subscribe } from './subscribe';

async function page(url: string): Promise<HTMLElement> {
  TestBed.resetTestingModule();   // a test may look at more than one page
  TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url);
  return harness.routeNativeElement as HTMLElement;
}

describe('the subscription page', () => {
  it('posts the email address and the interval to the Yaparr Cloud server and to nowhere else', async () => {
    const el = await page('/subscribe');
    const form = el.querySelector('form.subscribe')!;
    expect(form.getAttribute('method')).toBe('post');
    expect(form.getAttribute('action')).toBe(START_ACTION);
    expect(START_ACTION).toBe('https://cloud.yaparr.com/billing/start');
    expect(form.querySelector('input[name="email"][type="email"][required]')).toBeTruthy();
    const intervals = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="interval"]'));
    expect(intervals.map(i => i.value)).toEqual(['monthly', 'yearly']);
    expect(intervals[0].checked).toBe(true);
    // Nothing else is typed here: no password, no card.
    expect(form.querySelector('input[type="password"]')).toBeNull();
    expect(el.querySelectorAll('form').length).toBe(1);
  });

  it('says the price, that there is no trial, and who sells it', async () => {
    const text = (await page('/subscribe')).textContent!;
    expect(PRICE_MONTH).toBe('$4');
    expect(PRICE_YEAR).toBe('$40');
    expect(text).toContain(`${PRICE_MONTH} a month`);
    expect(text).toContain(`${PRICE_YEAR} a year`);
    expect(text).toContain('There is no trial');
    expect(text).toContain('Polar');
    expect(text).toContain('stay free');
  });

  it('says every refund rule and the sentence about the law, word for word', async () => {
    const text = (await page('/subscribe')).textContent!.replace(/\s+/g, ' ');
    for (const rule of REFUND_RULES) expect(text).toContain(rule);
    expect(text).toContain(REFUND_LAW);
    expect(text).toContain('48 hours');
    expect(text).toContain('14 days');
  });

  it('says what happens when a subscription ends, and that nothing is deleted', async () => {
    const text = (await page('/subscribe')).textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('three days');
    expect(text).toContain('new device');
    expect(text).toContain('Nothing is deleted');
  });

  it('links to where someone who has an account looks after the subscription, and to where a refund is asked for', async () => {
    const el = await page('/subscribe');
    expect(Array.from(el.querySelectorAll('a')).some(a => a.getAttribute('href')?.endsWith('/issues'))).toBe(true);
    expect(el.querySelector(`a[href="${ACCOUNT_PAGE}"]`)).toBeTruthy();
  });

  it('is a page that exists, with its thanks page, and the privacy title is a real title', () => {
    const paths = routes.map(r => r.path);
    expect(paths).toContain('subscribe');
    expect(paths).toContain('subscribe/thanks');
    for (const r of routes) if (typeof r.title === 'string') expect(r.title, String(r.path)).not.toContain('�');
    expect(Subscribe).toBeDefined();
  });
});

describe('what the Google Play build links to', () => {
  // The Play build links to the guides, and Google's payments policy does not let it lead anywhere that sells: so the guides, and the shell around them, never do.
  it('has no link to the subscription page in the site header or footer', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const f = TestBed.createComponent(App);
    f.detectChanges();
    const links = Array.from((f.nativeElement as HTMLElement).querySelectorAll('a')).map(a => a.getAttribute('href') ?? a.getAttribute('ng-reflect-router-link') ?? '');
    for (const href of links) expect(href).not.toMatch(/subscribe|billing|account\/subscription/);
  });

  it('has guides that say nothing about prices or how to subscribe', () => {
    const lines = [...CONTENT.intro, ...CONTENT.listed];
    for (const p of CONTENT.pages) for (const s of p.sections) for (const b of s.blocks) lines.push(...(b.k === 'p' ? [b.i] : b.items));
    const text = JSON.stringify(lines).toLowerCase();
    expect(text).not.toMatch(/subscribe|subscription|\$\d|per month|a month|polar\b|billing/);
    expect(text).not.toContain('/subscribe');
  });
});

describe('what the pages say about email', () => {
  it('never promises that nothing is emailed, because Yaparr Cloud now emails the links a person asks for', async () => {
    for (const url of ['/subscribe', '/privacy']) {
      const text = (await page(url)).textContent!.replace(/\s+/g, ' ');
      expect(text, url).not.toMatch(/nothing is (ever )?emailed to you by Yaparr|nothing is ever emailed/i);
    }
    const subscribe = (await page('/subscribe')).textContent!.replace(/\s+/g, ' ');
    expect(subscribe).toContain('emails you a link to choose your password');
    expect(subscribe).toContain('the only email Yaparr sends');
  });
});
