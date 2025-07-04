import { createContext, useContext, useState } from "react";

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [target, setTarget] = useState("");

  const updateTarget = (value) => setTarget(value);

  return (
    <ScanContext.Provider value={{ target, updateTarget }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => useContext(ScanContext);
