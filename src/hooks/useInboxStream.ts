import { useEffect } from "react";
import { config } from "config";
import { getAppDispatch } from "utils/dispatch.util";
import LocalStorage from "utils/localstorage.service";
import { baseApi } from "redux/api";

function bearer(): string {
  const raw = LocalStorage.getItem("token");
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.replace(/^"|"$/g, "");
  return trimmed.startsWith("Bearer ") ? trimmed : `Bearer ${trimmed.replace(/^Bearer\s+/i, "")}`;
}

/** Keeps the inbox fresh while the admin panel is open. Falls back to polling if the stream drops. */
export function useInboxStream(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !config.API_URL) return undefined;
    const token = bearer();
    if (!token) return undefined;
    const controller = new AbortController();
    let stopped = false;
    let retry = 2000;

    const run = async () => {
      while (!stopped) {
        try {
          const response = await fetch(`${config.API_URL}/inbox/stream`, {
            headers: { Authorization: token, Accept: "text/event-stream" },
            signal: controller.signal,
          });
          if (!response.ok || !response.body) throw new Error("stream");
          retry = 2000;
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          while (!stopped) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const chunks = buffer.split("\n\n");
            buffer = chunks.pop() || "";
            if (chunks.some((chunk) => chunk.includes("event: activity"))) {
              getAppDispatch()?.(baseApi.util.invalidateTags([{ type: "AdminInbox", id: "LIST" }]));
            }
          }
        } catch {
          if (stopped || controller.signal.aborted) return;
        }
        await new Promise((resolve) => setTimeout(resolve, retry));
        retry = Math.min(retry * 2, 20000);
      }
    };

    void run();
    return () => {
      stopped = true;
      controller.abort();
    };
  }, [enabled]);
}
