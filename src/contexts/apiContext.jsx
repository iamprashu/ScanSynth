import { createContext, useCallback, useMemo, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useUI } from "./uiContext";

const ApiContext = createContext();

function ApiProvider({ children }) {
  const { getToken } = useAuth();
  const { withLoading } = useUI();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const userCreationAttempted = useRef(false);

  const apiCall = useCallback(
    async (endpoint, options = {}) => {
      const token = await getToken();
      const baseUrl = backendUrl;

      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return response.json();
    },
    [getToken]
  );

  const createUser = useCallback(
    async (userData) => {
      if (userCreationAttempted.current) {
        return { success: true, message: "User already exists" };
      }

      userCreationAttempted.current = true;

      try {
        return await withLoading(
          () =>
            apiCall("/user/create", {
              method: "POST",
              body: JSON.stringify(userData),
            }),
          "user-creation",
          "Setting up your account..."
        );
      } catch (error) {
        if (
          error.message.includes("already exists") ||
          error.message.includes("duplicate")
        ) {
          return { success: true, message: "User already exists" };
        }
        throw error;
      }
    },
    [apiCall, withLoading]
  );

  const getUserProfile = useCallback(async () => {
    return withLoading(
      () => apiCall("/user/profile"),
      "user-profile",
      "Loading profile..."
    );
  }, [apiCall, withLoading]);

  const updateUser = useCallback(
    async (userData) => {
      return withLoading(
        () =>
          apiCall("/user/update", {
            method: "PUT",
            body: JSON.stringify(userData),
          }),
        "user-update",
        "Updating profile..."
      );
    },
    [apiCall, withLoading]
  );

  const startScan = useCallback(
    async (target, scanType = "quick") => {
      return withLoading(
        () =>
          apiCall("/scan/start", {
            method: "POST",
            body: JSON.stringify({ target, scanType }),
          }),
        "scan-start",
        `Starting ${scanType} scan...`
      );
    },
    [apiCall, withLoading]
  );

  const getScanStatus = useCallback(
    async (scanId) => {
      return withLoading(
        () => apiCall(`/scan/status/${scanId}`),
        `scan-status-${scanId}`,
        "Checking scan status..."
      );
    },
    [apiCall, withLoading]
  );

  const getScanResults = useCallback(
    async (scanId) => {
      return withLoading(
        () => apiCall(`/scan/results/${scanId}`),
        `scan-results-${scanId}`,
        "Loading scan results..."
      );
    },
    [apiCall, withLoading]
  );

  const generateAIReport = useCallback(
    async (scanId) => {
      return withLoading(
        () =>
          apiCall(`/scan/${scanId}/report`, {
            method: "POST",
          }),
        `ai-report-${scanId}`,
        "Generating AI report..."
      );
    },
    [apiCall, withLoading]
  );

  const getScanHistory = useCallback(
    async (params = {}) => {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.target && { target: params.target }),
        ...(params.scanType && { scanType: params.scanType }),
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
      });

      return withLoading(
        () => apiCall(`/history?${queryParams}`),
        "scan-history",
        "Loading scan history..."
      );
    },
    [apiCall, withLoading]
  );

  const getScanById = useCallback(
    async (scanId) => {
      return withLoading(
        () => apiCall(`/history/${scanId}`),
        `scan-details-${scanId}`,
        "Loading scan details..."
      );
    },
    [apiCall, withLoading]
  );

  const deleteScan = useCallback(
    async (scanId) => {
      return withLoading(
        () =>
          apiCall(`/history/${scanId}`, {
            method: "DELETE",
          }),
        `delete-scan-${scanId}`,
        "Deleting scan..."
      );
    },
    [apiCall, withLoading]
  );

  const getScanStats = useCallback(async () => {
    return withLoading(
      () => apiCall("/history/stats"),
      "scan-stats",
      "Loading statistics..."
    );
  }, [apiCall, withLoading]);

  const regeneratePDF = useCallback(
    async (scanId) => {
      return withLoading(
        () =>
          apiCall(`/reports/regenerate/${scanId}`, {
            method: "POST",
          }),
        `regenerate-pdf-${scanId}`,
        "Regenerating PDF report..."
      );
    },
    [apiCall, withLoading]
  );

  const downloadPDF = useCallback(
    async (filename) => {
      const token = await getToken();
      const baseUrl = backendUrl;

      const link = document.createElement("a");
      link.href = `${baseUrl}/reports/${filename}`;
      link.target = "_blank";

      try {
        const actualUrl = `${baseUrl}/reports/${filename}`;
        console.log("PDF Download URL:", actualUrl);

        const response = await fetch(actualUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          console.log("Created Blob URL:", blobUrl);
          link.href = blobUrl;
          link.click();
          window.URL.revokeObjectURL(blobUrl);
        } else {
          throw new Error("Failed to download PDF");
        }
      } catch (error) {
        console.error("PDF download error:", error);
        window.open(`${baseUrl}/reports/${filename}`, "_blank");
      }

      return { success: true, message: "PDF opened in new tab" };
    },
    [getToken]
  );

  const checkHealth = useCallback(async () => {
    return withLoading(
      () => apiCall("/health"),
      "health-check",
      "Checking server status..."
    );
  }, [apiCall, withLoading]);

  const userAPI = useMemo(
    () => ({
      createUser,
      getUserProfile,
      updateUser,
    }),
    [createUser, getUserProfile, updateUser]
  );

  const scanAPI = useMemo(
    () => ({
      startScan,
      getScanStatus,
      getScanResults,
      generateAIReport,
    }),
    [startScan, getScanStatus, getScanResults, generateAIReport]
  );

  const historyAPI = useMemo(
    () => ({
      getScanHistory,
      getScanById,
      deleteScan,
      getScanStats,
      regeneratePDF,
      downloadPDF,
    }),
    [
      getScanHistory,
      getScanById,
      deleteScan,
      getScanStats,
      regeneratePDF,
      downloadPDF,
    ]
  );

  const healthAPI = useMemo(
    () => ({
      checkHealth,
    }),
    [checkHealth]
  );

  const value = useMemo(
    () => ({
      userAPI,
      scanAPI,
      historyAPI,
      healthAPI,
      apiCall,
    }),
    [userAPI, scanAPI, historyAPI, healthAPI, apiCall]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export { ApiProvider, ApiContext };
