import { useCallback } from "react";
import { useUI } from "../contexts/uiContext";

export const useLoading = () => {
  const { startLoading, stopLoading, withLoading, isLoading, loadingMessage } =
    useUI();

  const executeWithLoading = useCallback(
    async (asyncFn, message = "Loading...") => {
      return withLoading(asyncFn, message);
    },
    [withLoading]
  );

  const executeMultipleWithLoading = useCallback(
    async (operations, message = "Processing...") => {
      return withLoading(async () => {
        const results = [];
        for (const operation of operations) {
          const result = await operation.fn();
          results.push(result);
        }
        return results;
      }, message);
    },
    [withLoading]
  );

  const manualLoading = useCallback(
    (message = "Loading...") => {
      startLoading(message);
      return () => stopLoading();
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    loadingMessage,
    executeWithLoading,
    executeMultipleWithLoading,
    manualLoading,
    startLoading,
    stopLoading,
  };
};
