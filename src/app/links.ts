/**
 * Yaparr links. The secret part always travels in the URL fragment (after the #), which browsers never send to a
 * server, so this site, its host and any CDN in front of it never see a room key or who someone wants to talk to.
 *
 *   https://yaparr.com/join#<invite>   ->  yaparr://join/<invite>
 *   https://yaparr.com/chat#<peer id>  ->  yaparr://chat/<peer id>
 *
 * The shapes below mirror RoomKey.Parse and PeerId in the Yaparr library: an invite is base64url of 32 bytes (no
 * owner), 64 bytes (secret and owner) or 86 bytes (a rotated key); a peer id is the lowercase hex of a SHA-256 hash.
 */
export type LinkKind = 'join' | 'chat';

const INVITE = /^[A-Za-z0-9_-]+$/;
const INVITE_LENGTHS = new Set([43, 86, 115]); // 32, 64 and 86 bytes in unpadded base64url
const PEER_ID = /^[0-9a-f]{64}$/;

/** Returns the cleaned value if it is a well-formed payload for the kind, otherwise null. */
export function validate(kind: LinkKind, raw: string | null | undefined): string | null {
  const value = (raw ?? '').trim();
  if (kind === 'join') return INVITE.test(value) && INVITE_LENGTHS.has(value.length) ? value : null;
  const id = value.toLowerCase();
  return PEER_ID.test(id) ? id : null;
}

/** The link the Yaparr app registers itself for. */
export function appLink(kind: LinkKind, value: string): string {
  return `yaparr://${kind}/${value}`;
}

/**
 * The same link for Chrome on Android, which hands an intent: address to the app named in it. Naming the package means no other app can
 * pick the link up, which matters because an invite is a secret; if the app is not installed Chrome opens the fallback page instead.
 */
export function androidLink(kind: LinkKind, value: string, fallback = 'https://yaparr.com/'): string {
  return `intent://${kind}/${value}#Intent;scheme=yaparr;package=org.yaparr.android;S.browser_fallback_url=${encodeURIComponent(fallback)};end`;
}

/** The https link people share. */
export function shareLink(kind: LinkKind, value: string, origin = 'https://yaparr.com'): string {
  return `${origin}/${kind}#${value}`;
}
