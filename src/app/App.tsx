import { useState, useEffect } from "react";

type Mode = "guided" | "random";
type Theme = "light" | "dark";
type Language = "modern" | "old" | "simple";

const QUESTIONS = [
  {
    key: "lateFor",
    prompt: "What are you late for?",
    options: ["morning meeting", "a deadline", "someone's birthday", "a gym session"],
  },
  {
    key: "tone",
    prompt: "How serious should this sound?",
    options: ["deeply serious", "nonchalant", "suspiciously scientific", "cosmically unavoidable"],
  },
  {
    key: "blame",
    prompt: "Who's to blame?",
    options: ["the universe", "infrastructure", "a rogue household item", "my own physiology"],
  },
  {
    key: "signoff",
    prompt: "How do you sign off?",
    options: ["apologetically", "with full confidence", "mysteriously", "as a victim"],
  },
] as const;

const OPENERS: Record<string, string[]> = {
  "deeply serious": [
    "I regret to inform you",
    "It is with a heavy heart that I must explain",
    "Please understand the gravity of this:",
    "I have spent the last hour processing what happened.",
    "There is no easy way to say this,",
    "I take full responsibility, but first some context:",
    "I would not raise this if it were not significant.",
    "After much reflection, I must share that",
    "I have rehearsed this message several times:",
    "What I am about to describe is true and verified.",
  ],
  "nonchalant": [
    "So anyway,",
    "Funny story —",
    "Listen, no big deal, but",
    "Yeah, about that.",
    "Quick heads up —",
    "Whatever, here's what happened:",
    "Look,",
    "Don't sweat it, but",
    "Real quick:",
    "Eh, so",
  ],
  "suspiciously scientific": [
    "According to my preliminary findings,",
    "After careful peer review of the timeline,",
    "Empirical evidence suggests that",
    "A controlled study of my morning revealed",
    "Per a longitudinal analysis,",
    "The data is unambiguous:",
    "Statistical regression of my schedule indicates that",
    "After triangulating three independent sources, it is clear that",
    "The control group performed normally; however, in my case,",
    "A double-blind review of the morning concluded that",
  ],
  "cosmically unavoidable": [
    "The cosmos had other plans.",
    "It was written in the stars, and not by me.",
    "Forces beyond my comprehension intervened.",
    "The universe filed an objection.",
    "Fate, frankly, was uncooperative today.",
    "An ancient prophecy was fulfilled this morning.",
    "Destiny rerouted me through unforeseen corridors.",
    "The wheel of fortune turned away from punctuality.",
    "A celestial committee voted against my arrival.",
    "The threads of fate were briefly tangled in my hallway.",
  ],
};

const INCIDENTS: Record<string, string[]> = {
  "the universe": [
    "a small tear in spacetime opened in my hallway",
    "gravity behaved erratically near the front door",
    "a localized time loop kept replaying my breakfast",
    "the sun rose on a slightly inconvenient schedule",
    "Mercury was, unfortunately, in retrograde",
    "a rogue parallel timeline briefly merged with this one",
    "my shadow detached for approximately twelve minutes",
    "the laws of thermodynamics took a personal day",
    "an unscheduled eclipse occurred in my kitchen",
    "the calendar itself appeared to skip a beat",
    "a quiet singularity formed under my coffee table",
  ],
  "infrastructure": [
    "every traffic light synchronized against me",
    "the elevator decided to meditate between floors",
    "the subway became a philosophical exercise",
    "my building's plumbing held an emergency summit",
    "the wifi router achieved sentience and refused",
    "construction crews appeared overnight, exclusively on my route",
    "the bus driver took what he called 'the scenic route'",
    "a single rogue scooter blocked an entire intersection",
    "the parking garage gate developed strong opinions",
    "the crosswalk countdown seemed to count upward",
    "a power flicker reset every clock in a one-mile radius",
  ],
  "a rogue household item": [
    "the toaster issued a formal protest",
    "my coffee maker entered an unscheduled hibernation",
    "a houseplant tipped over with clear intent",
    "the dishwasher staged a one-appliance walkout",
    "my alarm clock unionized",
    "the vacuum cleaner began chasing me unprovoced",
    "the refrigerator started humming threats",
    "a single sock vanished into a higher dimension",
    "the kettle whistled in what can only be described as Morse code",
    "the microwave skipped straight to the year 2031",
    "the smoke alarm interpreted my toast as performance art",
  ],
  "my own physiology": [
    "my legs simply refused to cooperate",
    "my circadian rhythm filed for divorce",
    "an unprecedented yawn lasted nine minutes",
    "my eyelids and I disagreed on priorities",
    "my body insisted on a brief unscheduled reboot",
    "an inner ear rebellion delayed all forward motion",
    "my left foot fell asleep and refused to be woken",
    "a sneeze of historic proportions cost me valuable seconds",
    "my brain attempted to render my morning at half framerate",
    "my reflexes were operating on a delayed satellite link",
    "a hiccup loop briefly held me hostage",
  ],
};

