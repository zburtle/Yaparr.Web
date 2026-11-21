import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { Learn, LearnPage, pageBySlug } from './learn';
import { CONTENT } from './learn-content';
import type { Inline } from './learn-types';

// What the apps link to (Guides.Topics in the Yaparr repository): a guide and the heading about the setting. A link that goes nowhere is the one thing these pages must never have.
const FROM_THE_APPS = [
  'yaparr-cloud#what-yaparr-cloud-is', 'yaparr-cloud#syncing', 'yaparr-cloud#messages-for-people-who-are-away', 'yaparr-cloud#when-your-network-blocks-udp',
  'yaparr-cloud#push-notifications', 'yaparr-cloud#the-sync-key', 'notifications#notifications', 'notifications#staying-connected-in-the-background',
  'link-previews', 'updates', 'accounts#backups', 'accounts#starting-on-a-new-device', 'accounts#logging-out', 'rooms#replacing-a-rooms-key',
  'rooms#the-gif-shelf', 'rooms#the-soundboard', 'networks', 'networks#wireguard-vpn', 'networks#turn-relay', 'screen-sharing#sharing-a-window-or-a-screen',
  'screen-sharing#picture-formats', 'screen-sharing#quality-that-adjusts', 'screen-sharing#sound', 'voice',
];

function everyLine(): Inline[][] {
  const lines: Inline[][] = [...CONTENT.intro, ...CONTENT.listed];
  for (const p of CONTENT.pages)
    for (const s of p.sections)
      for (const b of s.blocks) lines.push(...(b.k === 'p' ? [b.i] : b.items));
  return lines;
}

describe('the guides', () => {
  it('has a guide for each slug, once, and a title for each', () => {
    const slugs = CONTENT.pages.map(p => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of CONTENT.pages) expect(p.title, p.slug).not.toBe('');
  });

  it('has headings that are anchors, once each in a guide', () => {
    for (const p of CONTENT.pages) {
      const ids = p.sections.filter(s => s.heading).map(s => s.id);
      expect(new Set(ids).size, p.slug).toBe(ids.length);
    }
  });

  it('has everything the apps link to', () => {
    for (const target of FROM_THE_APPS) {
      const [slug, id] = target.split('#');
      const page = pageBySlug(slug);
      expect(page, target).toBeDefined();
      if (id) expect(page!.sections.map(s => s.id), target).toContain(id);
    }
  });

  it('only links to guides and headings that exist', () => {
    for (const line of everyLine())
      for (const part of line) {
        if (part.k !== 'link') continue;
        if (part.href) expect(part.href).toMatch(/^https:\/\//);
        else if (part.to === '/learn') continue;
        else {
          const page = pageBySlug(part.to?.replace('/learn/', ''));
          expect(page, part.to).toBeDefined();
          if (part.fragment) expect(page!.sections.map(s => s.id), `${part.to}#${part.fragment}`).toContain(part.fragment);
        }
      }
  });

  it('lists every guide on the index', () => {
    const listed = CONTENT.listed.map(item => item.find(p => p.k === 'link' && p.to)).map(l => (l as { to: string }).to.replace('/learn/', ''));
    expect([...listed].sort()).toEqual(CONTENT.pages.map(p => p.slug).sort());
  });

  it('has a route for the index and for a guide', () => {
    expect(routes.find(r => r.path === 'learn')?.component).toBe(Learn);
    expect(routes.find(r => r.path === 'learn/:slug')?.component).toBe(LearnPage);
  });

  it('shows the index and a guide', async () => {
    await TestBed.configureTestingModule({ providers: [provideRouter(routes)] }).compileComponents();
    const harness = await RouterTestingHarness.create();

    const index = await harness.navigateByUrl('/learn', Learn);
    expect(index).toBeInstanceOf(Learn);
    expect(harness.routeNativeElement!.textContent).toContain('Yaparr Cloud');
    expect(harness.routeNativeElement!.querySelectorAll('li.card').length).toBe(CONTENT.pages.length);

    await harness.navigateByUrl('/learn/yaparr-cloud', LearnPage);
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toBe('Yaparr Cloud');
    expect(harness.routeNativeElement!.querySelector('#the-sync-key h2')!.textContent).toBe('The Sync key');
  });

  it('says so for a guide that is not there', async () => {
    await TestBed.configureTestingModule({ providers: [provideRouter(routes)] }).compileComponents();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/learn/nope', LearnPage);
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toContain('no guide');
  });
});
