import { SignOutButton, useClerk } from "@clerk/clerk-react";
import { useUI } from "../contexts/uiContext";
import { useLoading } from "../hooks/useLoading";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUI();
  const { executeWithGlobalLoading } = useLoading();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Scanner",
      path: "/dashboard",
      icon: "🔍",
      description: "Scan networks & detect vulnerabilities",
    },
    {
      label: "History",
      path: "/history",
      icon: "📊",
      description: "View past scan reports",
    },
  ];

  const handleSignOut = async () => {
    try {
      await executeWithGlobalLoading(() => signOut(), "Signing out...");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" />
      )}

      <aside
        className={`fixed md:static top-0 left-0 z-40 h-screen w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white border-r border-cyan-500/20 backdrop-blur-sm transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">SS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                ScanSynth
              </h1>
              <p className="text-xs text-gray-400">Ethical Hacking Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  closeSidebar();
                }}
                className={`relative text-left p-4 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/50 text-cyan-300"
                    : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs text-gray-400 group-hover:text-gray-300">
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  )}
                </div>

                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="w-full bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-500/50 rounded-xl p-3 text-center hover:bg-red-600/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2 text-red-300 hover:text-red-200">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium">Sign Out</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
