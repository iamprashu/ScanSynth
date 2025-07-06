import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ScanOptions from "../components/ScanOptions";
import { useEffect } from "react";
import { RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useUI } from "../contexts/uiContext";

export default function Dashboard() {
  const server = import.meta.env.VITE_BACKEND_URL;
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { withLoading } = useUI();

  useEffect(() => {
    const ensureUserExists = async () => {
      if (!isLoaded || !isSignedIn) {
        return <RedirectToSignIn />;
      }

      try {
        await withLoading(async () => {
          const token = await getToken();

          const response = await fetch(`${server}/user/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            toast.error("Something Went Wrong!");
          } else {
            const data = await response.json();
            toast.success(data.message);
          }
        }, "Initializing your account...");
      } catch (err) {
        console.error("Network error:", err);
        toast.error(
          "A network error occurred. Please check your connection and try again."
        );
      }
    };

    ensureUserExists();
  }, [server, getToken, isLoaded, isSignedIn, withLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 md:flex">
      <Topbar />
      <Sidebar />
      <main className="flex-1 mt-16 md:mt-0 overflow-auto">
        <ScanOptions />
      </main>
    </div>
  );
}
