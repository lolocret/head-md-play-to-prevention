# Code: Echo (playable prototype)

A visual novel in the browser. Two ways to play:

- **Alone, without a phone:** open `index.html` (or use Live Server in VS Code).
- **With the phone (Nexus):** start the small server, then open the game from it.
  ```
  cd server
  npm install      # only the first time
  npm start
  ```
  Open http://localhost:3000 on the computer. After choosing the avatar, a 3D phone opening Nexus and a QR code appear. Scan the QR code with a phone **on the same Wi-Fi**, tap "Ouvrir Nexus", and keep the page open. Nexus messages then arrive on the phone as the story goes: the class group, the "Humans of 3B only" group, the private group of Clarisse. Helping Echo brings cold answers and sometimes a "removed from the group" notice, with the screen going grey.

## What it is
- Title page, introduction, then the choice of a name and an avatar.
- Scenes like Street View: each place is a full-screen image, and you walk between places by clicking arrows (hallway, class 3B, roof, La Serre, Altaya).
- **Altaya is hidden** until the player’s bond with Echo is strong enough (`bondToUnlock` in `story.js`).
- The story and choices appear in a box at the bottom. The gauge shows a face and a green-orange-red bar, with no label.
- A journal, already written, that fills in scene after scene. Helping Echo has a small emotional cost written in it.
- Ten scenes, FR / EN. At the end, the player sees Echo’s state (no role title).

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
- A message: a short two-note sound, a small shake of the screen and a banner in the page.
- A cold answer: a low, dull sound and a heavy wobble.
- Being removed from a group: two low notes and the whole screen turns grey and dim for a few seconds (silence).
- The phone keeps its screen on (wake lock) so the page stays connected. The sound needs one tap on "Ouvrir Nexus" first.
- Lost on purpose: vibration, notifications with the screen locked, the pointer (choosing by pointing the phone at the screen).
- The journal is also on the phone: the entries fill in as on the computer, and at intense moments a question appears for the player to answer in her own words. What she writes stays on her phone (saved in the phone's browser).
- Not done yet: reacting from the phone (like, comment, leave the group), and sharing a sentence anonymously with the facilitator.

## Files for the phone
- `link.js`: the computer's connection to the server. `nexus.js`: all the Nexus messages and when they arrive.
- `phone.html`, `phone.js`, `phone.css`: the page the phone opens. `lib/qrcode.min.js`: QR code (MIT).
- `../server/server.js`: serves the game and passes messages between computer and phone, by 4-letter room code.

## Not done yet
Altaya image, character images, sound.
