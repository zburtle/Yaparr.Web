import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ResolveFn, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CONTENT } from './learn-content';
import type { Inline, Page } from './learn-types';

/** The guide for a slug, or undefined. */
export function pageBySlug(slug: string | null | undefined): Page | undefined {
  return CONTENT.pages.find(p => p.slug === slug);
}

/** The title of the tab for /learn/:slug. */
export const learnTitle: ResolveFn<string> = route => `${pageBySlug(route.paramMap.get('slug'))?.title ?? 'Guides'} · Yaparr`;

/** A line of a guide: its marks and links are shown as elements and never as HTML. Its template has no spaces between pieces, so punctuation stays against the word before it. */
@Component({
  selector: 'app-inline',
  imports: [RouterLink],
  template: `@for (p of parts(); track $index) {@switch (p.k) {@case ('strong') {<strong>{{ p.t }}</strong>}@case ('em') {<em>{{ p.t }}</em>}@case ('code') {<code>{{ p.t }}</code>}@case ('link') {@if (p.to) {<a [routerLink]="p.to" [fragment]="p.fragment">{{ p.t }}</a>} @else {<a [href]="p.href">{{ p.t }}</a>}}@default {{{ p.t }}}}}`,
})
export class InlineText {
  readonly parts = input.required<readonly Inline[]>();
}

/** The list of guides, /learn. */
@Component({
  selector: 'app-learn',
  imports: [InlineText],
  template: `
    <section class="wrap guide learn">
      <h1>{{ content.title }}</h1>
      @for (p of content.intro; track $index) {
        <p class="intro"><app-inline [parts]="p" /></p>
      }
      <ul class="learn-list">
        @for (item of content.listed; track $index) {
          <li class="card"><app-inline [parts]="item" /></li>
        }
      </ul>
    </section>
  `,
})
export class Learn {
  protected readonly content = CONTENT;
}

/** One guide, /learn/:slug. A heading is an anchor, so the apps can link straight to the part that explains a setting. */
@Component({
  selector: 'app-learn-page',
  imports: [InlineText, RouterLink],
  template: `
    <section class="wrap guide learn">
      @if (page(); as p) {
        <h1>{{ p.title }}</h1>
        @for (s of p.sections; track $index) {
          <section [id]="s.id ?? null">
            @if (s.heading) {
              <h2>{{ s.heading }}</h2>
            }
            @for (b of s.blocks; track $index) {
              @if (b.k === 'p') {
                <p><app-inline [parts]="b.i" /></p>
              } @else {
                <ul>
                  @for (item of b.items; track $index) {
                    <li><app-inline [parts]="item" /></li>
                  }
                </ul>
              }
            }
          </section>
        }
      } @else {
        <h1>There is no guide here</h1>
      }
      <p class="actions"><a class="button secondary" routerLink="/learn">All guides</a></p>
    </section>
  `,
})
export class LearnPage {
  private readonly slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map(m => m.get('slug'))), { initialValue: null });
  protected readonly page = computed(() => pageBySlug(this.slug()));
}
