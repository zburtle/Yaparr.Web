import { Component } from '@angular/core';
import { REPO } from './downloads';

/** The privacy policy, linked from the Google Play listing. Keep it in step with docs/play-store.md (Data safety) in the Yaparr repository. */
@Component({
  selector: 'app-privacy',
  template: `
    <section class="wrap prose">
      <h1>Yaparr privacy policy</h1>
      <p class="muted">Last changed: 18 November 2026.</p>

      <p>
        <strong>In short.</strong> Yaparr sends your messages, pictures, voice and shared screens directly between you and the
        people you talk to. When someone is offline and you have a Yaparr Cloud account, a copy of your messages also waits for
        them on Yaparr Cloud, locked so that we cannot read it. We do not use ads, trackers or analytics.
      </p>

      <h2>What stays on your devices</h2>
      <p>
        Your messages, pictures, rooms, blocks and settings are stored on your devices. A diagnostics log is kept on the device;
        it leaves only if you choose to share it.
      </p>

      <h2>What the people you talk to see</h2>
      <p>
        Because the connection is direct, the people in a room can see the network address (IP address) your device connects
        from, as with any direct connection. They also see your name and picture, and a small cloud next to your name if you are
        signed in to Yaparr Cloud.
      </p>

      <h2>Yaparr Cloud (optional)</h2>
      <p>
        Yaparr works without an account. If you sign in to a Yaparr Cloud server (ours, at cloud.yaparr.com, or one that you or a
        friend run), it keeps:
      </p>
      <ul>
        <li>
          <strong>Messages waiting for people who are away.</strong> When someone you know is away, a locked copy of a message you
          write in a room or in a direct chat, and of a picture you send, is left for them for up to 7 days. Nothing is left when
          everyone is connected, and you can turn this off in Settings. It is locked on your device with a key that only the
          people in the conversation have, so the server cannot read it. We can see that your account left or fetched something,
          when, how big it was and from which address, and an opaque id that stands for the room, but not what is in it or who the
          room's members are.
        </li>
        <li>
          <strong>Your email address,</strong> which only names the account (nothing is ever emailed to you), and a hash of your
          password.
        </li>
        <li>
          <strong>An encrypted backup</strong> of your profile and <strong>an encrypted copy of your name, rooms and blocks</strong>
          that keeps your devices the same. They are locked on your device with a recovery code that never leaves your devices, so
          the server cannot read them.
        </li>
        <li>
          <strong>How to wake your phone:</strong> a push address (from a UnifiedPush app, or a Firebase token if you choose
          Google's push), a device id, and a secret wake token (only a hash is kept). When someone writes to you while your phone
          is off, their app asks the server to wake your phone, and the server sends a push with no content: no name, no words,
          no room. The sender needs no account.
        </li>
        <li>
          <strong>A short log of server activity</strong> for running the service. A wake-up is logged by its outcome (sent,
          failed, rate limited) and nothing about who or where.
        </li>
      </ul>
      <p>We do not sell or share this data. It is used only to provide these features.</p>

      <h2>Google's push (optional fallback)</h2>
      <p>
        If you choose Firebase push because you have no UnifiedPush app, Google delivers the content-free wake-up and sees your
        device token and the time. Nothing else is sent through it.
      </p>

      <h2>This website</h2>
      <p>
        This site sets no cookies and loads no third-party code. Invite and sign-up links keep their secret part after the
        <code>#</code>, which your browser never sends to us. To pick a download for your system, your browser asks GitHub for the
        latest release.
      </p>

      <h2>Deleting your data</h2>
      <p>
        You can delete your Yaparr Cloud account, with its backup, synced copy, push registrations and the locked messages it left
        for others, at
        <a href="https://cloud.yaparr.com/account/delete">cloud.yaparr.com/account/delete</a>. It is also linked from the app's
        Yaparr Cloud settings. Removing the app removes the data on the device. People you talked to keep the messages they
        received.
      </p>

      <h2>Children</h2>
      <p>Yaparr is not directed at children under 13, and we do not knowingly collect data from them.</p>

      <h2>Changes and contact</h2>
      <p>
        Changes are posted on this page. Questions about this policy or your data: open an issue at
        <a [href]="repo + '/issues'">the project on GitHub</a>.
      </p>
    </section>
  `,
})
export class Privacy {
  protected readonly repo = REPO;
}
