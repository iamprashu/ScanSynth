import { useState } from "react";
import { useAPI } from "../hooks/useAPI";
import { useLoading } from "../hooks/useLoading";
import { showError } from "../utils/toastHelpers";
import toast from "react-hot-toast";

export default function ScanForm() {
  const { scanAPI } = useAPI();
  const { isLoading, getLoadingMessage } = useLoading();
  const [input, setInput] = useState("");
  const [scanType, setScanType] = useState("quick");
  const [showDeepScanWarning, setShowDeepScanWarning] = useState(false);
  const [pendingScanType, setPendingScanType] = useState(null);

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

    try {
      const res = await scanAPI.startScan(input, scanType);
      console.log("Scan result:", res);

      if (res.scanId) {
        toast.success(
          `Scan completed! Found ${res.summary?.openPorts || 0} open ports.`
        );

        if (res.openServices && res.openServices.length > 0) {
          const servicesList = res.openServices
            .map((service) => `${service.port}: ${service.service}`)
            .join(", ");
          toast.success(`Services found: ${servicesList}`, { duration: 5000 });
        }

        setInput("");
      } else {
        toast.error(res.message || "Failed to start scan");
      }
    } catch (error) {
      console.error("Scan error:", error);
      showError("Failed to start scan. Please try again.");
    }
  };

  const isScanLoading = isLoading("scan-start");

  const handleScanTypeClick = (typeId) => {
    if (typeId === "full" || typeId === "stealth") {
      setPendingScanType(typeId);
      setShowDeepScanWarning(true);
    } else {
      setScanType(typeId);
    }
  };

  const confirmDeepScan = () => {
    setScanType(pendingScanType);
    setShowDeepScanWarning(false);
    setPendingScanType(null);
  };

  const cancelDeepScan = () => {
    setShowDeepScanWarning(false);
    setPendingScanType(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Select Scan Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scanTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleScanTypeClick(type.id)}
              disabled={isScanLoading}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                scanType === type.id
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                  : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50"
              } ${isScanLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {showDeepScanWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-cyan-500">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Deep Scan Warning
            </h2>
            <p className="text-gray-200 mb-6">
              You have selected a{" "}
              <span className="font-semibold">
                {pendingScanType === "full" ? "Full Scan" : "Stealth Scan"}
              </span>
              .<br />
              This is a very deep scan and may take a lot of time to complete.
              <br />
              Please be patient, you will surely get your report once it
              finishes.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeepScan}
                className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 font-semibold"
              >
                Proceed
              </button>
              <button
                onClick={cancelDeepScan}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isScanLoading && (
        <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-cyan-400 font-medium">
                {getLoadingMessage("scan-start")}
              </p>
              <p className="text-cyan-300/70 text-sm">
                Please wait while we initialize your scan...
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={isScanLoading}
              className={`w-full pl-8 pr-4 py-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono transition-all duration-200 ${
                isScanLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Supports domains, IP addresses, and CIDR notation
          </p>
        </div>

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

        <button
          type="submit"
          disabled={!input.trim() || isScanLoading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
            !input.trim() || isScanLoading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/25"
          }`}
        >
          {isScanLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Starting Scan...</span>
            </>
          ) : input.trim() ? (
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
          ) : (
            <span>Start Scan</span>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-yellow-400 text-xl">⚠️</span>
          <div>
            <h4 className="text-yellow-400 font-semibold mb-1">
              Ethical Hacking Notice
            </h4>
            <p className="text-yellow-300/80 text-sm">
              Only scan systems you own or have explicit permission to test.
              Unauthorized scanning may be illegal in your jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
