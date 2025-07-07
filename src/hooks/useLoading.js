import { useCallback } from "react";
import { useUI } from "../contexts/uiContext";

export const useLoading = () => {
  const {
    startLoading,
    stopLoading,
    withLoading,
    withGlobalLoading,
    isLoading,
    getLoadingMessage,
    globalLoading,
    globalLoadingMessage,
    clearAllLoading,
  } = useUI();

  const executeWithLoading = useCallback(
    async (asyncFn, key, message = "Loading...") => {
      return withLoading(asyncFn, key, message);
    },
    [withLoading]
  );

  const executeWithGlobalLoading = useCallback(
    async (asyncFn, message = "Loading...") => {
      return withGlobalLoading(asyncFn, message);
    },
    [withGlobalLoading]
  );

  const executeMultipleWithLoading = useCallback(
    async (operations, key = "batch-operation", message = "Processing...") => {
      return withLoading(
        async () => {
          const results = [];
          for (const operation of operations) {
            const result = await operation.fn();
            results.push(result);
          }
          return results;
        },
        key,
        message
      );
    },
    [withLoading]
  );

  const manualLoading = useCallback(
    (key, message = "Loading...") => {
      startLoading(key, message);
      return () => stopLoading(key);
    },
    [startLoading, stopLoading]
  );

  const checkLoading = useCallback(
    (key) => {
      return isLoading(key);
    },
    [isLoading]
  );

  const getMessage = useCallback(
    (key) => {
      return getLoadingMessage(key);
    },
    [getLoadingMessage]
  );

  return {
    isLoading: checkLoading,
    getLoadingMessage: getMessage,
    globalLoading,
    globalLoadingMessage,

    executeWithLoading,
    executeWithGlobalLoading,
    executeMultipleWithLoading,
    manualLoading,

    startLoading,
    stopLoading,
    clearAllLoading,
  };
};
