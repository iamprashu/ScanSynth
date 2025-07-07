import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ScanOptions from "../components/ScanOptions";
import { useEffect, useRef } from "react";
import { RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { useAPI } from "../hooks/useAPI";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const { userAPI } = useAPI();

  const userCreationAttempted = useRef(false);

  useEffect(() => {
    const ensureUserExists = async () => {
      if (!isLoaded || !isSignedIn || userCreationAttempted.current) {
        return;
      }

      userCreationAttempted.current = true;

      try {
        const res = await userAPI.createUser({});
        console.log("User creation result:", res);

        if (res.success) {
          toast.success(res.message || "Welcome to ScanSynth!");
        } else {
          toast.error("Failed to create user");
        }
      } catch (err) {
        console.error(
          "Something went wrong while setting up your account:",
          err
        );
        if (err.message && !err.message.includes("Network")) {
          toast.error("Failed to set up your account");
        }
      }
    };

    ensureUserExists();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

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
