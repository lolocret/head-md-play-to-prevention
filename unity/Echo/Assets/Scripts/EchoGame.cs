using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

// Builds the whole UI from code and runs the story, so an empty scene is enough:
// open any scene and press Play (the game boots itself).
public class EchoGame : MonoBehaviour
{
    static bool booted;

    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
    static void Boot()
    {
        if (booted) return;
        booted = true;
        new GameObject("EchoGame").AddComponent<EchoGame>();
    }

    Story story;
    GameState state;
    int beatIndex;
    bool french = true;
    bool finished;

    Font font;
    Text titleText, bodyText, promptText, gaugeText, langLabel;
    Image gaugeFill;
    RectTransform choicesPanel;

    static readonly Color Bg = new Color(0.04f, 0.04f, 0.06f);
    static readonly Color Panel = new Color(0.11f, 0.11f, 0.12f);
    static readonly Color Grey = new Color(0.62f, 0.62f, 0.66f);
    static readonly Color Pink = new Color(0.95f, 0.35f, 0.7f);

    void Awake()
    {
        DontDestroyOnLoad(gameObject);
        TextAsset json = Resources.Load<TextAsset>("story");
        if (json == null) { Debug.LogError("Assets/Resources/story.json is missing."); return; }
        story = JsonUtility.FromJson<Story>(json.text);
        font = LoadFont();
        BuildUI();
        Restart();
    }

    static Font LoadFont()
    {
        Font f = null;
        try { f = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf"); } catch { }
        if (f == null) { try { f = Resources.GetBuiltinResource<Font>("Arial.ttf"); } catch { } }
        return f;
    }

    void Restart()
    {
        state = new GameState();
        beatIndex = 0;
        finished = false;
        Show();
    }

    // ---------------------------------------------------------------- flow

    void Show()
    {
        foreach (Transform t in choicesPanel) Destroy(t.gameObject);
        UpdateGauge();

        if (finished) { ShowEnding(); return; }

        Beat b = story.beats[beatIndex];
        titleText.text = b.title.Get(french);
        bodyText.text = b.text.Get(french);
        bool hasChoices = b.choices != null && b.choices.Length > 0;
        promptText.text = hasChoices && b.prompt != null ? b.prompt.Get(french) : "";

        if (hasChoices)
        {
            foreach (Choice c in b.choices)
            {
                Choice captured = c;
                AddButton(c.label.Get(french), () => { state.Apply(captured); Next(); });
            }
        }
        else
        {
            AddButton(french ? "Continuer" : "Continue", Next);
        }
    }

    void Next()
    {
        beatIndex++;
        if (beatIndex >= story.beats.Length) finished = true;
        Show();
    }

    void ShowEnding()
    {
        string id = state.EndingId(story);
        Ending e = null;
        foreach (Ending x in story.endings) if (x.id == id) e = x;
        if (e == null) e = story.endings[0];

        titleText.text = e.title.Get(french);
        bodyText.text = e.text.Get(french);
        string role = story.roles[state.Role()].Get(french);
        string lore = (state.bond >= story.bondToUnlock ? story.loreUnlocked : story.loreClosed).Get(french);
        promptText.text = (french ? "Ton titre : " : "Your title: ") + role + "\n" + lore;
        AddButton(french ? "Rejouer" : "Play again", Restart);
    }

    void UpdateGauge()
    {
        int stage = state.Stage(story);
        float v = Mathf.Clamp01(state.harass / (float)Mathf.Max(1, story.harassStage3));
        gaugeFill.fillAmount = v;
        gaugeFill.color = Color.Lerp(new Color(0.4f, 0.9f, 0.8f), Pink, v);
        gaugeText.text = (french ? "État d'Echo : " : "Echo's state: ") + story.stages[stage].Get(french);
    }

    // ---------------------------------------------------------------- UI

    void BuildUI()
    {
        if (FindObjectOfType<EventSystem>() == null)
        {
            GameObject es = new GameObject("EventSystem");
            es.AddComponent<EventSystem>();
            es.AddComponent<StandaloneInputModule>();
        }

        GameObject cgo = new GameObject("Canvas");
        cgo.transform.SetParent(transform, false);
        Canvas canvas = cgo.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        CanvasScaler scaler = cgo.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1280, 720);
        scaler.matchWidthOrHeight = 0.5f;
        cgo.AddComponent<GraphicRaycaster>();

        RectTransform root = cgo.GetComponent<RectTransform>();
        Image bg = MakeImage(root, "Background", Bg);
        Stretch(bg.rectTransform, 0, 0, 0, 0);

        // gauge (top right)
        RectTransform gaugeBox = MakeImage(root, "GaugeBack", Panel).rectTransform;
        Anchor(gaugeBox, new Vector2(1, 1), new Vector2(1, 1), new Vector2(-30, -30), new Vector2(360, 18));
        gaugeFill = MakeImage(gaugeBox, "GaugeFill", Color.white);
        gaugeFill.type = Image.Type.Filled;
        gaugeFill.fillMethod = Image.FillMethod.Horizontal;
        gaugeFill.fillOrigin = 0;
        Stretch(gaugeFill.rectTransform, 0, 0, 0, 0);
        gaugeText = MakeText(root, "GaugeText", 16, Grey, TextAnchor.MiddleRight);
        Anchor(gaugeText.rectTransform, new Vector2(1, 1), new Vector2(1, 1), new Vector2(-30, -60), new Vector2(360, 26));

        // language button (top left)
        Button lang = MakeButton(root, "Lang", out langLabel, 16);
        langLabel.text = "FR / EN";
        Anchor(lang.GetComponent<RectTransform>(), new Vector2(0, 1), new Vector2(0, 1), new Vector2(30, -30), new Vector2(110, 36));
        lang.onClick.AddListener(() => { french = !french; Show(); });

        // story card
        titleText = MakeText(root, "Title", 40, Color.white, TextAnchor.UpperLeft);
        titleText.fontStyle = FontStyle.Bold;
        Anchor(titleText.rectTransform, new Vector2(0.5f, 1), new Vector2(0.5f, 1), new Vector2(0, -120), new Vector2(900, 60));

        bodyText = MakeText(root, "Body", 24, Grey, TextAnchor.UpperLeft);
        Anchor(bodyText.rectTransform, new Vector2(0.5f, 1), new Vector2(0.5f, 1), new Vector2(0, -190), new Vector2(900, 220));

        promptText = MakeText(root, "Prompt", 24, Color.white, TextAnchor.UpperLeft);
        promptText.fontStyle = FontStyle.Bold;
        Anchor(promptText.rectTransform, new Vector2(0.5f, 0), new Vector2(0.5f, 0), new Vector2(0, 330), new Vector2(900, 90));

        choicesPanel = new GameObject("Choices", typeof(RectTransform)).GetComponent<RectTransform>();
        choicesPanel.SetParent(root, false);
        Anchor(choicesPanel, new Vector2(0.5f, 0), new Vector2(0.5f, 0), new Vector2(0, 40), new Vector2(900, 280));
        choicesPanel.pivot = new Vector2(0.5f, 0);
        VerticalLayoutGroup v = choicesPanel.gameObject.AddComponent<VerticalLayoutGroup>();
        v.spacing = 10;
        v.childAlignment = TextAnchor.LowerCenter;
        v.childControlWidth = true;
        v.childControlHeight = true;
        v.childForceExpandWidth = true;
        v.childForceExpandHeight = false;
    }

