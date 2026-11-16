// Runtime state of one playthrough. Only the player makes choices.
public class GameState
{
    public int harass;
    public int passive;
    public int help;
    public int bond;

    public void Apply(Choice c)
    {
        harass += c.harass;
        passive += c.passive;
        help += c.help;
        bond += c.bond;
    }

    // 0 = fine, 1 = bugs, 2 = seizure-like crises, 3 = Echo becomes a harasser.
    public int Stage(Story s)
    {
        if (harass >= s.harassStage3) return 3;
        if (harass >= s.harassStage2) return 2;
        if (harass >= s.harassStage1) return 1;
        return 0;
    }

    public string EndingId(Story s)
    {
        if (Stage(s) >= 3) return "harass";
        if (help >= s.helpToSucceed && help >= passive) return "help";
        return "passive";
    }

    // 0 witness, 1 accomplice, 2 ally
    public int Role()
    {
        if (harass > help && harass >= passive) return 1;
        if (help > harass && help >= passive) return 2;
        return 0;
    }
}
