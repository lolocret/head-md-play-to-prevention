# Code: Echo (playable prototype)

A visual novel in the browser, played with a phone: **the computer only displays, and everything you do happens on the phone** (choices, moving between places, "Continue", "Play again"). A phone is required.

```
cd server
npm install      # only the first time
npm start
```
Open http://localhost:3000 on the computer. After choosing a name (and, if you want, a photo), a 3D phone opening Nexus and a QR code appear. Scan the QR code with a phone **on the same Wi-Fi** (or use a tunnel, see below), tap "Ouvrir Nexus", and keep the page open. If the phone disconnects, the game waits and shows the QR code again.

## What it is
- Title page, introduction, then the choice of a name and an avatar: a coloured silhouette, or the player's own photo turned into a cyberpunk portrait (`avatar.js`). The photo is processed in the browser only; it is not saved or uploaded, and only a small 96 px version of the transformed image is shown on the phone.
- Scenes like Street View: each place is a full-screen image (hallway, class 3B, roof, La Serre, Altaya).
- **Altaya is hidden** until the player’s bond with Echo is strong enough (`bondToUnlock` in `story.js`).
- The story appears in a box at the bottom of the computer screen. The scene darkens while the player answers on the phone. The gauge shows a face and a green-orange-red bar, with no label.
- Scenes like Street View: the player moves between places from the phone ("Choix" tab: the ways out, the pink one leads to the next scene).
- A journal on the phone: one short entry per scene (what you did and how it felt), plus one per conversation. Nexus messages arrive spread out; only the first message of a scene and the group events make a noise or a banner. Helping Echo has a small emotional cost written in it. 
- Fourteen scenes and five optional conversations ("Talk to Echo / Kovasko / Clarisse" appears on the phone when you are in the right place, in free time). Echo is always there but not the same: open if the bond is strong, wary if you hurt more than you helped. French by default; add `?lang=en` to the address for English. At the end, the player sees Echo’s state (no role title).

## Files
- `story.js`: all the text, choices and their points (`harass`, `passive`, `help`, `bond`), journal entries, title page, intro. Edit this to change the story.
- `scene.js`: the places, the arrows between them, and where each scene happens.
- `game.js`: the game flow (title, intro, avatar, scenes, endings, journal, gauge).
- `style.css`, `index.html`: look and layout.
- `images/`: one background per place (`couloir`, `classe`, `toit`, `serre`, `altaya`). See `images/README.md`. Characters go in `images/characters/` (`echo.png`, `kovasko.png`, `clarisse.png`, `student.png`, transparent PNG).

## Rules (placeholders, to tune in `story.js`)
- Gauge stages follow `harass`: 2 = bugs, 4 = seizure-like crises, 6 = Echo short-circuits.
- Ending: gauge at the maximum, then "If you harass"; else enough `help` (3+, and at least `passive`), then "If you help Echo"; else "If you stay passive".
- The point values are not from the course text.

## Phone: the same on iPhone and Android
The experience is the same on every phone. It does not rely on vibration, system notifications or motion sensors, which behave differently on iPhone.
- A message: a short two-note sound, a small shake of the screen and a notification banner at the top of the phone (tap it to open the conversation).
- A group event (added to a group, removed from a group): a pink notification, a three-note sound and, on Android, a stronger vibration.
- Vibration works on most Android phones; iPhone browsers do not allow it, so everyone also gets the sound and the shake.
- A cold answer: a low, dull sound and a heavy wobble.
- Being removed from a group: two low notes and the whole screen turns grey and dim for a few seconds (silence).
- The phone keeps its screen on (wake lock) so the page stays connected. The sound needs one tap on "Ouvrir Nexus" first.
- Lost on purpose: notifications with the screen locked, the pointer (choosing by pointing the phone at the screen).
- The journal is also on the phone: the entries fill in as on the computer, and at intense moments a question appears for the player to answer in her own words. What she writes stays on her phone (saved in the phone's browser).
- Not done yet: reacting from the phone (like, comment, leave the group), and sharing a sentence anonymously with the facilitator.

## Files for the phone
- `link.js`: the computer's connection to the server. `nexus.js`: all the Nexus messages and when they arrive.
- `phone.html`, `phone.js`, `phone.css`: the page the phone opens. `lib/qrcode.min.js`: QR code (MIT).
- `../server/server.js`: serves the game and passes messages between computer and phone, by 4-letter room code.

## Not done yet
Images for Altaya and "Chez toi" (the night scene), character images, sound.
