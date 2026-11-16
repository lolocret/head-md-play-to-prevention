using System;

// Data model for Assets/Resources/story.json (read with JsonUtility).

[Serializable]
public class LText
{
    public string fr;
    public string en;
    public string Get(bool french) { return french ? fr : en; }
}

[Serializable]
public class Choice
{
    public LText label;
    public int harass;   // adds to the harassment gauge
    public int passive;  // counts as staying passive
    public int help;     // counts as helping Echo
    public int bond;     // changes the bond between the player and Echo
}

[Serializable]
public class Beat
{
    public string id;
    public LText title;
    public LText text;
    public LText prompt;     // question shown above the choices (optional)
    public Choice[] choices; // empty = a simple "Continue" button
}

[Serializable]
public class Ending
{
    public string id;        // "harass", "passive", "help"
    public LText title;
    public LText text;
}

[Serializable]
public class Story
{
    public int harassStage1;   // gauge stage 1: Echo starts to bug
    public int harassStage2;   // gauge stage 2: seizure-like crises
    public int harassStage3;   // gauge stage 3: Echo becomes a harasser
    public int helpToSucceed;  // help points needed for the good ending
    public int bondToUnlock;   // bond needed to unlock Echo's story (lore)
    public Beat[] beats;
    public Ending[] endings;
    public LText[] stages;     // labels for gauge stages 0..3
    public LText[] roles;      // 0 witness, 1 accomplice, 2 ally
    public LText loreUnlocked;
    public LText loreClosed;
}
