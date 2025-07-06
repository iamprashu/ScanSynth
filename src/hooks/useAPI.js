import { useContext } from "react";
import { ApiContext } from "../contexts/apiContext";

export function useAPI() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useAPI must be used within an ApiProvider");
  }
  return context;
}
