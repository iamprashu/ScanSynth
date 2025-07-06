import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useLoading } from "../hooks/useLoading";

export default function ScanHistory() {
  const { getToken } = useAuth();
  const { executeWithLoading } = useLoading();
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      await executeWithLoading(async () => {
        const token = await getToken();
        const server = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${server}/scans/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setScanHistory(data.scans || []);
        } else {
          throw new Error("Failed to fetch scan history");
        }
      }, "Loading scan history...");
    } catch (error) {
      console.error("Failed to fetch scan history:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-400 bg-green-900/20 border-green-500/30";
      case "failed":
        return "text-red-400 bg-red-900/20 border-red-500/30";
      case "running":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-500/30";
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredScans = scanHistory.filter((scan) => {
    if (filter === "all") return true;
    if (filter === "completed") return scan.status === "completed";
    if (filter === "failed") return scan.status === "failed";
    if (filter === "running") return scan.status === "running";
    return true;
  });

  // Loading state is now handled by the global loader

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 md:flex text-white">
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Scan History
            </h1>
            <p className="text-gray-400 text-lg">
              View and analyze your previous network scans and vulnerability
              assessments.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Scans", icon: "📊" },
                { id: "completed", label: "Completed", icon: "✅" },
                { id: "failed", label: "Failed", icon: "❌" },
                { id: "running", label: "Running", icon: "🔄" },
              ].map((filterOption) => (
                <motion.button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === filterOption.id
                      ? "bg-cyan-600 text-white shadow-lg"
                      : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{filterOption.icon}</span>
                  {filterOption.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Scan List */}
          <div className="space-y-4">
            {filteredScans.length === 0 ? (
              <motion.div
                className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📋</span>
                </div>
                <p className="text-white font-semibold mb-2">No scans found</p>
                <p className="text-gray-400">
                  Start your first scan to see results here.
                </p>
              </motion.div>
            ) : (
              filteredScans.map((scan, index) => (
                <motion.div
                  key={scan.id}
                  className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() =>
                    setSelectedScan(selectedScan?.id === scan.id ? null : scan)
                  }
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                          <span className="text-cyan-400 text-xl">🔍</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {scan.target}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {new Date(scan.createdAt).toLocaleDateString()} at{" "}
                            {new Date(scan.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            scan.status
                          )}`}
                        >
                          {scan.status}
                        </span>
                        {scan.riskLevel && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                              scan.riskLevel
                            )} bg-gray-800/50 border border-gray-700`}
                          >
                            Risk: {scan.riskLevel}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Open Ports</p>
                        <p className="text-white font-semibold">
                          {scan.openPorts || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Services</p>
                        <p className="text-white font-semibold">
                          {scan.services || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Vulnerabilities</p>
                        <p className="text-white font-semibold">
                          {scan.vulnerabilities || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white font-semibold">
                          {scan.duration || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {selectedScan?.id === scan.id && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-gray-700"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="space-y-4">
                          {scan.scanType && (
                            <div>
                              <p className="text-sm font-medium text-gray-300 mb-1">
                                Scan Type
                              </p>
                              <p className="text-sm text-gray-400">
                                {scan.scanType}
                              </p>
                            </div>
                          )}

                          {scan.osInfo && (
                            <div>
                              <p className="text-sm font-medium text-gray-300 mb-1">
                                Operating System
                              </p>
                              <p className="text-sm text-gray-400">
                                {scan.osInfo}
                              </p>
                            </div>
                          )}

                          {scan.summary && (
                            <div>
                              <p className="text-sm font-medium text-gray-300 mb-1">
                                Summary
                              </p>
                              <p className="text-sm text-gray-400">
                                {scan.summary}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-3">
                            <motion.button
                              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View Full Report
                            </motion.button>
                            <motion.button
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Generate AI Analysis
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
