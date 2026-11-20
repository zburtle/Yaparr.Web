import { Component, computed, input } from '@angular/core';
import { pieces } from './guide-data';

/** Text with **bold** and `code` marks, shown as elements and never as HTML. Its template has no spaces between pieces, so punctuation stays against the word before it. */
@Component({
  selector: 'app-rich',
  template: `@for (p of parts(); track $index) {@switch (p.kind) {@case ('strong') {<strong class="ui">{{ p.text }}</strong>}@case ('code') {<code>{{ p.text }}</code>}@default {{{ p.text }}}}}`,
})
export class Rich {
  readonly text = input.required<string>();
  protected readonly parts = computed(() => pieces(this.text()));
}
