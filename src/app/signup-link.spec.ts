import { DEFAULT_SERVER, normalizeCode, parseSignupLink, serverOrigin, showCode, signupAction, signupLink } from './signup-link';

const fragment = (server: string, code: string) => `server=${encodeURIComponent(server)}&code=${code}`;

describe('sign-up links', () => {
  it('reads a whole link', () => {
    expect(parseSignupLink(fragment('https://backup.example.org', 'K7QD-M3XF-9PLR-2WTE'))).toEqual({
      server: 'https://backup.example.org',
      host: 'backup.example.org',
      code: 'K7QD-M3XF-9PLR-2WTE',
    });
  });

  it('keeps a port and drops a path, a query and anything after', () => {
    expect(parseSignupLink(fragment('https://backup.example.org:8443/some/path?x=1#y', 'K7QDM3XF9PLR2WTE'))?.server).toBe('https://backup.example.org:8443');
  });

  it('understands a code however it was typed', () => {
    for (const typed of ['k7qd-m3xf-9plr-2wte', 'K7QD M3XF 9PLR 2WTE', ' K7QDM3XF9PLR2WTE ']) expect(normalizeCode(typed)).toBe('K7QDM3XF9PLR2WTE');
    expect(showCode('K7QDM3XF9PLR2WTE')).toBe('K7QD-M3XF-9PLR-2WTE');
  });

  it('rejects a code that cannot be one', () => {
    for (const bad of [null, '', 'K7QD-M3XF-9PLR', 'K7QD-M3XF-9PLR-2WTE-AAAA', 'K7QD-M3XF-9PLR-2WT0', 'K7QD-M3XF-9PLR-2WT1', 'K7QD-M3XF-9PLR-2WT!', '<script>']) {
      expect(normalizeCode(bad)).toBeNull();
    }
  });

  it('only posts to https, or to http on this computer', () => {
    for (const ok of ['https://backup.example.org', 'http://localhost:5000', 'http://127.0.0.1:5000', 'http://[::1]:5000']) expect(serverOrigin(ok)).not.toBeNull();
    for (const bad of [
      null, '', 'backup.example.org', 'http://backup.example.org', 'ftp://backup.example.org', 'javascript:alert(1)', 'data:text/html,x', 'https://',
      'https://user:pass@backup.example.org', 'http://localhost.evil.example', 'http://127.0.0.1.evil.example',
    ]) {
      expect(serverOrigin(bad)).toBeNull();
    }
  });

  it('rejects a link with a part missing or bad', () => {
    for (const bad of [null, '', 'server=https%3A%2F%2Fbackup.example.org', fragment('http://backup.example.org', 'K7QDM3XF9PLR2WTE'), fragment('https://backup.example.org', 'nope')]) {
      expect(parseSignupLink(bad)).toBeNull();
    }
  });

  it('uses the Yaparr server when the link does not name one, but never in place of a bad one', () => {
    expect(DEFAULT_SERVER).toBe('https://cloud.yaparr.com');
    expect(parseSignupLink('code=K7QD-M3XF-9PLR-2WTE')).toEqual({ server: DEFAULT_SERVER, host: 'cloud.yaparr.com', code: 'K7QD-M3XF-9PLR-2WTE' });
    expect(parseSignupLink('code=K7QD-M3XF-9PLR-2WTE&server=')).toBeNull();
    expect(parseSignupLink('code=K7QD-M3XF-9PLR-2WTE&server=http%3A%2F%2Fcloud.yaparr.com')).toBeNull();
    expect(parseSignupLink('code=nope')).toBeNull();
  });

  it('builds the link the server prints, and posts to the server itself', () => {
    const link = signupLink('https://backup.example.org', 'K7QD-M3XF-9PLR-2WTE');
    expect(link).toBe('https://yaparr.com/signup#server=https%3A%2F%2Fbackup.example.org&code=K7QD-M3XF-9PLR-2WTE');
    expect(parseSignupLink(link.split('#')[1])?.code).toBe('K7QD-M3XF-9PLR-2WTE');
    expect(signupAction('https://backup.example.org')).toBe('https://backup.example.org/signup');
  });
});
