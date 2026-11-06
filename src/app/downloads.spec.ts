import { FLATPAK_REF, RELEASES_PAGE, downloadsFor, parseAndroidRelease, parseRelease } from './downloads';
import { detectPlatform } from './platform';

const dl = 'https://github.com/zburtle/Yaparr/releases/download/v1.33.0/';
const json = {
  tag_name: 'v1.33.0',
  assets: [
    { name: 'Yaparr-1.33.0-x64.msi', size: 66701567, browser_download_url: dl + 'Yaparr-1.33.0-x64.msi' },
    { name: 'yaparr_1.33.0_amd64.deb', size: 40242670, browser_download_url: dl + 'yaparr_1.33.0_amd64.deb' },
    { name: 'yaparr_1.33.0_arm64.deb', size: 37562232, browser_download_url: dl + 'yaparr_1.33.0_arm64.deb' },
    { name: 'yaparr_1.33.0_amd64.flatpak', size: 39450712, browser_download_url: dl + 'yaparr_1.33.0_amd64.flatpak' },
    { name: 'Yaparr-1.33.0.apk', size: 46003779, browser_download_url: dl + 'Yaparr-1.33.0.apk' },
    { name: 'evil.msi', size: 1, browser_download_url: 'https://evil.example/evil.msi' },
  ],
};

describe('detectPlatform', () => {
  const win = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
  const linux = 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0';
  it('recognises Windows and Linux', () => {
    expect(detectPlatform(win).os).toBe('windows');
    expect(detectPlatform(linux)).toEqual({ os: 'linux', arch: 'x64' });
  });
  it('reads ARM from the user agent or the client hint', () => {
    expect(detectPlatform('Mozilla/5.0 (X11; Linux aarch64) Firefox/120').arch).toBe('arm64');
    expect(detectPlatform(linux, 'Linux', 'arm').arch).toBe('arm64');
  });
  it('does not mistake Android or iOS for Linux or macOS', () => {
    expect(detectPlatform('Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/120 Mobile').os).toBe('android');
    expect(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari').os).toBe('ios');
    expect(detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari').os).toBe('mac');
  });
});

describe('parseRelease', () => {
  it('keeps only downloads of this project and strips the v', () => {
    const r = parseRelease(json)!;
    expect(r.version).toBe('1.33.0');
    expect(r.assets.map(a => a.name)).not.toContain('evil.msi');
    expect(r.assets.length).toBe(5);
  });
  it('rejects nonsense', () => {
    expect(parseRelease(null)).toBeNull();
    expect(parseRelease({ tag_name: 1 })).toBeNull();
  });
});

describe('downloadsFor', () => {
  const release = parseRelease(json);
  it('offers the installer on Windows', () => {
    const plan = downloadsFor({ os: 'windows', arch: 'x64' }, release);
    expect(plan.primary?.url).toBe(dl + 'Yaparr-1.33.0-x64.msi');
    expect(plan.primary?.detail).toContain('v1.33.0');
  });
  it('offers the Flatpak on Linux, with the package for the machine first among the others', () => {
    const plan = downloadsFor({ os: 'linux', arch: 'arm64' }, release);
    expect(plan.primary?.url).toBe(FLATPAK_REF);
    expect(plan.others[0].url).toBe(dl + 'yaparr_1.33.0_arm64.deb');
  });
  it('offers the Android app on an Android phone, with the other downloads below it', () => {
    const plan = downloadsFor({ os: 'android', arch: 'arm64' }, release);
    expect(plan.primary?.url).toBe(dl + 'Yaparr-1.33.0.apk');
    expect(plan.primary?.label).toBe('Android app');
    expect(plan.primary?.hint).toBeTruthy();
    expect(plan.others.map(d => d.label)).not.toContain('Android app');
  });
  it('lists the Android app among the downloads for a computer', () => {
    expect(downloadsFor({ os: 'windows', arch: 'x64' }, release).others.map(d => d.label)).toContain('Android app');
  });
  it('has no Android download where the release has no package, and the phone gets the list', () => {
    const without = parseRelease({ ...json, assets: json.assets.filter(a => !a.name.endsWith('.apk')) });
    const plan = downloadsFor({ os: 'android', arch: 'arm64' }, without);
    expect(plan.primary).toBeNull();
    expect(plan.others.length).toBeGreaterThan(0);
  });
  it('still works before the release is known', () => {
    expect(downloadsFor({ os: 'windows', arch: 'x64' }, null).primary?.url).toBe(RELEASES_PAGE);
    expect(downloadsFor({ os: 'linux', arch: 'x64' }, null).primary?.url).toBe(FLATPAK_REF);
  });
  it('offers no main download where there is no build, but lists them all', () => {
    const plan = downloadsFor({ os: 'mac', arch: 'arm64' }, release);
    expect(plan.primary).toBeNull();
    expect(plan.others.length).toBeGreaterThan(2);
  });
});

describe('the Android releases', () => {
  const adl = 'https://github.com/zburtle/Yaparr/releases/download/android-v1.47.0/';
  const android = (tag: string, extra: object = {}) => ({
    tag_name: tag,
    assets: [{ name: 'Yaparr-' + tag.replace('android-v', '') + '.apk', size: 47000000, browser_download_url: `https://github.com/zburtle/Yaparr/releases/download/${tag}/Yaparr-${tag.replace('android-v', '')}.apk` }],
    ...extra,
  });

  it('finds the newest published Android release in the list, whatever else is in it', () => {
    const list = [json, android('android-v1.48.0', { draft: true }), android('android-v1.47.0'), android('android-v1.46.0')];
    const release = parseAndroidRelease(list);
    expect(release?.version).toBe('1.47.0');
    expect(release?.assets[0].name).toBe('Yaparr-1.47.0.apk');
  });

  it('finds none when no release is an Android one', () => {
    expect(parseAndroidRelease([json])).toBeNull();
    expect(parseAndroidRelease({ message: 'rate limited' })).toBeNull();
  });

  it('offers a phone the newest Android release instead of the package in an older latest release', () => {
    const latest = parseRelease(json);
    const newest = parseAndroidRelease([android('android-v1.47.0')]);
    const plan = downloadsFor({ os: 'android', arch: 'arm64' }, latest, newest);
    expect(plan.primary?.url).toBe(adl + 'Yaparr-1.47.0.apk');
    expect(plan.primary?.detail).toContain('v1.47.0');
    // The old package is not offered a second time in the list.
    expect(plan.others.filter(d => d.label === 'Android app').length).toBe(0);
  });

  it('still offers the package of the latest release when there is no Android release', () => {
    const plan = downloadsFor({ os: 'android', arch: 'arm64' }, parseRelease(json), null);
    expect(plan.primary?.url).toBe(dl + 'Yaparr-1.33.0.apk');
  });
});
