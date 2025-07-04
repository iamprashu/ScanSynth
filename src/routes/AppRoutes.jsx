import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Hero from "../components/Hero";
import Dashboard from "../pages/Dashboard";
import ScanHistory from "../components/ScanHistory";

export default function AppRoutes() {
  return (
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
        path="*"
        element={
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        }
      />

      <Route
        path="/history"
        element={
          <>
            <SignedIn>
              <ScanHistory />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}
