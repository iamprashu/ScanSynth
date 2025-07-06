import { BrowserRouter } from "react-router-dom";
import { ClerkWithRouter } from "./config/clerkConfig";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { UIProvider } from "./contexts/uiContext";
import { ApiProvider } from "./contexts/apiContext";

export default function App() {
  return (
    <BrowserRouter>
      <ClerkWithRouter>
        <UIProvider>
          <ApiProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </ApiProvider>
        </UIProvider>
      </ClerkWithRouter>
    </BrowserRouter>
  );
}
