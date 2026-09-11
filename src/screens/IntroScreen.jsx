// IntroScreen — bilingual rules + start CTA. Sets the cathartic tone up-front.
import { useLanguage } from "../i18n.jsx";
import logo from "../assets/brand/logo-transparent.png";

const RULES = [
  { emoji: "👤", zh: "登记倒霉鬼", en: "Register the target", zhBody: "上传头像，列出他的罪状——老板、同事、前任、房东，随便谁。", enBody: "Upload a photo and list what they did—boss, coworker, ex, landlord, whoever." },
  { emoji: "🥚💥", zh: "扔！砸！扇！", en: "Throw! Smash! Slap!", zhBody: "鸡蛋糊脸，烂菜叶随便挂，耳光左右开弓。把火气痛快扔出去。", enBody: "Splat eggs, fling rotten greens and slap away. Let all that frustration out." },
  { emoji: "☮️", zh: "积点功德", en: "Choose love and peace", zhBody: "发泄够了就换种姿态。按你信的来，让自己慢慢平静下来。", enBody: "When you're done venting, choose your path and ease yourself back into calm." },
];

export default function IntroScreen({ onStart, onSkipToMerit, bank = 0 }) {
  const { lang, t } = useLanguage();
  return (
    <div className="screen" data-mode="vent">
      <div className="grain-layer" />
      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column",
        padding: "max(20px, env(safe-area-inset-top)) 22px max(24px, env(safe-area-inset-bottom))", overflowY: "auto",
      }}>
        {/* Logo lockup */}
        <div style={{ display: "flex", alignItems: "center", minHeight: 58 }}>
          <img
            src={logo}
            alt="Basta!"
            className="brand-logo"
            style={{ width: 188, height: 74, objectFit: "contain", objectPosition: "left center" }}
          />
        </div>

        {/* tagline */}
        <h1 style={{
          font: "700 30px/1.18 var(--font-display)", color: "var(--vent-copy)",
          marginTop: 22, letterSpacing: "-.01em",
        }}>
          {t("够了！气死我了！", "Enough! I'm furious!")}<br />
          <span style={{ color: "var(--vent-vermilion-2)" }}>{t("我受不了了！", "I can't take it anymore!")}</span>
        </h1>
        <p style={{
          font: "400 14px/1.5 var(--font-body)",
          color: "var(--vent-copy-muted)",
          marginTop: 8, fontStyle: "italic",
        }}>
          {t("先把情绪安全地释放出来，再慢慢找回平静。", "Let it out safely, then find your way back to calm.")}
        </p>

        {/* rules cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18, flex: 1 }}>
          {RULES.map((r, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              background: "var(--vent-surface)",
              border: "1.5px solid rgba(99,151,134,.18)",
              borderRadius: 14, padding: "12px 14px",
              boxShadow: "0 8px 22px rgba(84,132,117,.08)",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: "rgba(117,185,154,.16)",
                display: "grid", placeItems: "center", fontSize: r.emoji.length > 2 ? 18 : 22,
                border: "1px solid rgba(78,142,115,.26)",
              }}>{r.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "700 16px var(--font-display)", color: "var(--vent-copy)" }}>{t(r.zh, r.en)}</div>
                <div style={{
                  font: "400 13px/1.5 var(--font-body)",
                  color: "var(--vent-copy-muted)", marginTop: 4,
                }}>{t(r.zhBody, r.enBody)}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{
          font: "400 11px/1.4 var(--font-body)",
          color: "var(--vent-copy-muted)", textAlign: "center",
          marginTop: 14, marginBottom: 10, fontStyle: "italic",
        }}>
          {t("仅供情绪释放，请勿伤害真实的人", "For catharsis only—never harm a real person")}
        </p>

        <button
          onClick={onStart}
          style={{
            width: "100%", height: 56, borderRadius: 999, border: 0, cursor: "pointer",
            background: "var(--seal-red)", color: "#fff",
            font: "700 18px var(--font-display)", letterSpacing: ".02em",
            boxShadow: "0 6px 0 var(--vent-vermilion-2), 0 12px 28px rgba(216,93,86,.22)",
            transition: "transform .12s var(--ease-snap)",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(2px)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
        >
          {t("开始", "BEGIN")}
        </button>

        {/* Skip-to-merit path — for days you don't want to vent, just bank some merit. */}
        <button
          onClick={onSkipToMerit}
          style={{
            width: "100%", height: 44, borderRadius: 999, marginTop: 10,
            background: "transparent", cursor: "pointer",
            border: "1.5px solid var(--merit-gold)",
            color: "var(--merit-gold)",
            font: "600 14px var(--font-body)", letterSpacing: ".01em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "transform .12s var(--ease-snap), background-color .14s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
        >
          <span>{t("今天直接积功德", "GO STRAIGHT TO PEACE")}</span>
          {bank > 0 && (
            <span style={{
              font: "700 11px/1 var(--font-num)",
              padding: "3px 7px", borderRadius: 999,
              background: "rgba(200,162,75,.16)",
              border: "1px solid rgba(200,162,75,.5)",
              letterSpacing: ".04em",
            }}>+{bank}</span>
          )}
        </button>
      </div>
    </div>
  );
}
