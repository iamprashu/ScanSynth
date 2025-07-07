import { createContext, useContext, useState, useCallback } from "react";

const UIContext = createContext(undefined);

function UIProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalLoadingMessage, setGlobalLoadingMessage] =
    useState("Loading...");

  const startLoading = useCallback((key, message = "Loading...") => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: { isLoading: true, message },
    }));
  }, []);

  const stopLoading = useCallback((key) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: { isLoading: false, message: "" },
    }));
  }, []);

  const isLoading = useCallback(
    (key) => {
      return loadingStates[key]?.isLoading || false;
    },
    [loadingStates]
  );

  const getLoadingMessage = useCallback(
    (key) => {
      return loadingStates[key]?.message || "Loading...";
    },
    [loadingStates]
  );

  const startGlobalLoading = useCallback((message = "Loading...") => {
    setGlobalLoadingMessage(message);
    setGlobalLoading(true);
  }, []);

  const stopGlobalLoading = useCallback(() => {
    setGlobalLoading(false);
    setGlobalLoadingMessage("Loading...");
  }, []);

  const withLoading = useCallback(
    async (asyncFn, key, message = "Loading...") => {
      try {
        startLoading(key, message);
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading]
  );

  const withGlobalLoading = useCallback(
    async (asyncFn, message = "Loading...") => {
      try {
        startGlobalLoading(message);
        const result = await asyncFn();
        return result;
      } finally {
        stopGlobalLoading();
      }
    },
    [startGlobalLoading, stopGlobalLoading]
  );

  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
    setGlobalLoading(false);
    setGlobalLoadingMessage("Loading...");
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const values = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,

    loadingStates,
    globalLoading,
    globalLoadingMessage,
    startLoading,
    stopLoading,
    isLoading,
    getLoadingMessage,
    startGlobalLoading,
    stopGlobalLoading,
    withLoading,
    withGlobalLoading,
    clearAllLoading,
  };

  return <UIContext.Provider value={values}>{children}</UIContext.Provider>;
}

function useUI() {
  return useContext(UIContext);
}

export { UIProvider, useUI };
