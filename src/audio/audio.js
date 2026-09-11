/* Audio engine — WebAudio synth, no external assets.
 * SFX: fishTok, slap, splat(kind), bell
 * BGM: start(mode) / stop()  modes: buddhist | christian | muslim
 * Global: mute(bool), isMuted()
 */
(function () {
  let ctx = null;
  const MUTE_KEY = "basta-muted";
  const LEGACY_MUTE_KEY = "egg-toss-muted";
  let muted = JSON.parse(localStorage.getItem(MUTE_KEY) ?? localStorage.getItem(LEGACY_MUTE_KEY) ?? "false");
  let bgm = null;
  let requestedMode = null;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") {
      const resumed = ctx.resume();
      if (resumed && resumed.catch) resumed.catch(() => {});
    }
    return ctx;
  }

  // Mobile Safari only allows sound after a real user gesture. Unlock the
  // shared AudioContext on the first interaction anywhere in the app.
  function unlock() {
    const audioContext = ac();
    if (audioContext.state === "suspended") {
      const resumed = audioContext.resume();
      if (resumed && resumed.catch) resumed.catch(() => {});
    }
    return audioContext;
  }
  function gain(v, t = 0) {
    const a = ac(), g = a.createGain();
    g.gain.setValueAtTime(v, a.currentTime + t);
    g.connect(a.destination);
    return g;
  }
  function noiseBuffer(dur = 0.3) {
    const a = ac(), b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
    return b;
  }
  function tone({ f = 440, dur = 0.2, type = "sine", g = 0.2, attack = 0.005, decay = 0.2, dest = null, detune = 0 }) {
    if (muted) return;
    const a = ac(), o = a.createOscillator(), gn = a.createGain();
    o.type = type; o.frequency.value = f; o.detune.value = detune;
    o.connect(gn); gn.connect(dest || a.destination);
    const t = a.currentTime;
    gn.gain.setValueAtTime(0, t);
    gn.gain.linearRampToValueAtTime(g, t + attack);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    o.start(t); o.stop(t + attack + decay + 0.05);
    return { o, gn };
  }
  function noise({ dur = 0.2, g = 0.2, lp = 1200, hp = 100 }) {
    if (muted) return;
    const a = ac(), src = a.createBufferSource();
    src.buffer = noiseBuffer(dur);
    const lpF = a.createBiquadFilter(); lpF.type = "lowpass"; lpF.frequency.value = lp;
    const hpF = a.createBiquadFilter(); hpF.type = "highpass"; hpF.frequency.value = hp;
    const gn = a.createGain();
    src.connect(hpF); hpF.connect(lpF); lpF.connect(gn); gn.connect(a.destination);
    const t = a.currentTime;
    gn.gain.setValueAtTime(g, t);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.start(t); src.stop(t + dur + 0.05);
  }

  // ─── SFX ───
  function fishTok() {
    if (muted) return;
    // hollow wood "tok": low sine click + short noise burst, both fast decay
    tone({ f: 220, type: "sine", g: 0.45, attack: 0.001, decay: 0.18 });
    tone({ f: 110, type: "triangle", g: 0.25, attack: 0.001, decay: 0.22 });
    noise({ dur: 0.05, g: 0.18, lp: 800, hp: 200 });
  }
  function slap() {
    if (muted) return;
    noise({ dur: 0.12, g: 0.5, lp: 4000, hp: 800 });
    tone({ f: 180, type: "sine", g: 0.25, attack: 0.001, decay: 0.08 });
  }
  function splat(kind = "egg") {
    if (muted) return;
    if (kind === "cabbage") {
      noise({ dur: 0.22, g: 0.4, lp: 1600, hp: 60 });
      tone({ f: 90, type: "triangle", g: 0.18, attack: 0.001, decay: 0.18 });
    } else {
      noise({ dur: 0.18, g: 0.35, lp: 2400, hp: 200 });
      tone({ f: 140, type: "sine", g: 0.22, attack: 0.001, decay: 0.1 });
    }
  }
  function bell() {
    if (muted) return;
    [880, 1320, 1760].forEach((f, i) =>
      tone({ f, type: "sine", g: 0.18 / (i + 1), attack: 0.005, decay: 1.6 - i * 0.3 })
    );
  }

  // ─── BGM ───
  function stopBGM() {
    requestedMode = null;
    const active = bgm;
    bgm = null;
    if (!active) return;
    if (!ctx || !active.master) {
      active.cleanup && active.cleanup();
      return;
    }
    const t = ctx.currentTime;
    active.master.gain.cancelScheduledValues(t);
    active.master.gain.setValueAtTime(active.master.gain.value, t);
    active.master.gain.linearRampToValueAtTime(0, t + 0.25);
    setTimeout(() => active.cleanup && active.cleanup(), 300);
  }
  function startBGM(mode) {
    if (bgm && bgm.mode === mode) {
      requestedMode = mode;
      unlock();
      return;
    }
    const previous = bgm;
    bgm = null;
    if (previous && previous.cleanup) previous.cleanup();
    requestedMode = mode;
    if (muted) return;
    const a = ac();
    const master = a.createGain();
    master.gain.value = 0;
    master.connect(a.destination);
    master.gain.linearRampToValueAtTime(0.68, a.currentTime + 0.7);

    const oscs = [];
    function drone(f, type = "sine", g = 0.08, detune = 0) {
      const o = a.createOscillator(), gn = a.createGain();
      o.type = type; o.frequency.value = f; o.detune.value = detune;
      gn.gain.value = g; o.connect(gn); gn.connect(master);
      o.start(); oscs.push({ o, gn });
      // slow gain LFO for breathiness
      const lfo = a.createOscillator(), lg = a.createGain();
      lfo.frequency.value = 0.12 + Math.random() * 0.1; lg.gain.value = g * 0.4;
      lfo.connect(lg); lg.connect(gn.gain);
      lfo.start(); oscs.push({ o: lfo, gn: lg });
      return { o, gn };
    }

    let timer = null;
    if (mode === "buddhist") {
      // Warm drone plus a clearly audible, original pentatonic meditation loop.
      drone(87.31, "sine", 0.16);          // F2
      drone(130.81, "sine", 0.11);         // C3
      drone(174.61, "triangle", 0.06);     // F3
      const notes = [349.23, 392.0, 440.0, 523.25, 440.0, 392.0];
      let noteIndex = 0;
      const playNote = () => {
        if (muted || !bgm) return;
        const f = notes[noteIndex++ % notes.length];
        tone({ f, type: "sine", g: 0.18, attack: 0.04, decay: 1.7, dest: master });
        tone({ f: f * 2, type: "sine", g: 0.045, attack: 0.04, decay: 1.25, dest: master });
      };
      playNote();
      timer = setInterval(playNote, 2200);
    } else if (mode === "christian") {
      // organ-ish stacked sine: C major triad pad + slow breathy
      drone(130.81, "sawtooth", 0.05);      // C3
      drone(164.81, "sawtooth", 0.04);      // E3
      drone(196.00, "sawtooth", 0.04);      // G3
      drone(261.63, "sine", 0.05);          // C4
      // distant church bell
      timer = setInterval(() => {
        if (muted || !bgm) return;
        [523.25, 659.25, 783.99].forEach((f, i) =>
          tone({ f, type: "sine", g: 0.08 / (i + 1), attack: 0.005, decay: 2.5, dest: master }));
      }, 8000);
    } else if (mode === "muslim") {
      // microtonal drone (D + slight detune fifth A), slow sine swell
      drone(73.42, "sine", 0.10);           // D2
      drone(110.0, "sine", 0.07, 12);       // A2 +12 cents
      drone(146.83, "triangle", 0.04);      // D3
      // soft chime
      timer = setInterval(() => {
        if (muted || !bgm) return;
        [440, 587.33].forEach((f, i) => tone({ f, type: "sine", g: 0.08, attack: 0.01, decay: 2.0, dest: master }));
      }, 6500);
    }

    bgm = {
      mode, master,
      cleanup: () => {
        if (timer) clearInterval(timer);
        oscs.forEach(({ o }) => { try { o.stop(); } catch (e) {} });
      },
    };
  }
  function bgmPause() {
    if (!bgm || !bgm.master || !ctx) return;
    bgm.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  }
  function bgmResume() {
    if (!bgm || !bgm.master || !ctx) return;
    unlock();
    bgm.master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.4);
  }

  function setMuted(m) {
    muted = !!m;
    localStorage.setItem(MUTE_KEY, JSON.stringify(muted));
    if (muted && bgm) bgmPause();
    else if (!muted && bgm) bgmResume();
    else if (!muted && requestedMode) startBGM(requestedMode);
  }

  window.GameAudio = {
    fishTok, slap, splat, bell,
    startBGM, stopBGM, bgmPause, bgmResume, unlock,
    setMuted, isMuted: () => muted, currentMode: () => requestedMode,
  };

  window.addEventListener("pointerdown", unlock, { capture: true, once: true });
  window.addEventListener("touchstart", unlock, { capture: true, once: true, passive: true });
  window.addEventListener("keydown", unlock, { capture: true, once: true });
})();
