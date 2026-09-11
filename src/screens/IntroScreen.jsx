import { useState } from "react";
import { useLanguage } from "../i18n.jsx";
import logo from "../assets/brand/logo-transparent.png";

const RULES = [
  { emoji: "👤", zh: "登记倒霉鬼", en: "Register the target", zhBody: "上传头像，列出他的罪状——老板、同事、前任、房东，随便谁。", enBody: "Upload a photo and list what they did—boss, coworker, ex, landlord, whoever." },
  { emoji: "🥚💥", zh: "扔！砸！扇！", en: "Throw! Smash! Slap!", zhBody: "鸡蛋糊脸，烂菜叶随便挂，耳光左右开弓。把火气痛快扔出去。", enBody: "Splat eggs, fling rotten greens and slap away. Let all that frustration out." },
  { emoji: "☮️", zh: "积点功德", en: "Choose love and peace", zhBody: "发泄够了就换种姿态。按你信的来，让自己慢慢平静下来。", enBody: "When you're done venting, choose your path and ease yourself back into calm." },
];

function FeatureGuide({ onClose, t }) {
  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 300,
        display: "flex", alignItems: "flex-end",
        background: "rgba(31,70,61,.28)", backdropFilter: "blur(8px)",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-guide-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%", maxHeight: "82dvh", overflowY: "auto",
          padding: "20px 20px max(24px, env(safe-area-inset-bottom))",
          borderRadius: "24px 24px 0 0",
          background: "linear-gradient(165deg, #F8FFFD, #F1FAF6 62%, #FFF8EC)",
          boxShadow: "0 -18px 54px rgba(42,88,75,.22)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 id="feature-guide-title" style={{ margin: 0, font: "700 24px/1.2 var(--font-display)", color: "var(--vent-copy)" }}>
              {t("功能介绍", "How it works")}
            </h2>
            <p style={{ margin: "7px 0 0", font: "400 14px/1.55 var(--font-body)", color: "var(--vent-copy-muted)" }}>
              {t("先把情绪安全地释放出来，再慢慢找回平静。", "Let it out safely, then find your way back to calm.")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("关闭功能介绍", "Close guide")}
            style={{
              width: 40, height: 40, flexShrink: 0, borderRadius: "50%", cursor: "pointer",
              border: "1px solid rgba(73,112,101,.2)", background: "rgba(255,255,255,.82)",
              color: "var(--vent-copy)", font: "500 24px/1 var(--font-body)",
            }}
          >×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
          {RULES.map((rule) => (
            <div key={rule.zh} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              background: "rgba(255,255,255,.76)", border: "1.5px solid rgba(99,151,134,.18)",
              borderRadius: 16, padding: 14, boxShadow: "0 8px 22px rgba(84,132,117,.08)",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: "rgba(117,185,154,.16)", border: "1px solid rgba(78,142,115,.26)",
                display: "grid", placeItems: "center", fontSize: rule.emoji.length > 2 ? 18 : 22,
              }}>{rule.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "700 16px var(--font-display)", color: "var(--vent-copy)" }}>{t(rule.zh, rule.en)}</div>
                <div style={{ font: "400 14px/1.55 var(--font-body)", color: "var(--vent-copy-muted)", marginTop: 4 }}>
                  {t(rule.zhBody, rule.enBody)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "16px 0 0", textAlign: "center", font: "400 12px/1.5 var(--font-body)",
          color: "var(--vent-copy-muted)", fontStyle: "italic",
        }}>
          {t("仅供情绪释放，请勿伤害真实的人", "For catharsis only—never harm a real person")}
        </p>
      </section>
    </div>
  );
}

export default function IntroScreen({ onStart, onSkipToMerit, bank = 0 }) {
  const { t } = useLanguage();
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="screen" data-mode="vent">
      <div className="grain-layer" />
      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column",
        padding: "max(20px, env(safe-area-inset-top)) 22px max(24px, env(safe-area-inset-bottom))",
      }}>
        <div style={{ display: "flex", alignItems: "center", minHeight: 58 }}>
          <img
            src={logo}
            alt="Basta!"
            className="brand-logo"
            style={{ width: 188, height: 74, objectFit: "contain", objectPosition: "left center" }}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowGuide(true)}
          aria-label={t("打开功能介绍", "Open feature guide")}
          title={t("功能介绍", "How it works")}
          style={{
            position: "absolute", top: "max(68px, calc(env(safe-area-inset-top) + 52px))", right: 0,
            width: 42, height: 42, borderRadius: "50%", cursor: "pointer",
            border: "1px solid rgba(73,112,101,.22)", background: "rgba(255,255,255,.82)",
            boxShadow: "0 7px 20px rgba(73,112,101,.12)", color: "var(--vent-cabbage-2)",
            font: "700 22px/1 var(--font-display)",
          }}
        >ⓘ</button>

        <div style={{ flex: 1, display: "grid", placeItems: "center", paddingBottom: 36 }}>
          <h1 style={{
            margin: 0, textAlign: "center",
            font: "800 clamp(54px, 15vw, 82px)/1 var(--font-display)",
            color: "var(--vent-vermilion-2)", letterSpacing: "-.06em", transform: "rotate(-2deg)",
            textShadow: "0 4px 0 rgba(255,255,255,.7), 0 12px 30px rgba(216,93,86,.15)",
          }}>
            {t("去你的吧", "SCREW IT!")}
          </h1>
        </div>

        <p style={{
          font: "400 12px/1.4 var(--font-body)", color: "var(--vent-copy-muted)",
          textAlign: "center", margin: "0 0 12px", fontStyle: "italic",
        }}>
          {t("仅供情绪释放，请勿伤害真实的人", "For catharsis only—never harm a real person")}
        </p>

        <button
          onClick={onStart}
          style={{
            width: "100%", height: 56, borderRadius: 999, border: 0, cursor: "pointer",
            background: "var(--seal-red)", color: "#fff", font: "700 18px var(--font-display)",
            letterSpacing: ".02em", boxShadow: "0 6px 0 var(--vent-vermilion-2), 0 12px 28px rgba(216,93,86,.22)",
            transition: "transform .12s var(--ease-snap)",
          }}
          onMouseDown={(event) => (event.currentTarget.style.transform = "translateY(2px)")}
          onMouseUp={(event) => (event.currentTarget.style.transform = "")}
          onMouseLeave={(event) => (event.currentTarget.style.transform = "")}
        >
          {t("开始", "BEGIN")}
        </button>

        <button
          onClick={onSkipToMerit}
          style={{
            width: "100%", height: 44, borderRadius: 999, marginTop: 10,
            background: "transparent", cursor: "pointer", border: "1.5px solid var(--merit-gold)",
            color: "var(--merit-gold)", font: "600 14px var(--font-body)", letterSpacing: ".01em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "transform .12s var(--ease-snap), background-color .14s",
          }}
          onMouseDown={(event) => (event.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(event) => (event.currentTarget.style.transform = "")}
          onMouseLeave={(event) => (event.currentTarget.style.transform = "")}
        >
          <span>{t("今天直接积功德", "GO STRAIGHT TO PEACE")}</span>
          {bank > 0 && (
            <span style={{
              font: "700 11px/1 var(--font-num)", padding: "3px 7px", borderRadius: 999,
              background: "rgba(200,162,75,.16)", border: "1px solid rgba(200,162,75,.5)", letterSpacing: ".04em",
            }}>+{bank}</span>
          )}
        </button>
      </div>

      {showGuide && <FeatureGuide onClose={() => setShowGuide(false)} t={t} />}
    </div>
  );
}
