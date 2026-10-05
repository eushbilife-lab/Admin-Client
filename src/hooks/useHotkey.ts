import { useEffect } from "react";

type HotkeyOptions = {
  meta?: boolean;
  enabled?: boolean;
};

export default function useHotkey(key: string, handler: () => void, options: HotkeyOptions = {}) {
  const { meta = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (meta && !(event.metaKey || event.ctrlKey)) return;
      if (!meta && (event.metaKey || event.ctrlKey || event.altKey)) return;
      event.preventDefault();
      handler();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler, meta, enabled]);
}
