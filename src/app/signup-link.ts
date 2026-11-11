/**
 * Sign-up links. A friend is sent a link with a code in it, for a backup server somebody runs for them:
 *
 *   https://yaparr.com/signup#server=https%3A%2F%2Fbackup.example.org&code=K7QD-M3XF-9PLR-2WTE
 *
 * The server can be left out, and the link is then for Yaparr's own, {@link DEFAULT_SERVER}: https://yaparr.com/signup#code=K7QD-M3XF-9PLR-2WTE
 *
 * Both parts are in the URL fragment (after the #), which browsers never send to a server, so this site and its host never see the code or which
 * server it is for. The page asks for an email address and posts it, with the code, to that server's own /signup; the server makes the account and
 * asks for the password on its own page, so no password ever passes through here.
 */
export interface SignupLink {
  /** The server's origin (scheme, host and port), which is where the form is posted. */
  readonly server: string;
  /** The server's host, as shown to the person. */
  readonly host: string;
  /** The code, in groups of four. */
  readonly code: string;
}

/** The backup server a sign-up link is for when it does not say. The Yaparr app is released with the same address in its own configuration. */
export const DEFAULT_SERVER = 'https://cloud.yaparr.com';

const CODE = /^[A-HJ-NP-Z2-9]{16}$/;
const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]']);

/** The server's origin if it is an address the form may be posted to: https, or http on this computer (for trying a server out). Otherwise null. */
export function serverOrigin(raw: string | null | undefined): string | null {
  let url: URL;
  try {
    url = new URL((raw ?? '').trim());
  } catch {
    return null;
  }
  if (url.username || url.password) return null;
  if (url.protocol === 'https:') return url.origin;
  if (url.protocol === 'http:' && LOOPBACK.has(url.hostname)) return url.origin;
  return null;
}

/** The code as the server keeps it: upper case without dashes or spaces, or null if it cannot be a code. */
export function normalizeCode(raw: string | null | undefined): string | null {
  const letters = (raw ?? '').replace(/[\s-]/g, '').toUpperCase();
  return CODE.test(letters) ? letters : null;
}

/** The code in groups of four, like K7QD-M3XF-9PLR-2WTE. */
export function showCode(letters: string): string {
  return letters.match(/.{4}/g)!.join('-');
}

/** Reads the fragment of a sign-up link, or returns null if it is not a whole one. */
export function parseSignupLink(fragment: string | null | undefined): SignupLink | null {
  const parts = new URLSearchParams(fragment ?? '');
  // A link that names a server must name a usable one: a bad address is never replaced by the default.
  const named = parts.get('server');
  const server = named === null ? DEFAULT_SERVER : serverOrigin(named);
  const code = normalizeCode(parts.get('code'));
  if (server === null || code === null) return null;
  return { server, host: new URL(server).host, code: showCode(code) };
}

/** The link to send a friend. */
export function signupLink(server: string, code: string, origin = 'https://yaparr.com'): string {
  return `${origin}/signup#server=${encodeURIComponent(server)}&code=${code}`;
}

/** Where the form is posted. */
export function signupAction(server: string): string {
  return `${server}/signup`;
}
