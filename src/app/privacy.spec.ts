import { TestBed } from '@angular/core/testing';
import { Privacy } from './privacy';

describe('Privacy', () => {
  it('names where to delete an account', async () => {
    await TestBed.configureTestingModule({ imports: [Privacy] }).compileComponents();
    const f = TestBed.createComponent(Privacy);
    f.detectChanges();
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('privacy policy');
    expect(el.querySelector('a[href="https://cloud.yaparr.com/account/delete"]')).toBeTruthy();
  });

  it('says who takes payments and what is kept about them', async () => {
    await TestBed.configureTestingModule({ imports: [Privacy] }).compileComponents();
    const f = TestBed.createComponent(Privacy);
    f.detectChanges();
    const text = (f.nativeElement as HTMLElement).textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('Polar');
    expect(text).toContain('We never see your card');
    expect(text).toContain('is ended at Polar');
  });

  it('says what Yaparr Cloud emails, who delivers it, and that it never sends anything else', async () => {
    await TestBed.configureTestingModule({ imports: [Privacy] }).compileComponents();
    const f = TestBed.createComponent(Privacy);
    f.detectChanges();
    const text = (f.nativeElement as HTMLElement).textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('Email from Yaparr Cloud');
    expect(text).toContain('a link that you asked for');
    expect(text).toContain('never sends marketing');
    expect(text).toContain('SMTP2GO');
    expect(text).not.toContain('nothing is ever emailed');   // the old promise, no longer true
  });
});
