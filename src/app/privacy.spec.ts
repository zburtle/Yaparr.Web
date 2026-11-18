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
});
