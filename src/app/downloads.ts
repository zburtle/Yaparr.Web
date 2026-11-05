import { Platform } from './platform';

export const REPO = 'https://github.com/zburtle/Yaparr';
export const RELEASES_PAGE = `${REPO}/releases/latest`;
export const FLATPAK_REF = 'https://flatpak.yaparr.com/com.yaparr.Yaparr.flatpakref';
const DOWNLOAD_PREFIX = `${REPO}/releases/download/`;

export interface Asset { name: string; size: number; url: string }
export interface Release { version: string; assets: Asset[] }
export interface Download { label: string; detail: string; url: string }
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
  return { version: r.tag_name.replace(/^v/, ''), assets };
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
  const deb = /_(amd64|arm64)\.deb$/.exec(asset.name);
  if (deb) return { label: `Debian and Ubuntu package (${deb[1]})`, detail: [v, size].filter(Boolean).join(' · '), url: asset.url };
  return null;
}

/** The download for a system, and the rest below it. Without a release (not loaded, or GitHub unreachable) Windows falls back to the releases page. */
export function downloadsFor(platform: Platform, release: Release | null): Plan {
  const all = (release?.assets ?? []).map(a => ({ asset: a, d: describe(a, release!) })).filter((x): x is { asset: Asset; d: Download } => x.d !== null);
  const msi = all.find(x => x.asset.name.endsWith('.msi'))?.d;
  const debs = all.filter(x => x.asset.name.endsWith('.deb'));
  const myDeb = debs.find(x => x.asset.name.includes(platform.arch === 'arm64' ? '_arm64.' : '_amd64.'))?.d;
  const windows: Download = msi ?? { label: 'Windows installer', detail: 'From the releases page', url: RELEASES_PAGE };
  const rest = (without: Download | undefined | null) => [windows, flatpak, ...debs.map(x => x.d)].filter(d => d !== without);

  if (platform.os === 'windows') return { primary: windows, others: rest(windows) };
  if (platform.os === 'linux') return { primary: flatpak, others: [...(myDeb ? [myDeb] : []), ...rest(flatpak).filter(d => d !== myDeb)] };
  return { primary: null, others: rest(null) };
}
