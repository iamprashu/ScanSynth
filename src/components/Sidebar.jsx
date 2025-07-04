import { SignOutButton } from "@clerk/clerk-react";
import { useUI } from "../contexts/uiContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUI();
  const navigate = useNavigate();

  const navItems = [
    { label: "Scan & Get Report", path: "/dashboard" },
    { label: "Scan History", path: "/history" },
  ];

  return (
    <aside
      className={`fixed md:static top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-white transform transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        ScanSynth
      </div>
      <nav className="flex flex-col p-4 space-y-3">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              closeSidebar();
            }}
            className="text-left hover:bg-gray-800 px-3 py-2 rounded transition"
          >
            {item.label}
          </button>
        ))}

        <SignOutButton />
      </nav>
    </aside>
  );
}
