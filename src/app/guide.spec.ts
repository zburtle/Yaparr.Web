import { parseTrail } from './guide';
import { NODES, START, isPage, nodeById, pieces } from './guide-data';

describe('the setup guide', () => {
  const targets = NODES.flatMap(n => [...(n.choices ?? []), ...(n.after ?? [])].map(c => ({ from: n.id, to: c.to })));

  it('has unique screens', () => {
    expect(new Set(NODES.map(n => n.id)).size).toBe(NODES.length);
  });

  it('only leads to screens that exist, or to pages of the site that have a route', () => {
    for (const t of targets) {
      if (isPage(t.to)) expect(['/guide/cloud']).toContain(t.to);
      else expect(nodeById(t.to), `${t.from} -> ${t.to}`).toBeDefined();
    }
  });

  it('ends every path in steps, and never in a dead end', () => {
    for (const n of NODES) {
      const hasChoices = (n.choices?.length ?? 0) > 0;
      const hasSteps = (n.steps?.length ?? 0) > 0;
      expect(hasChoices !== hasSteps, `${n.id} must be a question or a list of steps`).toBe(true);
      if (hasSteps) expect((n.after?.length ?? 0) > 0, `${n.id} should say what next`).toBe(true);
    }
  });

  it('reaches every screen from the first one', () => {
    const seen = new Set<string>([START]);
    const queue = [START];
    while (queue.length) {
      const n = nodeById(queue.pop()!)!;
      for (const c of [...(n.choices ?? []), ...(n.after ?? [])])
        if (!isPage(c.to) && !seen.has(c.to)) { seen.add(c.to); queue.push(c.to); }
    }
    expect([...seen].sort()).toEqual(NODES.map(n => n.id).sort());
  });

  it('keeps the cloud way shorter than doing it by hand, which is what the comparison page says', () => {
    for (const pair of [['phone-link', 'phone-cloud'], ['computer-link', 'computer-cloud']])
      expect(nodeById(pair[1])!.steps!.length).toBeLessThan(nodeById(pair[0])!.steps!.length);
  });

  it('reads a trail out of the address and drops what it does not know', () => {
    expect(parseTrail(null)).toEqual([START]);
    expect(parseTrail('phone/phone-where')).toEqual([START, 'phone', 'phone-where']);
    expect(parseTrail('phone/<script>/nope/phone-link')).toEqual([START, 'phone', 'phone-link']);
  });

  it('splits marked text without treating it as html', () => {
    expect(pieces('Tap **Continue** in `a b` now')).toEqual([
      { text: 'Tap ', kind: 'plain' },
      { text: 'Continue', kind: 'strong' },
      { text: ' in ', kind: 'plain' },
      { text: 'a b', kind: 'code' },
      { text: ' now', kind: 'plain' },
    ]);
    expect(pieces('<b>x</b>')).toEqual([{ text: '<b>x</b>', kind: 'plain' }]);
  });
});
