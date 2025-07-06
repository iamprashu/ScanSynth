import { useState } from "react";
import { useScan } from "../contexts/scanContext";
import { showError } from "../utils/toastHelpers";
import { useUI } from "../contexts/uiContext";
import { motion } from "framer-motion";

export default function ScanForm() {
  const { updateTarget, startScan, isLoading } = useScan();
  const [input, setInput] = useState("");
  const [scanType, setScanType] = useState("quick");
  const { withLoading } = useUI();

  const scanTypes = [
    {
      id: "quick",
      label: "Quick Scan",
      description: "Basic port & service detection",
      icon: "⚡",
    },
    {
      id: "full",
      label: "Full Scan",
      description: "Comprehensive vulnerability analysis",
      icon: "🔍",
    },
    {
      id: "stealth",
      label: "Stealth Scan",
      description: "Low-profile detection",
      icon: "🕵️",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid =
      /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}|(\d{1,3}\.){3}\d{1,3}$/.test(
        input
      );

    if (!isValid) {
      showError("Please enter a valid domain or IP address.");
      return;
    }

    updateTarget(input);
    setInput("");

    try {
      await withLoading(async () => {
        await startScan(input, scanType);
      }, `Performing ${scanType} scan...`);
    } catch (error) {
      console.error("Scan error:", error);
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scan Type Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Select Scan Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scanTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setScanType(type.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                scanType === type.id
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                  : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{type.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{type.label}</div>
                  <div className="text-xs text-gray-400">
                    {type.description}
                  </div>
                </div>
              </div>
              {scanType === type.id && (
                <motion.div
                  className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full"
                  layoutId="scanTypeIndicator"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Target Input Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Host
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-cyan-400 font-mono">$</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter domain or IP (e.g., google.com or 192.168.1.1)"
              className="w-full pl-8 pr-4 py-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Supports domains, IP addresses, and CIDR notation
          </p>
        </div>

        {/* Scan Options */}
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            Scan Options
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Port scanning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Service detection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">Version enumeration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300">Vulnerability assessment</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
            isLoading || !input.trim()
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/25"
          }`}
          whileHover={!isLoading && input.trim() ? { scale: 1.02 } : {}}
          whileTap={!isLoading && input.trim() ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Scanning in progress...</span>
            </>
          ) : (
            <>
              <span className="text-xl">🔍</span>
              <span>
                Start{" "}
                {scanType === "quick"
                  ? "Quick"
                  : scanType === "full"
                  ? "Full"
                  : "Stealth"}{" "}
                Scan
              </span>
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Security Notice */}
      <motion.div
        className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-start gap-3">
          <span className="text-yellow-400 text-lg">⚠️</span>
          <div className="text-sm text-yellow-200">
            <p className="font-medium mb-1">Ethical Use Only</p>
            <p className="text-yellow-300/80">
              Only scan systems you own or have explicit permission to test.
              Unauthorized scanning may be illegal in your jurisdiction.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
