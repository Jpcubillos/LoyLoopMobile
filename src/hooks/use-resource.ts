import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

export function useResource<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const generation = useRef(0);
  const reload = useCallback(async () => {
    const current = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const value = await loader();
      if (current === generation.current) setData(value);
    } catch (err) {
      if (current === generation.current)
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la información.",
        );
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, [loader]);
  useFocusEffect(
    useCallback(() => {
      void reload();
      return () => {
        generation.current++;
      };
    }, [reload]),
  );
  return { data, error, loading, reload, setData };
}
