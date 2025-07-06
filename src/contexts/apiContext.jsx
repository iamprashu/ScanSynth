import { createContext, useCallback, useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useUI } from "./uiContext";

const ApiContext = createContext();

function ApiProvider({ children }) {
  const { getToken } = useAuth();
  const { startLoading, stopLoading, withloading } = useUI();

  const apiCall = useCallback(
    async (endpoint, options = {}) => {
      const token = await getToken();
      const baseUrl = "http://192.168.0.101:3000/api";

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
      try {
        return await apiCall("/user/create", {
          method: "POST",
          body: JSON.stringify(userData),
        });
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
    [apiCall]
  );

  const getUserProfile = useCallback(async () => {
    return apiCall("/user/profile");
  }, [apiCall]);

  const updateUser = useCallback(
    async (userData) => {
      return apiCall("/user/update", {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    },
    [apiCall]
  );

  // Scan Management APIs
  const startScan = useCallback(
    async (target, scanType = "quick") => {
      return apiCall("/scan/start", {
        method: "POST",
        body: JSON.stringify({ target, scanType }),
      });
    },
    [apiCall]
  );

  const getScanStatus = useCallback(
    async (scanId) => {
      return apiCall(`/scan/status/${scanId}`);
    },
    [apiCall]
  );

  const getScanResults = useCallback(
    async (scanId) => {
      return apiCall(`/scan/results/${scanId}`);
    },
    [apiCall]
  );

  const generateAIReport = useCallback(
    async (scanId) => {
      return apiCall(`/scan/ai-report/${scanId}`, {
        method: "POST",
      });
    },
    [apiCall]
  );

  const getScanHistory = useCallback(
    async (params = {}) => {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.target && { target: params.target }),
        ...(params.status && { status: params.status }),
      });

      return apiCall(`/history?${queryParams}`);
    },
    [apiCall]
  );

  const getScanById = useCallback(
    async (scanId) => {
      return apiCall(`/history/${scanId}`);
    },
    [apiCall]
  );

  const deleteScan = useCallback(
    async (scanId) => {
      return apiCall(`/history/${scanId}`, {
        method: "DELETE",
      });
    },
    [apiCall]
  );

  const getScanStats = useCallback(async () => {
    return apiCall("/history/stats");
  }, [apiCall]);

  const exportScanPDF = useCallback(
    async (scanId) => {
      return apiCall(`/history/${scanId}/export`, {
        method: "POST",
      });
    },
    [apiCall]
  );

  // Health Check API
  const checkHealth = useCallback(async () => {
    return apiCall("/health");
  }, [apiCall]);

  // Memoize API objects to prevent infinite re-renders
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
      exportScanPDF,
    }),
    [getScanHistory, getScanById, deleteScan, getScanStats, exportScanPDF]
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
