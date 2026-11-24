import { TestBed } from '@angular/core/testing';
import { APPS, Compare, LIMITS, ROWS } from './compare';

describe('Compare', () => {
  it('has an answer for every app in every row', () => {
    for (const row of ROWS) expect(`${row.what}: ${row.cells.length}`).toBe(`${row.what}: ${APPS.length}`);
  });

  it('puts Yaparr first and says where it falls short', () => {
    expect(APPS[0]).toBe('Yaparr');
    expect(LIMITS.length).toBeGreaterThan(0);
  });

  it('draws a column for each app and a row for each question', async () => {
    await TestBed.configureTestingModule({ imports: [Compare] }).compileComponents();
    const fixture = TestBed.createComponent(Compare);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('thead th').length).toBe(APPS.length);
    expect(el.querySelectorAll('tbody tr').length).toBe(ROWS.length);
    expect(el.querySelectorAll('td.us').length).toBe(ROWS.length);
    expect(el.textContent).toContain('Where Yaparr is not the best fit');
  });
});
