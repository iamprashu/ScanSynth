import { createContext, useContext, useState, useCallback } from "react";

const UIContext = createContext(undefined);

function UIProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const startLoading = useCallback((message = "Loading...") => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage("Loading...");
  }, []);

  const withLoading = useCallback(
    async (asyncFn, message = "Loading...") => {
      try {
        startLoading(message);
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const values = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    startLoading,
    stopLoading,
    withLoading,
    isLoading,
    loadingMessage,
  };

  return <UIContext.Provider value={values}>{children}</UIContext.Provider>;
}

function useUI() {
  return useContext(UIContext);
}

export { UIProvider, useUI };
