import { lazy, Suspense, useEffect, useState } from "react";
import IntroScreen from "./screens/IntroScreen.jsx";
import { LanguageToggle } from "./i18n.jsx";

const loadVentScreen = () => import("./screens/VentScreen.jsx");
const loadMeritScreen = () => import("./screens/MeritScreen.jsx");
const VentScreen = lazy(loadVentScreen);
const MeritScreen = lazy(loadMeritScreen);

// App — Intro -> (Vent or skip) -> Merit, with ink-wipe transitions.
// Merit accumulates across sessions in localStorage so "today's merit" can
// be banked ahead of the next venting cycle.

const BANK_KEY = "basta-merit-bank";
const LEGACY_BANK_KEY = "egg-toss-merit-bank";

function readBank() {
  const raw = Number(localStorage.getItem(BANK_KEY) ?? localStorage.getItem(LEGACY_BANK_KEY));
  return Number.isFinite(raw) && raw >= 0 ? raw : 0;
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [sins, setSins] = useState(0);
  const [wiping, setWiping] = useState(false);
  const [bank, setBank] = useState(readBank);

  useEffect(() => {
    localStorage.setItem(BANK_KEY, String(bank));
  }, [bank]);

  useEffect(() => {
    const warmNextScreens = () => {
      loadVentScreen();
      loadMeritScreen();
    };
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(warmNextScreens, { timeout: 1500 })
      : window.setTimeout(warmNextScreens, 700);
    return () => window.requestIdleCallback
      ? window.cancelIdleCallback(idleId)
      : window.clearTimeout(idleId);
  }, []);

  function goto(target, sinCount) {
    setWiping(true);
    setTimeout(() => {
      if (typeof sinCount === "number") setSins(sinCount);
      setScreen(target);
      setTimeout(() => setWiping(false), 50);
    }, 360);
  }

  function gotoMerit(sinCount = 0) {
    window.GameAudio && window.GameAudio.startBGM("buddhist");
    goto("merit", sinCount);
  }

  // MeritScreen reports its final merit total (= startingBank + earned this session).
  function finishMerit(finalMerit) {
    if (typeof finalMerit === "number") {
      setBank(Math.max(0, finalMerit - sins));
    }
    goto("intro", 0);
  }

  const bg =
    screen === "intro" ? "var(--vent-ink)" :
    screen === "vent"  ? "var(--vent-ink)" :
                         "var(--merit-rice)";

  return (
    <main className="app-shell" style={{ background: bg }}>
      <LanguageToggle />
      {screen === "intro" && (
        <IntroScreen
          bank={bank}
          onStart={() => goto("vent")}
          onSkipToMerit={() => gotoMerit(0)}
        />
      )}
      <Suspense fallback={null}>
        {screen === "vent" && (
          <VentScreen onBack={() => goto("intro")} onComplete={(hits) => gotoMerit(hits)} />
        )}
        {screen === "merit" && (
          <MeritScreen
            sinsToOffset={sins}
            startingMerit={bank}
            onDone={finishMerit}
          />
        )}
      </Suspense>
      {wiping && <div className="ink-wipe" />}
    </main>
  );
}
