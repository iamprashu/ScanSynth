import { motion } from "framer-motion";
import { useState } from "react";

export default function AIReport({ scanData, onClose }) {
  const [report, setReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    setGenerating(true);

    setTimeout(() => {
      const aiReport = {
        summary: `AI analysis of ${scanData.target} reveals ${
          scanData.vulnerabilities?.length || 0
        } potential security vulnerabilities. The target shows ${
          scanData.openPorts?.length || 0
        } open ports with various services running.`,
        riskAssessment: {
          overall: "Medium",
          critical:
            scanData.vulnerabilities?.filter((v) => v.severity === "critical")
              .length || 0,
          high:
            scanData.vulnerabilities?.filter((v) => v.severity === "high")
              .length || 0,
          medium:
            scanData.vulnerabilities?.filter((v) => v.severity === "medium")
              .length || 0,
          low:
            scanData.vulnerabilities?.filter((v) => v.severity === "low")
              .length || 0,
        },
        recommendations: [
          "Implement proper firewall rules to restrict unnecessary port access",
          "Update all services to their latest versions",
          "Enable security headers and HTTPS enforcement",
          "Implement intrusion detection systems",
          "Regular security audits and penetration testing",
        ],
        detailedAnalysis:
          scanData.vulnerabilities?.map((vuln) => ({
            ...vuln,
            aiAnalysis: `This vulnerability poses a ${vuln.severity} risk to the system. Immediate attention is required to prevent potential exploitation.`,
            remediation: `Update the affected service to a patched version and implement additional security controls.`,
          })) || [],
        compliance: {
          gdpr: "Partially compliant",
          pci: "Non-compliant",
          sox: "Requires review",
        },
      };

      setReport(aiReport);
      setGenerating(false);
    }, 3000);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              AI Security Report
            </h2>
            <p className="text-gray-400">Target: {scanData.target}</p>
          </div>
          <motion.button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>

        <div className="p-6">
          {!report && !generating && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-400 text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Generate AI Analysis
              </h3>
              <p className="text-gray-400 mb-6">
                Our AI will analyze the scan results and provide detailed
                security insights, risk assessments, and remediation
                recommendations.
              </p>
              <motion.button
                onClick={generateReport}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Generate AI Report
              </motion.button>
            </div>
          )}

          {generating && (
            <div className="text-center py-8">
              <motion.div
                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h3 className="text-xl font-semibold text-white mb-2">
                Generating AI Report
              </h3>
              <p className="text-gray-400">
                Analyzing vulnerabilities and generating recommendations...
              </p>
            </div>
          )}

          {report && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Executive Summary
                </h3>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-300 leading-relaxed">
                    {report.summary}
                  </p>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Risk Assessment
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-red-400">
                      {report.riskAssessment.critical}
                    </p>
                    <p className="text-sm text-red-300">Critical</p>
                  </div>
                  <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-orange-400">
                      {report.riskAssessment.high}
                    </p>
                    <p className="text-sm text-orange-300">High</p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-400">
                      {report.riskAssessment.medium}
                    </p>
                    <p className="text-sm text-yellow-300">Medium</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {report.riskAssessment.low}
                    </p>
                    <p className="text-sm text-green-300">Low</p>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">
                      {report.riskAssessment.overall}
                    </p>
                    <p className="text-sm text-purple-300">Overall Risk</p>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Security Recommendations
                </h3>
                <div className="space-y-3">
                  {report.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-400 text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-gray-300">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              {report.detailedAnalysis.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Detailed Vulnerability Analysis
                  </h3>
                  <div className="space-y-4">
                    {report.detailedAnalysis.map((vuln, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-white mb-1">
                                {vuln.title}
                              </h4>
                              <p className="text-sm text-gray-400">
                                CVE: {vuln.cve || "N/A"}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                vuln.severity === "critical"
                                  ? "text-red-400 bg-red-900/20 border-red-500/30"
                                  : vuln.severity === "high"
                                  ? "text-orange-400 bg-orange-900/20 border-orange-500/30"
                                  : vuln.severity === "medium"
                                  ? "text-yellow-400 bg-yellow-900/20 border-yellow-500/30"
                                  : "text-green-400 bg-green-900/20 border-green-500/30"
                              }`}
                            >
                              {vuln.severity}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-300 mb-1">
                                AI Analysis
                              </p>
                              <p className="text-sm text-gray-400">
                                {vuln.aiAnalysis}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-300 mb-1">
                                Remediation
                              </p>
                              <p className="text-sm text-gray-400">
                                {vuln.remediation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Compliance Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(report.compliance).map(
                    ([standard, status]) => (
                      <div
                        key={standard}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                      >
                        <p className="text-sm font-medium text-gray-300 mb-2">
                          {standard.toUpperCase()}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            status === "compliant"
                              ? "bg-green-900/30 text-green-400 border border-green-500/30"
                              : status === "partially compliant"
                              ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-900/30 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <motion.button
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download PDF
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Share Report
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