    void AddButton(string label, UnityEngine.Events.UnityAction onClick)
    {
        Text t;
        Button b = MakeButton(choicesPanel, "Choice", out t, 22);
        t.text = label;
        LayoutElement le = b.gameObject.AddComponent<LayoutElement>();
        le.minHeight = 52;
        le.preferredHeight = 52;
        b.onClick.AddListener(onClick);
    }

    Button MakeButton(RectTransform parent, string name, out Text label, int size)
    {
        Image img = MakeImage(parent, name, Panel);
        Button b = img.gameObject.AddComponent<Button>();
        ColorBlock cb = b.colors;
        cb.normalColor = Color.white;
        cb.highlightedColor = new Color(0.85f, 0.85f, 1f);
        cb.pressedColor = new Color(0.7f, 0.7f, 0.9f);
        b.colors = cb;
        b.targetGraphic = img;
        label = MakeText(img.rectTransform, "Label", size, Color.white, TextAnchor.MiddleLeft);
        Stretch(label.rectTransform, 18, 18, 4, 4);
        return b;
    }

    Image MakeImage(RectTransform parent, string name, Color c)
    {
        GameObject go = new GameObject(name, typeof(RectTransform), typeof(Image));
        go.transform.SetParent(parent, false);
        Image i = go.GetComponent<Image>();
        i.color = c;
        return i;
    }

    Text MakeText(RectTransform parent, string name, int size, Color c, TextAnchor anchor)
    {
        GameObject go = new GameObject(name, typeof(RectTransform), typeof(Text));
        go.transform.SetParent(parent, false);
        Text t = go.GetComponent<Text>();
        t.font = font;
        t.fontSize = size;
        t.color = c;
        t.alignment = anchor;
        t.horizontalOverflow = HorizontalWrapMode.Wrap;
        t.verticalOverflow = VerticalWrapMode.Overflow;
        t.raycastTarget = false;
        return t;
    }

    static void Stretch(RectTransform r, float l, float rt, float b, float t)
    {
        r.anchorMin = Vector2.zero;
        r.anchorMax = Vector2.one;
        r.offsetMin = new Vector2(l, b);
        r.offsetMax = new Vector2(-rt, -t);
    }

    static void Anchor(RectTransform r, Vector2 min, Vector2 max, Vector2 pos, Vector2 size)
    {
        r.anchorMin = min;
        r.anchorMax = max;
        r.pivot = new Vector2(min.x == 1 ? 1 : (min.x == 0 ? 0 : 0.5f), min.y == 1 ? 1 : (min.y == 0 ? 0 : 0.5f));
        r.anchoredPosition = pos;
        r.sizeDelta = size;
    }
}
