import { Platform } from './platform';

export const REPO = 'https://github.com/zburtle/Yaparr';
export const RELEASES_PAGE = `${REPO}/releases/latest`;
export const FLATPAK_REF = 'https://flatpak.yaparr.com/com.yaparr.Yaparr.flatpakref';
const DOWNLOAD_PREFIX = `${REPO}/releases/download/`;

export interface Asset { name: string; size: number; url: string }
export interface Release { version: string; assets: Asset[] }
export interface Download { label: string; detail: string; url: string; hint?: string }
export interface Plan {
  /** What to offer first for this system; null where Yaparr has no build. */
  primary: Download | null;
  others: Download[];
}

/** Reads GitHub's "latest release" answer, keeping only assets that really are downloads of this project. */
export function parseRelease(json: unknown): Release | null {
  const r = json as { tag_name?: unknown; assets?: unknown } | null;
  if (typeof r?.tag_name !== 'string' || !Array.isArray(r.assets)) return null;
  const assets: Asset[] = [];
  for (const a of r.assets as Record<string, unknown>[]) {
    if (typeof a?.['name'] === 'string' && typeof a['browser_download_url'] === 'string' && a['browser_download_url'].startsWith(DOWNLOAD_PREFIX))
      assets.push({ name: a['name'], size: typeof a['size'] === 'number' ? a['size'] : 0, url: a['browser_download_url'] });
  }
  return { version: r.tag_name.replace(/^(?:android-)?v/, ''), assets };
}

/**
 * The Android app is released on its own (tags like android-v1.2.3, never marked as the latest release), so its package is not in the latest release
 * any more. Reads GitHub's list of releases (newest first) and keeps the newest published Android one.
 */
export function parseAndroidRelease(json: unknown): Release | null {
  if (!Array.isArray(json)) return null;
  for (const entry of json as Record<string, unknown>[]) {
    if (typeof entry?.['tag_name'] !== 'string' || !/^android-v\d/.test(entry['tag_name'])) continue;
    if (entry['draft'] === true || entry['prerelease'] === true) continue;
    const release = parseRelease(entry);
    if (release) return release;
  }
  return null;
}

export function megabytes(bytes: number): string {
  return bytes > 0 ? `${Math.round(bytes / 1024 / 1024)} MB` : '';
}

const flatpak: Download = {
  label: 'Flatpak',
  detail: 'Updates with the rest of your software',
  url: FLATPAK_REF,
};

function describe(asset: Asset, release: Release): Download | null {
  const size = megabytes(asset.size);
  const v = `v${release.version}`;
  if (asset.name.endsWith('.msi')) return { label: 'Windows installer', detail: [v, 'x64', size].filter(Boolean).join(' · '), url: asset.url };
  if (asset.name.endsWith('.apk'))
    return {
      label: 'Android app',
      detail: [v, size].filter(Boolean).join(' · '),
      url: asset.url,
      hint: 'Your phone asks to allow installs from your browser the first time. To update, download the new file and open it.',
    };
  const deb = /_(amd64|arm64)\.deb$/.exec(asset.name);
  if (deb) return { label: `Debian and Ubuntu package (${deb[1]})`, detail: [v, size].filter(Boolean).join(' · '), url: asset.url };
  return null;
}

/**
 * The download for a system, and the rest below it. Without a release (not loaded, or GitHub unreachable) Windows falls back to the releases page.
 * The Android package comes from the newest Android release when there is one (an older latest release may still hold an Android package from before the
 * Android app had releases of its own).
 */
export function downloadsFor(platform: Platform, release: Release | null, android: Release | null = null): Plan {
  const all = [android, release]
    .flatMap(r => (r ? r.assets.map(a => ({ asset: a, d: describe(a, r) })) : []))
    .filter((x): x is { asset: Asset; d: Download } => x.d !== null);
  const msi = all.find(x => x.asset.name.endsWith('.msi'))?.d;
  const debs = all.filter(x => x.asset.name.endsWith('.deb'));
  const apk = all.find(x => x.asset.name.endsWith('.apk'))?.d;
  const myDeb = debs.find(x => x.asset.name.includes(platform.arch === 'arm64' ? '_arm64.' : '_amd64.'))?.d;
  const windows: Download = msi ?? { label: 'Windows installer', detail: 'From the releases page', url: RELEASES_PAGE };
  const rest = (without: Download | undefined | null) => [windows, flatpak, ...debs.map(x => x.d), ...(apk ? [apk] : [])].filter(d => d !== without);

  if (platform.os === 'windows') return { primary: windows, others: rest(windows) };
  // Where the release has no Android package, a phone gets the list like any other system that has no build of its own.
  if (platform.os === 'android' && apk) return { primary: apk, others: rest(apk) };
  if (platform.os === 'linux') return { primary: flatpak, others: [...(myDeb ? [myDeb] : []), ...rest(flatpak).filter(d => d !== myDeb)] };
  return { primary: null, others: rest(null) };
}
