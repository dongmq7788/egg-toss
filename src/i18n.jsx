import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_KEY = "basta-language";
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh");

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    t: (zh, en) => lang === "zh" ? zh : en,
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="language-toggle" role="group" aria-label="Language / 语言">
      <button aria-pressed={lang === "zh"} onClick={() => setLang("zh")}>中文</button>
      <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
    </div>
  );
}
