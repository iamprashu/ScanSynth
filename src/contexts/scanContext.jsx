import { createContext, useContext, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { showError, showSuccess } from "../utils/toastHelpers";

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const updateTarget = (value) => setTarget(value);

  const startScan = async (customTarget) => {
    const targetToScan = customTarget || target;

    if (!targetToScan) {
      showError("No target specified.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/scan`,
        { target: targetToScan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess("Scan started successfully.");
      console.log("Scan result:", res.data);
    } catch (err) {
      console.error("Scan error:", err);
      showError("Scan failed. Check logs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScanContext.Provider
      value={{ target, updateTarget, startScan, isLoading }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => useContext(ScanContext);
