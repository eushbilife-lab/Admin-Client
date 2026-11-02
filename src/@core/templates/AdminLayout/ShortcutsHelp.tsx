import "./ShortcutsHelp.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const ROWS = [
  { label: "Open command palette", keys: isMac ? "⌘ K" : "Ctrl K" },
  { label: "Toggle light / dark", keys: isMac ? "⌘ ⇧ L" : "Ctrl Shift L" },
  { label: "Toggle compact density", keys: isMac ? "⌘ ⇧ D" : "Ctrl Shift D" },
  { label: "Keyboard shortcuts", keys: "?" },
  { label: "Close overlays", keys: "Esc" },
];

export default function ShortcutsHelp({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="shortcuts-help" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <button
        type="button"
        className="shortcuts-help__backdrop"
        aria-label="Close shortcuts"
        onClick={onClose}
      />
      <div className="shortcuts-help__panel">
        <div className="shortcuts-help__head">
          <div>
            <h2>Keyboard shortcuts</h2>
            <p>Move faster across the Eushbi admin panel.</p>
          </div>
          <button type="button" className="shortcuts-help__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <ul className="shortcuts-help__list">
          {ROWS.map((row) => (
            <li key={row.label}>
              <span>{row.label}</span>
              <kbd>{row.keys}</kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
