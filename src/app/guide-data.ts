/**
 * The "set up your profile" guide as data: a small tree of questions that ends in numbered steps. Every screen name and button below is the one
 * the apps show (see docs/devices-and-accounts.md and docs/backup-server.md in the Yaparr repository), so keep them in step when the apps change.
 */

export interface Choice {
  label: string;
  hint?: string;
  to: string;
}

export interface Step {
  /** What to do, as one short sentence. Words in **double asterisks** are button or menu names. */
  text: string;
  /** More about this step, shown under it. */
  more?: string;
  /** A warning shown in the same place, for the steps where a mistake is costly. */
  warn?: string;
}

export interface Node {
  id: string;
  /** The question (for a question) or the title (for a finish). */
  title: string;
  intro?: string;
  choices?: Choice[];
  steps?: Step[];
  /** What to read or do next once the steps are done. */
  after?: Choice[];
  /** The note under the steps. */
  note?: string;
}

const KEEP_SAFE: Choice[] = [
  { label: 'Keep this account safe', hint: 'So a lost or broken device is not the end of it.', to: 'safe' },
  { label: 'Add another device later', hint: 'Start the guide again and say you have used Yaparr before.', to: 'start' },
];

export const START = 'start';

export const NODES: readonly Node[] = [
  {
    id: 'start',
    title: 'What are you setting Yaparr up on?',
    intro: 'Pick one and the guide only shows what you need. You can go back at any time.',
    choices: [
      { label: 'A computer', hint: 'Windows or Linux.', to: 'computer' },
      { label: 'An Android phone', hint: 'There is no iPhone app yet.', to: 'phone' },
    ],
  },

  // ----- Computer
  {
    id: 'computer',
    title: 'Have you used Yaparr before?',
    intro: 'If you already have a Yaparr account on another device, this computer should join it instead of making a second one. People then see you as one person, with your rooms on every device.',
    choices: [
      { label: "No, I'm new", hint: 'Make a new account on this computer.', to: 'computer-new' },
      { label: 'Yes, I already have an account', hint: 'Bring it to this computer.', to: 'computer-where' },
    ],
  },
  {
    id: 'computer-new',
    title: 'Make your account on a computer',
    steps: [
      { text: 'Download Yaparr from the front page and start it.', more: 'The first start opens a **Welcome to Yaparr** box that asks if you already have an account.' },
      { text: 'Choose **Start fresh**.' },
      { text: 'Type the name people will see next to your messages and continue.', more: 'It is filled in with your computer\'s user name. You can change it later with the pencil that shows when you point at your name above the conversations.' },
      { text: 'You are in. Make a room, or open an invite link someone sent you.', more: 'Opening an invite starts Yaparr and asks if you want to join.' },
    ],
    note: 'There is nothing to sign up for: your account is a key that lives on this computer. That also means it is only as safe as this computer, so the next page is worth a minute.',
    after: KEEP_SAFE,
  },
  {
    id: 'computer-where',
    title: 'Where is your account now?',
    choices: [
      { label: 'On another computer I still use', hint: 'Move it with a link file.', to: 'computer-link' },
      { label: 'On Yaparr Cloud', hint: 'You have a Yaparr Cloud account and its Sync key.', to: 'computer-cloud' },
      { label: 'In a backup file', hint: 'Made with Back up profile, on a computer or a phone.', to: 'computer-backup' },
    ],
  },
  {
    id: 'computer-link',
    title: 'Link this computer to your other computer',
    intro: 'Your name, rooms and blocks carry over. You need both computers in front of you, and the old one has to be running.',
    steps: [
      { text: 'On the computer you already use, open **Settings > Devices** and choose **Link another device…**, then **Continue**.' },
      { text: 'Choose **Save to a file…** and read the **Keep this file secure** box.', warn: 'Anyone who gets a copy of this file can sign in as you, and nothing can undo that. It stops working after a day.' },
      { text: 'Choose **I understand, save the file** and save it as `yaparr-link.ylnk`.' },
      { text: 'Carry the file to the new computer on a USB stick.', warn: 'Do not email it, put it in cloud storage or send it in a chat.' },
      { text: 'On the new computer start Yaparr. At the **Welcome to Yaparr** box choose **Link this device**, then **Open a link file…** and pick the file.', more: 'The file carries its own passphrase, so nothing is typed.' },
      { text: 'Delete the file on both computers and empty the recycle bin.' },
    ],
    note: 'Both computers are now you. Names, pins and the list of rooms stay in step between them.',
    after: [
      { label: 'Make this easier with Yaparr Cloud', hint: 'No files, no USB stick, and the old computer does not have to be on.', to: '/guide/cloud' },
      ...KEEP_SAFE,
    ],
  },
  {
    id: 'computer-cloud',
    title: 'Restore your account from Yaparr Cloud',
    intro: 'The whole account comes back: name, rooms and their keys, blocks, pins and your message history. The old computer is not needed.',
    steps: [
      { text: 'Start Yaparr. At the **Welcome to Yaparr** box choose **Restore from Yaparr Cloud**.' },
      { text: 'Check the server address (it is filled in as **https://cloud.yaparr.com**) and type your **Sync key**, like `K7QD-M3XF-9PLR-2WTE-HV8N-C4YB`.', more: 'The Sync key never leaves your devices. It is what unlocks the copy the server holds.' },
      { text: 'Your browser opens the server\'s sign-in page. Sign in with your email address and password.', more: 'Yaparr never sees them.' },
      { text: 'Wait for the page to say you are signed in and come back to Yaparr. It restarts with your account and your rooms.' },
    ],
    note: 'This computer is now another device of your account and stays signed in, so it keeps syncing by itself.',
    after: [
      { label: 'See how this compares with linking by hand', to: '/guide/cloud' },
      { label: 'Add another device later', to: 'start' },
    ],
  },
  {
    id: 'computer-backup',
    title: 'Restore your account from a backup file',
    intro: 'A backup is a copy of everything Yaparr keeps for you. If your old device is still in use, linking it is the better way, because a restored backup becomes another device of your account.',
    steps: [
      { text: 'Get the backup file onto this computer. It ends in `.yapbak` (locked with a passphrase) or `.zip`.', more: 'It is made on the old device with **Settings > Backup > Back up profile…** on a computer, or **Settings > Backup** on a phone.' },
      { text: 'Start Yaparr. At the **Welcome to Yaparr** box choose **Restore a backup**.' },
      { text: 'Pick the file. If it is locked, type its passphrase.', warn: 'A passphrase cannot be recovered. Without it a locked backup cannot be opened.' },
      { text: 'Yaparr restarts with your account back, as another device of it.' },
    ],
    note: 'A backup only holds what the device had when it was made. Messages and rooms since then are not in it.',
    after: [
      { label: 'Stop carrying backups around: Yaparr Cloud', to: '/guide/cloud' },
      ...KEEP_SAFE,
    ],
  },

  // ----- Phone
  {
    id: 'phone',
    title: 'Have you used Yaparr before?',
    intro: 'If you already have a Yaparr account on a computer, this phone should join it instead of making a second one. People then see you as one person.',
    choices: [
      { label: "No, I'm new", hint: 'Make a new account on this phone.', to: 'phone-new' },
      { label: 'Yes, I already have an account', hint: 'Bring it to this phone.', to: 'phone-where' },
    ],
  },
  {
    id: 'phone-new',
    title: 'Make your account on a phone',
    steps: [
      { text: 'Install Yaparr from the front page of this site on your phone, and open it.' },
      { text: 'On **Welcome to Yaparr**, under **Have you used Yaparr before?**, tap **No, I\'m new here**.' },
      { text: 'Under **What should people call you?** type your name and tap **Continue**.', more: 'You can change it later in Settings, and add a picture there.' },
      { text: 'Tap **+** to make a room, or to join one with an invite.', more: 'An invite link opens Yaparr straight into the room.' },
      { text: 'Allow notifications when Android asks, so you hear about messages when the app is closed.' },
    ],
    note: 'There is nothing to sign up for: your account is a key that lives on this phone, so it is only as safe as the phone.',
    after: KEEP_SAFE,
  },
  {
    id: 'phone-where',
    title: 'Where is your account now?',
    choices: [
      { label: 'On my computer', hint: 'Scan a QR code.', to: 'phone-link' },
      { label: 'On Yaparr Cloud', hint: 'You have a Yaparr Cloud account and its Sync key.', to: 'phone-cloud' },
      { label: 'In a backup file', hint: 'For a new phone, when the old one is gone.', to: 'phone-backup' },
    ],
  },
  {
    id: 'phone-link',
    title: 'Link this phone to your computer',
    intro: 'Your name and blocks arrive at once. Your rooms follow when the phone has connected to the computer, so leave the computer running for a few minutes.',
    steps: [
      { text: 'On the phone, tap **Yes, I already have an account**, then **On my computer**.' },
      { text: 'On the computer, open **Settings > Devices** and choose **Link another device…**, then **Continue**.' },
      { text: 'Choose **Show a QR code**.', warn: 'Only show it to someone standing next to you. It works for two minutes.' },
      { text: 'On the phone tap **Scan the QR code** and point it at the computer\'s screen.' },
      { text: 'Wait on the phone while it connects to the computer. Your rooms appear.', more: 'If they do not, check that the computer is on and that you have a connection. **Settings > Network > Check the connection** on the phone says what is wrong.' },
    ],
    note: 'The phone is now another device of you. Names, pins and the list of rooms stay in step between them.',
    after: [
      { label: 'Make this easier with Yaparr Cloud', hint: 'No QR code, and the computer does not have to be on.', to: '/guide/cloud' },
      ...KEEP_SAFE,
    ],
  },
  {
    id: 'phone-cloud',
    title: 'Restore your account from Yaparr Cloud',
    intro: 'The whole account comes back: name, rooms and their keys, blocks, pins and your message history. Your computer is not needed.',
    steps: [
      { text: 'On the phone, tap **Yes, I already have an account**, then **From Yaparr Cloud**.' },
      { text: 'Check the server address (it is filled in as **https://cloud.yaparr.com**) and type your **Sync key**, like `K7QD-M3XF-9PLR-2WTE-HV8N-C4YB`.', more: 'The Sync key never leaves your devices. It is what unlocks the copy the server holds.' },
      { text: 'Tap **Sign in and restore**. The phone\'s browser opens the server\'s sign-in page: sign in with your email address and password.' },
      { text: 'Wait until the page says you are signed in, then come back to Yaparr. Your account is restored.' },
    ],
    note: 'This phone is now another device of your account and stays signed in, so it keeps syncing by itself.',
    after: [
      { label: 'See how this compares with linking by hand', to: '/guide/cloud' },
      { label: 'Add another device later', to: 'start' },
    ],
  },
  {
    id: 'phone-backup',
    title: 'Restore your account from a backup file',
    intro: 'A backup is a copy of everything Yaparr keeps for you. If your old device is still in use, link instead, because a restored backup becomes another device of your account.',
    steps: [
      { text: 'Get the backup file onto the phone.', more: 'It is made on the old device with **Settings > Backup**, on a computer or a phone.' },
      { text: 'On the phone, tap **Yes, I already have an account**, then **In a backup file**, and pick the file.' },
      { text: 'If it is locked, type its passphrase.', warn: 'A passphrase cannot be recovered. Without it a locked backup cannot be opened.' },
    ],
    note: 'A backup only holds what the device had when it was made.',
    after: [
      { label: 'Stop carrying backups around: Yaparr Cloud', to: '/guide/cloud' },
      ...KEEP_SAFE,
    ],
  },

  // ----- Looking after it
  {
    id: 'safe',
    title: 'Keep your account safe',
    intro: 'Your account is a key on your device. If the device is lost, broken or wiped and there is no other copy, the account and your rooms go with it. Pick one or both:',
    choices: [
      { label: 'Yaparr Cloud', hint: 'Keeps a locked copy in step on all your devices, for you and not for anyone else to read.', to: '/guide/cloud' },
      { label: 'A backup file', hint: 'A copy you keep yourself.', to: 'backup-make' },
      { label: 'A second device', hint: 'Another device of yours holds the account too.', to: 'start' },
    ],
  },
  {
    id: 'backup-make',
    title: 'Make a backup file',
    steps: [
      { text: 'On a computer open **Settings > Backup** and choose **Back up profile…**. On a phone open **Settings > Backup**.' },
      { text: 'On a computer, lock it with a passphrase of at least 12 characters, typed twice.', warn: 'A passphrase cannot be recovered. A locked backup (`.yapbak`) is safe to keep anywhere. A plain zip lets anyone who gets it act as you.' },
      { text: 'Keep the file somewhere other than this device: a USB stick, or a drive you trust.' },
    ],
    note: 'A backup only holds what the device had when it was made, so make a new one now and then.',
    after: [
      { label: 'Have it done for you: Yaparr Cloud', to: '/guide/cloud' },
      { label: 'Back to the start', to: 'start' },
    ],
  },
];

export function nodeById(id: string): Node | undefined {
  return NODES.find(n => n.id === id);
}

/** Splits a step's text at its **bold** and `code` marks so a template can show them without ever treating the text as HTML. */
export interface Piece {
  text: string;
  kind: 'plain' | 'strong' | 'code';
}

export function pieces(text: string): Piece[] {
  const out: Piece[] = [];
  const mark = /\*\*(.+?)\*\*|`(.+?)`/g;
  let from = 0;
  for (let m = mark.exec(text); m; m = mark.exec(text)) {
    if (m.index > from) out.push({ text: text.slice(from, m.index), kind: 'plain' });
    out.push(m[1] !== undefined ? { text: m[1], kind: 'strong' } : { text: m[2], kind: 'code' });
    from = m.index + m[0].length;
  }
  if (from < text.length) out.push({ text: text.slice(from), kind: 'plain' });
  return out;
}

/** Whether a choice leaves the guide for another page of the site. */
export function isPage(to: string): boolean {
  return to.startsWith('/');
}
