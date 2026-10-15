import { useEffect } from "react";

/**
 * Warn when closing/refreshing the tab with unsaved form changes.
 * (In-app navigation blocking needs a data router; this keeps BrowserRouter safe.)
 */
export default function useUnsavedChanges(
  when: boolean,
  message = "You have unsaved changes. Leave this page?"
) {
  useEffect(() => {
    if (!when) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [when, message]);
}
