export default function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ font: "600 13px/1 var(--font-body)", color: "var(--vent-copy-muted)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}
