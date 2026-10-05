import { useEffect, useRef } from "react";

function useDebouncedEffect(callback: () => void, deps: any[], delay: number) {
  const handler = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (handler.current) {
      clearTimeout(handler.current);
    }

    handler.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (handler.current) {
        clearTimeout(handler.current);
      }
    };

  }, deps);
}

export default useDebouncedEffect;