const IMPACTS: Record<string, string[]> = {
  "morning meeting": [
    "which made arriving on time mathematically impossible.",
    "and the meeting started without my unique perspective.",
    "so the agenda will have to wait for me.",
    "rendering punctuality a distant fantasy.",
    "and the standup is now a sit-down without me.",
    "so the calendar invite will outlive my attendance.",
    "and the icebreaker happened in my conspicuous absence.",
    "leaving the conference room dimly lit and one chair short.",
    "and the round of introductions will, regrettably, be incomplete.",
    "so the action items must be assigned without my consent.",
  ],
  "a deadline": [
    "and the deadline gently lapped me.",
    "leaving the deliverable in narrative limbo.",
    "and my Gantt chart wept openly.",
    "so the timeline now exists more as a suggestion.",
    "and the project plan has been revised by reality.",
    "so the milestone has become a memorial.",
    "and the burndown chart is now a burn-up.",
    "leaving the kickoff document in a state of silent reflection.",
    "and the sprint has become more of a leisurely walk.",
    "so the launch date may need a sequel.",
  ],
  "someone's birthday": [
    "and I missed the candles entirely.",
    "so the cake was cut without my emotional support.",
    "leaving the birthday person tragically un-greeted by me.",
    "and the singing happened in my absence.",
    "which means the party proceeded under suboptimal conditions.",
    "and my carefully chosen card remains in my pocket.",
    "so the group photo features a notable gap.",
    "and the wish was made without my contributing energy.",
    "leaving the balloons emotionally underutilized.",
    "and the playlist played to an incomplete audience.",
  ],
  "a gym session": [
    "and my workout window collapsed in on itself.",
    "leaving the treadmill cold and lonely.",
    "so my gains have been postponed indefinitely.",
    "and leg day has, regrettably, become legend day.",
    "rendering my pre-workout chemically obsolete.",
    "so the dumbbells will rest a little longer in my honor.",
    "and the locker room remains tragically un-graced.",
    "leaving my heart rate stubbornly resting.",
    "and my protein shake is now just a sad smoothie.",
    "so my streak has become a strongly worded memory.",
  ],
};

