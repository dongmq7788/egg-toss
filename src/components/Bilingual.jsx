import { useLanguage } from "../i18n.jsx";

export default function Bilingual({ zh, en, className = "", style }) {
  const { t } = useLanguage();
  return (
    <span className={"bilingual " + className} style={style}>{t(zh, en)}</span>
  );
}
