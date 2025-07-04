import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ScanOptions from "../components/ScanOptions";
import { UIProvider } from "../contexts/uiContext";

export default function ScanHistory() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 md:flex text-white">
      <Topbar />
      <Sidebar />
      <div className="flex-1 p-4 ">
        <p>Your History:</p>
      </div>
    </div>
  );
}