const SIGNOFFS: Record<string, string[]> = {
  "apologetically": [
    "I am so, so sorry.",
    "Please forgive me — truly.",
    "I cannot apologize enough.",
    "Sincerest regrets all around.",
    "My deepest apologies for the inconvenience.",
    "Words cannot capture how sorry I am.",
    "I will be apologizing about this for weeks.",
    "Please accept this as a heartfelt mea culpa.",
  ],
  "with full confidence": [
    "Anyway, see you soon.",
    "No further questions.",
    "I trust you understand.",
    "We're good, right?",
    "Moving on.",
    "Glad we cleared that up.",
    "I consider the matter closed.",
    "Onward.",
  ],
  "mysteriously": [
    "More cannot be said at this time.",
    "Some things must remain unspoken.",
    "You'll understand one day. Maybe.",
    "The full story will emerge eventually.",
    "I've said too much already.",
    "Ask me again in seven years.",
    "The rest is sealed for reasons of safety.",
    "The truth, like fog, will lift in its own time.",
  ],
  "as a victim": [
    "Truly, I am the one who suffered most here.",
    "Spare a thought for me in all of this.",
    "I am, frankly, the real casualty.",
    "Please, no flowers — just understanding.",
    "I will recover, in time.",
    "It is hard being me, especially today.",
    "Pity is welcome; advice is not.",
    "I shall endure, somehow, despite everything.",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildExcuse(answers: { lateFor: string; tone: string; blame: string; signoff: string }) {
  const opener = pick(OPENERS[answers.tone]);
  const incident = pick(INCIDENTS[answers.blame]);
  const impact = pick(IMPACTS[answers.lateFor]);
  const signoff = pick(SIGNOFFS[answers.signoff]);
  return `${opener} ${incident}, ${impact} ${signoff}`;
}

function randomExcuse() {
  return buildExcuse({
    lateFor: pick(QUESTIONS[0].options as readonly string[] as string[]),
    tone: pick(QUESTIONS[1].options as readonly string[] as string[]),
    blame: pick(QUESTIONS[2].options as readonly string[] as string[]),
    signoff: pick(QUESTIONS[3].options as readonly string[] as string[]),
  });
}

// Translation layers
const OLD_REPLACEMENTS: [RegExp, string][] = [
  [/\byou are\b/gi, "thou art"],
  [/\byou\b/gi, "thee"],
  [/\byour\b/gi, "thy"],
  [/\byours\b/gi, "thine"],
  [/\bI am\b/g, "I be"],
  [/\bI'm\b/g, "I be"],
  [/\bI have\b/g, "I hath"],
  [/\bhas\b/gi, "hath"],
  [/\bdo not\b/gi, "doth not"],
  [/\bdoes\b/gi, "doth"],
  [/\bvery\b/gi, "most"],
  [/\bbefore\b/gi, "ere"],
  [/\bover\b/gi, "o'er"],
  [/\bnever\b/gi, "ne'er"],
  [/\boften\b/gi, "oft"],
  [/\bperhaps\b/gi, "perchance"],
  [/\bhello\b/gi, "hail"],
  [/\bgoodbye\b/gi, "fare thee well"],
  [/\btoday\b/gi, "this very morn"],
  [/\bsorry\b/gi, "most contrite"],
  [/\bmeeting\b/gi, "council"],
  [/\bdeadline\b/gi, "appointed hour"],
  [/\bbirthday\b/gi, "natal feast"],
  [/\bgym\b/gi, "training grounds"],
  [/\bworkout\b/gi, "labour"],
  [/\bsubway\b/gi, "underground passage"],
  [/\belevator\b/gi, "ascending chamber"],
  [/\btoaster\b/gi, "bread-furnace"],
  [/\bcoffee maker\b/gi, "bean-vessel"],
  [/\bcoffee\b/gi, "dark brew"],
  [/\brefrigerator\b/gi, "cold-chest"],
  [/\bdishwasher\b/gi, "scullion-engine"],
  [/\bvacuum cleaner\b/gi, "dust-beast"],
  [/\bmicrowave\b/gi, "thunder-box"],
  [/\bwifi\b/gi, "aetheric signal"],
  [/\brouter\b/gi, "signal-keeper"],
  [/\btraffic light\b/gi, "lantern of passage"],
  [/\bcar\b/gi, "carriage"],
  [/\bbus\b/gi, "great wagon"],
  [/\bdata\b/gi, "scrolls of evidence"],
  [/\buniverse\b/gi, "heavens"],
  [/\bcosmos\b/gi, "firmament"],
  [/\bphone\b/gi, "speaking-stone"],
];

function toOldEnglish(text: string) {
  let out = text;
  for (const [re, rep] of OLD_REPLACEMENTS) out = out.replace(re, rep);
  const prefixes = ["Hark! ", "Verily, ", "Forsooth, ", "Pray, hear me — ", "Lo! "];
  return prefixes[Math.floor(Math.random() * prefixes.length)] + out;
}

const SIMPLE_REPLACEMENTS: [RegExp, string][] = [
  [/\bI regret to inform you\b/gi, "Bad news"],
  [/\bIt is with a heavy heart that I must explain\b/gi, "I have to say"],
  [/\bPlease understand the gravity of this:?/gi, "This is big:"],
  [/\bAccording to my preliminary findings,?/gi, "I think"],
  [/\bAfter careful peer review of the timeline,?/gi, "I checked, and"],
  [/\bEmpirical evidence suggests that\b/gi, "It looks like"],
  [/\bA controlled study of my morning revealed\b/gi, "My morning showed"],
  [/\bPer a longitudinal analysis,?/gi, "Over time,"],
  [/\bThe data is unambiguous:?/gi, "It is clear:"],
  [/\bStatistical regression of my schedule indicates that\b/gi, "My schedule shows"],
  [/\bAfter triangulating three independent sources, it is clear that\b/gi, "I am sure that"],
  [/\bA double-blind review of the morning concluded that\b/gi, "My morning showed"],
  [/\bThe cosmos had other plans\b/gi, "The world had other ideas"],
  [/\bForces beyond my comprehension intervened\b/gi, "Big things got in the way"],
  [/\bThe universe filed an objection\b/gi, "The world said no"],
  [/\bAn ancient prophecy was fulfilled this morning\b/gi, "An old story came true today"],
  [/\bDestiny rerouted me through unforeseen corridors\b/gi, "I had to go a different way"],
  [/\bA celestial committee voted against my arrival\b/gi, "The sky said no"],
  [/\bmathematically impossible\b/gi, "not possible"],
  [/\bunique perspective\b/gi, "ideas"],
  [/\bnarrative limbo\b/gi, "a weird spot"],
  [/\bemotional support\b/gi, "help"],
  [/\bsuboptimal conditions\b/gi, "bad conditions"],
  [/\bconspicuous absence\b/gi, "missing me"],
  [/\bphilosophical exercise\b/gi, "long think"],
  [/\bunscheduled hibernation\b/gi, "long nap"],
  [/\bunscheduled reboot\b/gi, "restart"],
  [/\binner ear rebellion\b/gi, "ear trouble"],
  [/\bcircadian rhythm\b/gi, "sleep clock"],
  [/\blocalized time loop\b/gi, "time loop"],
  [/\btear in spacetime\b/gi, "hole in time"],
  [/\bMercury was, unfortunately, in retrograde\b/gi, "the stars were bad"],
  [/\brogue parallel timeline\b/gi, "other world"],
  [/\bregrettably,?/gi, "sadly,"],
  [/\bunfortunately,?/gi, "sadly,"],
  [/\btruly,?/gi, "really,"],
  [/\bsincerest regrets all around\b/gi, "I am sorry"],
  [/\bmy deepest apologies for the inconvenience\b/gi, "sorry for the trouble"],
  [/\bI cannot apologize enough\b/gi, "I am very sorry"],
  [/\bWords cannot capture how sorry I am\b/gi, "I am so sorry"],
  [/\bplease accept this as a heartfelt mea culpa\b/gi, "this is my apology"],
  [/\bMore cannot be said at this time\b/gi, "I cannot say more"],
  [/\bSome things must remain unspoken\b/gi, "Some things stay secret"],
  [/\bI've said too much already\b/gi, "I said too much"],
  [/\bapproximately\b/gi, "about"],
  [/\bindefinitely\b/gi, "for now"],
  [/\bregrettable\b/gi, "sad"],
  [/\bsubstantial\b/gi, "big"],
];

function toSimple(text: string) {
  let out = text;
  for (const [re, rep] of SIMPLE_REPLACEMENTS) out = out.replace(re, rep);
  // Lowercase first letter fixups after replacements that start sentences
  out = out.replace(/\.\s+([a-z])/g, (_, c) => `. ${c.toUpperCase()}`);
  out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}

function translate(text: string, lang: Language) {
  if (lang === "old") return toOldEnglish(text);
  if (lang === "simple") return toSimple(text);
  return text;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mode, setMode] = useState<Mode>("guided");
  const [language, setLanguage] = useState<Language>("modern");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [excuse, setExcuse] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const isDark = theme === "dark";
  const accent = "#ff5c38";

  const bg = isDark ? "#0e0e0e" : "#ffffff";
  const fg = isDark ? "#f2f2f2" : "#111111";
  const muted = isDark ? "#888" : "#666";
  const border = isDark ? "#2a2a2a" : "#e5e5e5";

  function maybePaywall() {
    if (Math.random() < 1 / 10) setShowPaywall(true);
  }

  function selectAnswer(key: string, value: string) {
    setFading(true);
    setTimeout(() => {
      const next = { ...answers, [key]: value };
      setAnswers(next);
      if (step === QUESTIONS.length - 1) {
        const built = buildExcuse(next as any);
        setExcuse(built);
        maybePaywall();
      } else {
        setStep(step + 1);
      }
      setFading(false);
    }, 220);
  }

  function reset() {
    setFading(true);
    setTimeout(() => {
      setStep(0);
      setAnswers({});
      setExcuse(null);
      setCopied(false);
      setFading(false);
    }, 220);
  }

  function generateRandom() {
    setFading(true);
    setTimeout(() => {
      setExcuse(randomExcuse());
      setCopied(false);
      maybePaywall();
      setFading(false);
    }, 180);
  }

  function copyExcuse() {
    if (!excuse) return;
    navigator.clipboard?.writeText(translate(excuse, language));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  useEffect(() => {
    reset();
    setExcuse(null);
  }, [mode]);

  const currentQ = QUESTIONS[step];
  const displayedExcuse = excuse ? translate(excuse, language) : null;

  const btnBase: React.CSSProperties = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    background: "transparent",
    color: fg,
    border: `1px solid ${border}`,
    padding: "18px 16px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 160ms ease",
  };

  const langs: { key: Language; label: string }[] = [
    { key: "modern", label: "modern" },
    { key: "old", label: "old english" },
    { key: "simple", label: "simple" },
  ];

  return (
    <div
      className="size-full min-h-screen w-full"
      style={{
        background: bg,
        color: fg,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        transition: "background 200ms ease, color 200ms ease",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 96px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div style={{ letterSpacing: "0.02em" }}>
            <span style={{ color: accent }}>$</span> excuse_generator
          </div>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{ ...btnBase, padding: "6px 12px", fontSize: 12 }}
          >
            {isDark ? "light" : "dark"}
          </button>
        </div>

        {/* Mode + Language toggles */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", border: `1px solid ${border}` }}>
            {(["guided", "random"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  ...btnBase,
                  border: "none",
                  padding: "10px 20px",
                  background: mode === m ? accent : "transparent",
                  color: mode === m ? "#fff" : fg,
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div style={{ display: "inline-flex", border: `1px solid ${border}` }}>
            {langs.map((l) => (
              <button
                key={l.key}
                onClick={() => setLanguage(l.key)}
                style={{
                  ...btnBase,
                  border: "none",
                  padding: "10px 16px",
                  fontSize: 12,
                  background: language === l.key ? accent : "transparent",
                  color: language === l.key ? "#fff" : fg,
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ opacity: fading ? 0 : 1, transition: "opacity 200ms ease" }}>
          {mode === "guided" && !excuse && (
            <div>
              <div style={{ color: muted, marginBottom: 12 }}>
                question {step + 1} / {QUESTIONS.length}
              </div>
              <div style={{ marginBottom: 32, lineHeight: 1.4 }}>{currentQ.prompt}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {currentQ.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectAnswer(currentQ.key, opt)}
                    style={btnBase}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = accent;
                      (e.currentTarget as HTMLButtonElement).style.color = accent;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = border;
                      (e.currentTarget as HTMLButtonElement).style.color = fg;
                    }}
                  >
                    <span style={{ color: muted, marginRight: 10 }}>›</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "random" && !excuse && (
            <div>
              <div style={{ color: muted, marginBottom: 24 }}>no questions. just chaos.</div>
              <button
                onClick={generateRandom}
                style={{
                  ...btnBase,
                  background: accent,
                  color: "#fff",
                  border: `1px solid ${accent}`,
                  padding: "16px 28px",
                }}
              >
                Generate Excuse
              </button>
            </div>
          )}

          {displayedExcuse && (
            <div>
              <div style={{ color: muted, marginBottom: 12 }}>
                your excuse {language !== "modern" && <span>· {language === "old" ? "old english" : "simple"}</span>}
              </div>
              <div
                style={{
                  border: `1px solid ${border}`,
                  padding: 24,
                  lineHeight: 1.6,
                  marginBottom: 20,
                  whiteSpace: "pre-wrap",
                }}
              >
                {displayedExcuse}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={copyExcuse}
                  style={{ ...btnBase, background: accent, color: "#fff", border: `1px solid ${accent}` }}
                >
                  {copied ? "copied!" : "Copy"}
                </button>
                {mode === "guided" ? (
                  <button onClick={reset} style={btnBase}>Try Again</button>
                ) : (
                  <button onClick={generateRandom} style={btnBase}>Generate Another</button>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 72, color: muted, fontSize: 12 }}>
          // disclaimer: not legally binding. probably.
        </div>
      </div>

      {/* fowiohuu mini widget */}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          padding: "8px 12px",
          fontSize: 11,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          color: isDark ? "rgba(242,242,242,0.55)" : "rgba(17,17,17,0.5)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: 4,
          backdropFilter: "blur(4px)",
          letterSpacing: "0.04em",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 40,
        }}
      >
        fowiohuu
      </div>

      {/* Paywall */}
      {showPaywall && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 24,
          }}
        >
          <div
            style={{
              position: "relative",
              background: bg,
              color: fg,
              border: `1px solid ${border}`,
              padding: "56px 40px",
              maxWidth: 460,
              width: "100%",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          >
            <button
              onClick={() => setShowPaywall(false)}
              aria-label="close"
              style={{
                position: "absolute",
                top: -28,
                right: -28,
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: accent,
                color: "#fff",
                border: "none",
                fontSize: 40,
                cursor: "pointer",
                lineHeight: 1,
                fontFamily: "inherit",
                boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
              }}
            >
              ×
            </button>
            <div style={{ marginBottom: 16, color: muted, fontSize: 12 }}>premium offer</div>
            <div style={{ lineHeight: 1.4, marginBottom: 24 }}>
              Unlock your excuse for <span style={{ color: accent }}>$30</span> dollars a month
            </div>
            <div style={{ color: muted, fontSize: 12, lineHeight: 1.6 }}>
              cancel anytime. terms apply. excuses not guaranteed to work on supervisors, partners, or judges.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
