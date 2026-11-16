# Echo — Unity prototype (first version)

A text-and-choice prototype of the first five scenes, the harassment gauge and the three endings.
Only the player makes choices.

## Open it
1. Unity Hub → **Add project from disk** → select this `unity/Echo` folder.
2. Pick any recent editor (Unity 2022.3 LTS or Unity 6). Unity creates `ProjectSettings` and `Library` on first open.
3. Open or create any scene and press **Play**. `EchoGame` boots itself and builds the UI from code (no scene setup needed).

## Where things are
- `Assets/Resources/story.json` — all text (FR/EN), choices and their points. Edit this to change the story.
- `Assets/Scripts/StoryModel.cs` — data classes for the JSON.
- `Assets/Scripts/GameState.cs` — harassment / passive / help / bond counters, gauge stages, ending and role.
- `Assets/Scripts/EchoGame.cs` — story flow and the UI.

## Rules in this first version (to tune in `story.json`)
- Each choice adds points: harass, passive, help, and a bond value.
- Gauge stages follow harassment: 2 = bugs, 4 = seizure-like crises, 6 = Echo becomes a harasser.
- Ending: harassment ≥ 6 → "If you harass"; else help ≥ 3 and help ≥ passive → "If you help Echo"; else "If you stay passive".
- Title: witness, accomplice or ally, from the points. Bond ≥ 3 unlocks Echo’s story (lore).
- The point values are placeholders, not from the course text.

## Not done yet
Scenes 6–8 (turn it off, origins, Friday), phone/iPad connection, art, sound, flowers animation.
