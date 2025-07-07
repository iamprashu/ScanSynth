import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Hero from "../components/Hero";
import Dashboard from "../pages/Dashboard";
import ScanHistory from "../components/ScanHistory";
import LoadingTest from "../components/LoadingTest";
import { useUI } from "../contexts/uiContext";
import GlobalLoader from "../components/GlobalLoader";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 md:flex">
      <Topbar />
      <Sidebar />
      <main className="flex-1 mt-16 md:mt-0 overflow-auto">{children}</main>
    </div>
  );
}

export default function AppRoutes() {
  const { globalLoading, globalLoadingMessage } = useUI();

  return (
    <>
      {globalLoading && <GlobalLoader message={globalLoadingMessage} />}

      <Routes>
        <Route path="/" element={<Hero />} />

        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/history"
          element={
            <>
              <SignedIn>
                <AuthenticatedLayout>
                  <ScanHistory />
                </AuthenticatedLayout>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/test"
          element={
            <>
              <SignedIn>
                <AuthenticatedLayout>
                  <LoadingTest />
                </AuthenticatedLayout>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route
          path="*"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />
      </Routes>
    </>
  );
}
