import { useState } from "react";
import { useLoading } from "../hooks/useLoading";
import { useAPI } from "../hooks/useAPI";
import toast from "react-hot-toast";

export default function LoadingExample() {
  const { scanAPI, historyAPI } = useAPI();
  const {
    isLoading,
    getLoadingMessage,
    executeWithLoading,
    executeWithGlobalLoading,
    manualLoading,
  } = useLoading();

  const [target, setTarget] = useState("");

  const handleStartScan = async () => {
    if (!target) {
      toast.error("Please enter a target");
      return;
    }

    try {
      const result = await executeWithLoading(
        () => scanAPI.startScan(target, "quick"),
        "scan-operation",
        `Starting scan for ${target}...`
      );

      if (result.success) {
        toast.success("Scan started successfully!");
      }
    } catch {
      toast.error("Failed to start scan");
    }
  };

  const handleRefreshHistory = async () => {
    try {
      const result = await executeWithGlobalLoading(
        () => historyAPI.getScanHistory({ page: 1, limit: 10 }),
        "Refreshing scan history..."
      );

      if (result.success) {
        toast.success("History refreshed!");
      }
    } catch {
      toast.error("Failed to refresh history");
    }
  };

  const handleManualOperation = async () => {
    const stopLoading = manualLoading(
      "manual-op",
      "Performing manual operation..."
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Manual operation completed!");
    } catch {
      toast.error("Manual operation failed");
    } finally {
      stopLoading();
    }
  };

  const handleBatchOperations = async () => {
    const operations = [
      { fn: () => scanAPI.getScanStats(), name: "Get Stats" },
      {
        fn: () => historyAPI.getScanHistory({ limit: 5 }),
        name: "Get Recent History",
      },
    ];

    try {
      await executeWithLoading(
        async () => {
          const results = [];
          for (const operation of operations) {
            const result = await operation.fn();
            results.push(result);
          }
          return results;
        },
        "batch-operations",
        "Performing batch operations..."
      );

      toast.success("Batch operations completed!");
    } catch {
      toast.error("Batch operations failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Loading System Examples
      </h2>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">
          1. Specific Operation Loading
        </h3>
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="Enter target (e.g., example.com)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
          />
          <button
            onClick={handleStartScan}
            disabled={isLoading("scan-operation")}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 disabled:opacity-50"
          >
            {isLoading("scan-operation") ? "Starting..." : "Start Scan"}
          </button>
        </div>
        {isLoading("scan-operation") && (
          <p className="text-cyan-400 text-sm">
            {getLoadingMessage("scan-operation")}
          </p>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">
          2. Global Loading
        </h3>
        <button
          onClick={handleRefreshHistory}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Refresh History
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">
          3. Manual Loading Control
        </h3>
        <button
          onClick={handleManualOperation}
          disabled={isLoading("manual-op")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading("manual-op") ? "Processing..." : "Manual Operation"}
        </button>
        {isLoading("manual-op") && (
          <p className="text-green-400 text-sm mt-2">
            {getLoadingMessage("manual-op")}
          </p>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">
          4. Batch Operations
        </h3>
        <button
          onClick={handleBatchOperations}
          disabled={isLoading("batch-operations")}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {isLoading("batch-operations")
            ? "Processing..."
            : "Run Batch Operations"}
        </button>
        {isLoading("batch-operations") && (
          <p className="text-orange-400 text-sm mt-2">
            {getLoadingMessage("batch-operations")}
          </p>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">
          Current Loading States
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Scan Operation:</span>
            <span
              className={
                isLoading("scan-operation") ? "text-cyan-400" : "text-gray-500"
              }
            >
              {isLoading("scan-operation") ? "Loading" : "Idle"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Manual Operation:</span>
            <span
              className={
                isLoading("manual-op") ? "text-green-400" : "text-gray-500"
              }
            >
              {isLoading("manual-op") ? "Loading" : "Idle"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Batch Operations:</span>
            <span
              className={
                isLoading("batch-operations")
                  ? "text-orange-400"
                  : "text-gray-500"
              }
            >
              {isLoading("batch-operations") ? "Loading" : "Idle"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
