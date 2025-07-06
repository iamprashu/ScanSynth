import { useUI } from "../contexts/uiContext";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export default function Topbar() {
  const { toggleSidebar } = useUI();
  const { user } = useAuth();

  return (
    <motion.header
      className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-4 z-50 border-b border-cyan-500/20 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-white font-bold text-sm">SS</span>
          </motion.div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            ScanSynth
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {user.firstName?.charAt(0) ||
                    user.emailAddresses[0]?.emailAddress
                      .charAt(0)
                      .toUpperCase()}
                </span>
              </div>
              <span className="text-gray-300">
                {user.firstName ||
                  user.emailAddresses[0]?.emailAddress.split("@")[0]}
              </span>
            </div>
          )}

          <motion.button
            onClick={toggleSidebar}
            className="text-white p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
