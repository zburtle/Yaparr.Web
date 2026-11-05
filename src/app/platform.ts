export type Os = 'windows' | 'linux' | 'mac' | 'android' | 'ios' | 'other';
export type Arch = 'x64' | 'arm64';
export interface Platform {
  os: Os;
  arch: Arch;
}

/**
 * Works out the visitor's system from what the browser says about itself. This is a guess, never a gate: every download stays
 * reachable from the page whatever it decides. `uaPlatform` and `uaArch` are navigator.userAgentData's platform and
 * architecture when the browser gives them (Chromium does).
 */
export function detectPlatform(userAgent: string, uaPlatform?: string, uaArch?: string): Platform {
  const ua = userAgent.toLowerCase();
  const hint = (uaPlatform ?? '').toLowerCase();
  let os: Os = 'other';
  // Android and iPadOS say "Linux" and "Mac OS X" too, so they are checked first.
  if (/android/.test(ua) || hint === 'android') os = 'android';
  else if (/iphone|ipad|ipod/.test(ua) || hint === 'ios') os = 'ios';
  else if (/windows/.test(ua) || hint === 'windows') os = 'windows';
  else if (/macintosh|mac os/.test(ua) || hint === 'macos') os = 'mac';
  else if (/cros/.test(ua) || hint === 'chrome os') os = 'other';
  else if (/linux|x11/.test(ua) || hint === 'linux') os = 'linux';

  const arch: Arch = /arm|aarch64/.test((uaArch ?? '').toLowerCase()) || /aarch64|arm64/.test(ua) ? 'arm64' : 'x64';
  return { os, arch };
}

export async function currentPlatform(): Promise<Platform> {
  const data = (navigator as Navigator & { userAgentData?: { platform?: string; getHighEntropyValues?(hints: string[]): Promise<{ architecture?: string }> } }).userAgentData;
  let arch: string | undefined;
  try { arch = (await data?.getHighEntropyValues?.(['architecture']))?.architecture; } catch { /* the browser declined; the user agent will do */ }
  return detectPlatform(navigator.userAgent, data?.platform, arch);
}
