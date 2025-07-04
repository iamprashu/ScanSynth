import { BrowserRouter } from "react-router-dom";
import { ClerkWithRouter } from "./config/clerkConfig";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { UIProvider } from "./contexts/uiContext";

export default function App() {
  return (
    <UIProvider>
      <BrowserRouter>
        <ClerkWithRouter>
          <AppRoutes />
          <Toaster position="top-right" />
        </ClerkWithRouter>
      </BrowserRouter>
    </UIProvider>
  );
}
