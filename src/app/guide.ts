import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Choice, NODES, Node, START, isPage, nodeById } from './guide-data';
import { Rich } from './rich';

/**
 * Where you are in the guide is the part of the address after the #: the screens you have been through, with slashes between (for example
 * #phone/phone-where/phone-link). So the browser's Back button works, and a link can be sent to someone to show them a screen. Nothing is stored
 * and nothing leaves the page.
 */
@Component({
  selector: 'app-guide',
  imports: [RouterLink, Rich],
  template: `
    <section class="wrap guide">
      <h1>Set up your Yaparr profile</h1>
      <p class="intro">Answer a couple of questions and this page shows the steps for you, with the names of the buttons as the app shows them.</p>

      @if (trail().length > 1) {
        <nav class="crumbs" aria-label="Your answers so far">
          <a routerLink="/guide" class="crumb-reset">Start over</a>
          @for (c of answers(); track $index) {
            <span aria-hidden="true">›</span><span>{{ c }}</span>
          }
        </nav>
      }

      @let n = node();
      <article class="panel guide-card" [attr.aria-live]="'polite'">
        <h2>{{ n.title }}</h2>
        @if (n.intro) {
          <p class="guide-intro">{{ n.intro }}</p>
        }

        @if (n.choices; as choices) {
          <ul class="choices">
            @for (c of choices; track c.to) {
              <li>
                <a class="choice" [routerLink]="targetPath(c)" [fragment]="targetFragment(c)">
                  <strong>{{ c.label }}</strong>
                  @if (c.hint) {
                    <span>{{ c.hint }}</span>
                  }
                </a>
              </li>
            }
          </ul>
        }

        @if (n.steps; as steps) {
          <ol class="guide-steps">
            @for (s of steps; track $index) {
              <li [class.done]="isDone($index)">
                <label class="step-check">
                  <input type="checkbox" [checked]="isDone($index)" (change)="toggle($index)" />
                  <span class="step-body">
                    <span class="step-line">
                      <app-rich [text]="s.text" />
                    </span>
                    @if (s.more) {
                      <span class="step-more">
                        <app-rich [text]="s.more" />
                      </span>
                    }
                    @if (s.warn) {
                      <span class="step-warn"><strong>Careful: </strong>{{ s.warn }}</span>
                    }
                  </span>
                </label>
              </li>
            }
          </ol>
          @if (n.note) {
            <p class="hint">{{ n.note }}</p>
          }
        }

        @if (n.after; as after) {
          <h3 class="next">What next?</h3>
          <ul class="choices">
            @for (c of after; track c.to) {
              <li>
                <a class="choice" [routerLink]="targetPath(c)" [fragment]="targetFragment(c)">
                  <strong>{{ c.label }}</strong>
                  @if (c.hint) {
                    <span>{{ c.hint }}</span>
                  }
                </a>
              </li>
            }
          </ul>
        }

        @if (trail().length > 1) {
          <p class="back"><a [routerLink]="backPath()" [fragment]="backFragment()">‹ Back</a></p>
        }
      </article>

      <p class="note guide-foot">
        Yaparr Cloud is optional and never needed to chat. <a routerLink="/guide/cloud">See what it saves you</a>.
      </p>
    </section>
  `,
})
export class Guide {
  private readonly route = inject(ActivatedRoute);
  private readonly ticked = signal<ReadonlySet<string>>(new Set());

  /** The ids of the screens visited, oldest first, always starting with the first screen. Anything it does not recognise is dropped. */
  protected readonly trail = toSignal(this.route.fragment.pipe(map(parseTrail)), { initialValue: [START] });
  protected readonly node = computed<Node>(() => nodeById(this.trail().at(-1)!) ?? NODES[0]);
  protected readonly answers = computed(() =>
    this.trail().slice(1).map(id => nodeById(id)?.title ?? id),
  );

  protected targetPath(c: Choice): string {
    return isPage(c.to) ? c.to : '/guide';
  }

  protected targetFragment(c: Choice): string | undefined {
    if (isPage(c.to)) return undefined;
    return c.to === START ? undefined : [...this.trail().slice(1), c.to].join('/');
  }

  protected backPath(): string {
    return '/guide';
  }

  protected backFragment(): string | undefined {
    const earlier = this.trail().slice(1, -1);
    return earlier.length ? earlier.join('/') : undefined;
  }

  protected isDone(i: number): boolean {
    return this.ticked().has(this.node().id + ':' + i);
  }

  protected toggle(i: number): void {
    const key = this.node().id + ':' + i;
    this.ticked.update(s => {
      const next = new Set(s);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  }
}

/** Reads the screens out of the fragment: only ids that exist are kept, and the guide always starts at its first screen. */
export function parseTrail(fragment: string | null): string[] {
  const ids = (fragment ?? '').split('/').filter(id => id !== START && nodeById(id) !== undefined);
  return [START, ...ids];
}
