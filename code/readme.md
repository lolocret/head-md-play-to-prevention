# Code: Echo (playable prototype)

A visual novel in the browser, no installation needed. Open `index.html` (or use the Live Server extension in VS Code).

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

## Not done yet
Altaya image, character images, phone/iPad connection (group messages), sound.
