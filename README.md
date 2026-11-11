# Yaparr.Web

The website for [Yaparr](https://github.com/zburtle/Yaparr), served at yaparr.com. An Angular app that builds to static files.

## Invite links

Yaparr shares rooms and direct chats as links. The secret part is always in the URL **fragment** (after the `#`), which browsers never send to a server, so this site and its host never see a room key or who someone wants to talk to:

| Link people share | Opens the app with |
| --- | --- |
| `https://yaparr.com/join#<invite>` | `yaparr://join/<invite>` |
| `https://yaparr.com/chat#<peer id>` | `yaparr://chat/<peer id>` |

The page reads the fragment in the browser, checks its shape (an invite is base64url of 32, 64 or 86 bytes like `RoomKey.Parse`; a peer id is 64 lowercase hex characters), removes it from the address bar and history, and hands `yaparr://…` to the operating system. The app asks the person to confirm before it joins or opens anything. The page sends no referrer and has a strict Content-Security-Policy, and nothing on the site loads third-party code.

## Sign-up links

Someone who runs a Yaparr backup server for friends sends them a link, and the page here is where they sign up:

| Link | |
| --- | --- |
| `https://yaparr.com/signup#server=<server address, encoded>&code=<code>` | a page that asks for an email address and posts it, with the code, to that server |
| `https://yaparr.com/signup#code=<code>` | the same, for Yaparr's own server, `https://cloud.yaparr.com` (the default in `src/app/signup-link.ts`) |

The server and the code are in the URL **fragment**, so this site and its host never see them, and the page removes them from the address bar and history. A link that leaves the server out is for `https://cloud.yaparr.com`; one that names a server that is not usable is refused rather than sent to the default. The page checks their shape (the server must be `https`, or `http` on the same computer for trying one out; a code is 16 letters and digits without I, O, 0 or 1), shows which server the account will be on, and submits an ordinary HTML form to `<server>/signup`. There is no script in the exchange and no password on this site: the server makes the account and asks for the password on its own page. That is why the Content-Security-Policy allows `form-action` to any `https:` address (and loopback `http:`), the one thing here that points somewhere else; nothing is ever loaded from there.

The server side (making codes, the `/signup` endpoint) is not part of this repository.

## Downloads

The home page and the link pages pick a download for the visitor's system (Windows installer, Flatpak or `.deb` by architecture, or the Android package) from GitHub's latest release, read in the browser from `api.github.com`. If that fails, Windows falls back to the releases page; the Flatpak link never needs it. Detection is a guess and every download stays on the page.

## Development

Needs Node 20.19+, 22.12+ or 24+.

```bash
npm install
npm start        # dev server on http://localhost:4200, try /join#<invite>
npm test         # unit tests
npm run build    # static site in dist/yaparr-web/browser, with 404.html as the SPA fallback
```

Host `dist/yaparr-web/browser` anywhere that serves static files. The host must serve `index.html` (or `404.html`) for `/join` and `/chat`.

## Licence

GNU GPL, version 3 or later, like Yaparr itself. See [COPYING](COPYING) and [LICENSE.txt](LICENSE.txt).
