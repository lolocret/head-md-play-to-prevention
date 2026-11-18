# Code: Echo (playable prototype)

A story played **from a phone**: the computer only displays (the place, the text, Echo's state), and everything the player does happens on the phone. A phone is required.

```
cd server
npm install      # only the first time
npm start
```
Open http://localhost:3000 on the computer. Three short pages of introduction, then a name (and an optional profile photo), then a QR code. Scan it with the phone (same Wi-Fi, or through a tunnel, see below), tap "Ouvrir", keep the page open. If the phone disconnects, the game waits and shows the QR code again.

## What the player sees and does
- **Computer:** the picture of the place, the story text at the bottom, a gauge (a flower in bloom on the left, a wilted one on the right, a bar between). The scene darkens while the player answers.
- **Phone, one main screen:** the question and the choices (or "Look at the screen"). Messages (Nexus) and the journal are two small buttons at the top; a pink dot says there is something new.
- **No walking, no free exploration:** the story takes the player from scene to scene by itself.

## Profile photo (optional)
Next to the name, the player can add a photo: she frames it (drag and zoom, like on WhatsApp) and it becomes a cyberpunk portrait (`avatar.js`, `cropper.js`). The photo is processed in the browser only; it is not saved or uploaded. Only a small 96 px version of the transformed image goes to the phone, where it appears next to "NEXUS". Without a photo, nothing is shown.

## The story
- Nineteen scenes, in French (add `?lang=en` for English). Echo is in some of them with a different mood: open if the bond is strong, wary if the player hurt more than helped. The scene "Echo, at Altaya" only happens if the bond is strong.
- A choice made "for fun" comes back later: a message on the phone and a line in the journal (the `later` part of a choice in `story.js`).
- The endings are named for what happens to Echo ("Echo short-circuits", "Echo doesn't come back", "Echo stays"). After an ending that is not "Echo stays", the phone offers to go back to the last scene.
- Nexus messages arrive spread out; only the first message of a scene and the group events make a banner and a sound. Images (a video still, a meme) arrive as real pictures.
- The journal has one short entry per scene (what you did and how it felt) and a few questions the player answers in her own words. What she writes stays on her phone.

## Files
- `story.js`: all the text, choices and their points (`harass`, `passive`, `help`, `bond`), the introduction, the title page. `{name}` in any text becomes the player's name.
- `nexus.js`: the Nexus messages and when they arrive. `scene.js`: where each scene happens and who is there. `game.js`: the flow. `link.js`: the connection to the server.
- `avatar.js`, `cropper.js`: the optional profile photo (cyberpunk filter, framing). `phone.html`, `phone.js`, `phone.css`: the page the phone opens. `flower.js`: Echo's flowers. `lib/qrcode.min.js`: QR code (MIT).
- `../server/server.js`: serves the game and passes messages between computer and phone, by 4-letter room code.
- `images/`: one picture per place (`couloir`, `classe`, `toit`, `serre`, `altaya`, `chambre`), the introduction pictures, the meme and the video still. Characters: `images/characters/echo.png` (and `kovasko.png`, `clarisse.png`, `student.png` if you add them).

## Rules (placeholders, to tune in `story.js`)
- Gauge stages follow `harass`: 3 = bugs, 6 = seizure-like crises, 9 = Echo short-circuits. Echo's flowers close with the same value.
- Ending: gauge at the maximum, then "Echo short-circuits"; else enough `help` (5+, and at least `passive`), then "Echo stays"; else "Echo doesn't come back".
- The point values are not from the course text.

## Phone: the same on iPhone and Android
Sound and a small shake for every message, a pink notification for group events, grey silence when the player is left out. Vibration is added where the browser allows it (most Android phones; iPhone browsers do not). Notifications with the screen locked and the pointer are not used.

## Tunnel (when the Wi-Fi blocks the phone)
Run `cloudflared tunnel --url http://localhost:3000`, then open the game on the computer with `http://localhost:3000/?base=<the https address it prints>`. The QR code then points to the tunnel.
