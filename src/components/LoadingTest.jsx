import { useState } from "react";
import { useLoading } from "../hooks/useLoading";
import { useAPI } from "../hooks/useAPI";

export default function LoadingTest() {
  const {
    executeWithLoading,
    executeWithGlobalLoading,
    isLoading,
    getLoadingMessage,
  } = useLoading();
  const { healthAPI } = useAPI();
  const [testResults, setTestResults] = useState([]);

  const testSpecificLoading = async () => {
    try {
      const result = await executeWithLoading(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve("Specific loading test completed"), 2000)
          ),
        "test-specific",
        "Testing specific loading..."
      );
      setTestResults((prev) => [
        ...prev,
        {
          type: "Specific",
          result,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch {
      setTestResults((prev) => [
        ...prev,
        {
          type: "Specific",
          result: "Error",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const testGlobalLoading = async () => {
    try {
      const result = await executeWithGlobalLoading(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve("Global loading test completed"), 2000)
          ),
        "Testing global loading..."
      );
      setTestResults((prev) => [
        ...prev,
        { type: "Global", result, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch {
      setTestResults((prev) => [
        ...prev,
        {
          type: "Global",
          result: "Error",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const testAPIHealth = async () => {
    try {
      const result = await healthAPI.checkHealth();
      setTestResults((prev) => [
        ...prev,
        {
          type: "API Health",
          result: result.success ? "Success" : "Failed",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch {
      setTestResults((prev) => [
        ...prev,
        {
          type: "API Health",
          result: "Error",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const isSpecificLoading = isLoading("test-specific");

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Loading System Test
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={testSpecificLoading}
          disabled={isSpecificLoading}
          className={`p-4 rounded-lg font-medium transition-colors ${
            isSpecificLoading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-cyan-600 hover:bg-cyan-700 text-white"
          }`}
        >
          {isSpecificLoading ? "Testing..." : "Test Specific Loading"}
        </button>

        <button
          onClick={testGlobalLoading}
          className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Test Global Loading
        </button>

        <button
          onClick={testAPIHealth}
          className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          Test API Health
        </button>
      </div>

      {isSpecificLoading && (
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-cyan-400 font-medium">
                {getLoadingMessage("test-specific")}
              </p>
              <p className="text-cyan-300/70 text-sm">
                This is a test of the specific loading system
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Test Results</h3>
        <div className="space-y-2">
          {testResults.length === 0 ? (
            <p className="text-gray-400">
              No tests run yet. Click the buttons above to test the loading
              system.
            </p>
          ) : (
            testResults.map((result, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-700/50 rounded"
              >
                <span className="text-white">{result.type}</span>
                <span
                  className={`text-sm ${
                    result.result === "Success" ||
                    result.result.includes("completed")
                      ? "text-green-400"
                      : result.result === "Error"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {result.result}
                </span>
                <span className="text-gray-400 text-sm">
                  {result.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          Current Loading States
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Test Specific:</span>
            <span
              className={isSpecificLoading ? "text-cyan-400" : "text-gray-500"}
            >
              {isSpecificLoading ? "Loading" : "Idle"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">API Health:</span>
            <span
              className={
                isLoading("health-check") ? "text-green-400" : "text-gray-500"
              }
            >
              {isLoading("health-check") ? "Loading" : "Idle"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
