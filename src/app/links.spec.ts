import { androidLink, appLink, shareLink, validate } from './links';

const b64 = (n: number) => 'A'.repeat(n);

describe('links', () => {
  it('accepts the three invite shapes', () => {
    for (const n of [43, 86, 115]) expect(validate('join', b64(n))).toBe(b64(n));
  });
  it('rejects bad invites', () => {
    for (const v of [null, '', b64(42), b64(44), b64(43) + '=', 'a b' + b64(40), b64(42) + '/']) expect(validate('join', v)).toBeNull();
  });
  it('accepts a peer id and lowercases it', () => {
    const id = 'ab'.repeat(32);
    expect(validate('chat', id.toUpperCase())).toBe(id);
  });
  it('rejects bad peer ids', () => {
    for (const v of [null, 'ab'.repeat(31), 'zz'.repeat(32), 'ab'.repeat(33)]) expect(validate('chat', v)).toBeNull();
  });
  it('builds links with the secret in the fragment', () => {
    expect(shareLink('join', 'x')).toBe('https://yaparr.com/join#x');
    expect(appLink('chat', 'x')).toBe('yaparr://chat/x');
  });
  it('builds an Android intent that names the app, with the home page as the fallback', () => {
    expect(androidLink('join', 'x')).toBe('intent://join/x#Intent;scheme=yaparr;package=org.yaparr.android;S.browser_fallback_url=https%3A%2F%2Fyaparr.com%2F;end');
  });
});
