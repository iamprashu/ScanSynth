import { ClerkProvider } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function ClerkWithRouter({ children }) {
  const navigate = useNavigate();
  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={navigate}>
      {children}
    </ClerkProvider>
  );
}
