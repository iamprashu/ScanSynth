import { motion } from "framer-motion";
import { useState } from "react";
import AIReport from "./AIReport";

export default function ScanResults({ results }) {
  const [showAIReport, setShowAIReport] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedPorts, setExpandedPorts] = useState(new Set());

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "ports", label: "Open Ports", icon: "🔌" },
    { id: "services", label: "Services", icon: "⚙️" },
    { id: "vulnerabilities", label: "Vulnerabilities", icon: "🛡️" },
  ];

  const togglePortExpansion = (port) => {
    const newExpanded = new Set(expandedPorts);
    if (newExpanded.has(port)) {
      newExpanded.delete(port);
    } else {
      newExpanded.add(port);
    }
    setExpandedPorts(newExpanded);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "text-red-400 bg-red-900/20 border-red-500/30";
      case "high":
        return "text-orange-400 bg-orange-900/20 border-orange-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30";
      case "low":
        return "text-green-400 bg-green-900/20 border-green-500/30";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-500/30";
    }
  };

  if (!results) return null;

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Scan Results</h2>
            <p className="text-gray-400">Target: {results.target}</p>
          </div>
          <motion.button
            onClick={() => setShowAIReport(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🤖</span>
            Generate AI Report
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-xl p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-cyan-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
        {activeTab === "overview" && (
          <motion.div
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 text-xl">🔌</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {results.openPorts?.length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Open Ports</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 text-xl">⚙️</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {results.services?.length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Services</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-red-400 text-xl">🛡️</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {results.vulnerabilities?.length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Vulnerabilities</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 text-xl">📊</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {results.riskScore || "N/A"}
                    </p>
                    <p className="text-sm text-gray-400">Risk Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-3">
                Scan Summary
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Scan completed in {results.scanDuration || "N/A"}</p>
                <p>• Target is {results.isOnline ? "online" : "offline"}</p>
                <p>• Detected {results.osInfo || "unknown"} operating system</p>
                <p>• Scan type: {results.scanType || "Standard"}</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "ports" && (
          <motion.div
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {results.openPorts?.map((port, index) => (
                <motion.div
                  key={port.number}
                  className="bg-gray-700/50 rounded-xl border border-gray-600 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => togglePortExpansion(port.number)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-600/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                        <span className="text-cyan-400 font-mono font-bold">
                          {port.number}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">
                          {port.service}
                        </p>
                        <p className="text-sm text-gray-400">{port.protocol}</p>
                      </div>
                    </div>
                    <motion.span
                      animate={{
                        rotate: expandedPorts.has(port.number) ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      ▼
                    </motion.span>
                  </button>

                  {expandedPorts.has(port.number) && (
                    <motion.div
                      className="px-4 pb-4 border-t border-gray-600"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="pt-4 space-y-3">
                        {port.version && (
                          <div>
                            <p className="text-sm font-medium text-gray-300">
                              Version
                            </p>
                            <p className="text-sm text-gray-400 font-mono">
                              {port.version}
                            </p>
                          </div>
                        )}
                        {port.banner && (
                          <div>
                            <p className="text-sm font-medium text-gray-300">
                              Banner
                            </p>
                            <p className="text-sm text-gray-400 font-mono">
                              {port.banner}
                            </p>
                          </div>
                        )}
                        {port.state && (
                          <div>
                            <p className="text-sm font-medium text-gray-300">
                              State
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                port.state === "open"
                                  ? "bg-green-900/30 text-green-400 border border-green-500/30"
                                  : "bg-gray-900/30 text-gray-400 border border-gray-500/30"
                              }`}
                            >
                              {port.state}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "services" && (
          <motion.div
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.services?.map((service, index) => (
                <motion.div
                  key={service.name}
                  className="bg-gray-700/50 rounded-xl p-4 border border-gray-600"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400">⚙️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{service.name}</p>
                      <p className="text-sm text-gray-400">
                        Port {service.port}
                      </p>
                    </div>
                  </div>
                  {service.version && (
                    <p className="text-sm text-gray-300 mb-2">
                      Version:{" "}
                      <span className="font-mono text-gray-400">
                        {service.version}
                      </span>
                    </p>
                  )}
                  {service.description && (
                    <p className="text-sm text-gray-400">
                      {service.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "vulnerabilities" && (
          <motion.div
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {results.vulnerabilities?.map((vuln, index) => (
                <motion.div
                  key={vuln.id}
                  className="bg-gray-700/50 rounded-xl border border-gray-600 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getSeverityColor(
                            vuln.severity
                          )}`}
                        >
                          <span className="text-lg">🛡️</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {vuln.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            CVE: {vuln.cve || "N/A"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                          vuln.severity
                        )}`}
                      >
                        {vuln.severity}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {vuln.description && (
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-1">
                            Description
                          </p>
                          <p className="text-sm text-gray-400">
                            {vuln.description}
                          </p>
                        </div>
                      )}

                      {vuln.affected && (
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-1">
                            Affected
                          </p>
                          <p className="text-sm text-gray-400 font-mono">
                            {vuln.affected}
                          </p>
                        </div>
                      )}

                      {vuln.recommendation && (
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-1">
                            Recommendation
                          </p>
                          <p className="text-sm text-gray-400">
                            {vuln.recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {(!results.vulnerabilities ||
                results.vulnerabilities.length === 0) && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-400 text-2xl">✅</span>
                  </div>
                  <p className="text-white font-semibold mb-2">
                    No Vulnerabilities Found
                  </p>
                  <p className="text-gray-400">
                    The target appears to be secure based on this scan.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* AI Report Modal */}
      {showAIReport && (
        <AIReport scanData={results} onClose={() => setShowAIReport(false)} />
      )}
    </motion.div>
  );
}
