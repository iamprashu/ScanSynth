import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAPI } from "../hooks/useAPI";
import { useLoading } from "../hooks/useLoading";
import toast from "react-hot-toast";

export default function ScanHistory() {
  const { historyAPI } = useAPI();
  const { isLoading, getLoadingMessage } = useLoading();
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });
  const [searchTarget, setSearchTarget] = useState("");

  useEffect(() => {
    fetchScanHistory();
  }, [pagination.currentPage, filter, searchTarget]);

  const fetchScanHistory = async () => {
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(searchTarget && { target: searchTarget }),
      };

      const response = await historyAPI.getScanHistory(params);
      console.log("Scan history response:", response);

      if (response.success && response.data) {
        setScanHistory(response.data.scans);
        setPagination(response.data.pagination);
      } else if (response.scans && response.pagination) {
        setScanHistory(response.scans);
        setPagination(response.pagination);
      } else {
        console.log("Unexpected scan history response format:", response);
        toast.error("Failed to load scan history - unexpected response format");
      }
    } catch (error) {
      console.error("Failed to fetch scan history:", error);
      toast.error("Failed to load scan history");
    }
  };

  const handleDeleteScan = async (scanId) => {
    try {
      const response = await historyAPI.deleteScan(scanId);
      if (response.success) {
        toast.success("Scan deleted successfully");
        fetchScanHistory();
      } else {
        toast.error("Failed to delete scan");
      }
    } catch (error) {
      console.error("Failed to delete scan:", error);
      toast.error("Failed to delete scan");
    }
  };

  const handleRegeneratePDF = async (scanId) => {
    try {
      const response = await historyAPI.regeneratePDF(scanId);
      console.log("PDF regeneration response:", response);

      if (response.message && response.pdfReport) {
        await historyAPI.downloadPDF(response.pdfReport.filename);
        toast.success("PDF report regenerated successfully");
        await fetchScanHistory();
      } else if (response.success && response.data && response.data.pdfUrl) {
        const filename = response.data.pdfUrl.split("/").pop();
        await historyAPI.downloadPDF(filename);
        toast.success("PDF report regenerated successfully");
        await fetchScanHistory();
      } else {
        toast.error("Failed to regenerate PDF report");
      }
    } catch (error) {
      console.error("Failed to regenerate PDF:", error);
      toast.error("Failed to regenerate PDF report");
    }
  };

  const handleViewPDF = async (pdfFilename) => {
    try {
      await historyAPI.downloadPDF(pdfFilename);
    } catch (error) {
      console.error("Failed to open PDF:", error);
      toast.error("Failed to open PDF report");
    }
  };

  const filteredScans = scanHistory.filter((scan) => {
    if (filter === "all") return true;
    if (filter === "completed") return scan.status === "completed";
    if (filter === "failed") return scan.status === "failed";
    if (filter === "running") return scan.status === "running";
    return true;
  });

  const isHistoryLoading = isLoading("scan-history");
  const isDeleting = (scanId) => isLoading(`delete-scan-${scanId}`);
  const isRegenerating = (scanId) => isLoading(`regenerate-pdf-${scanId}`);

  return (
    <div className="h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col text-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.div
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 pb-4 flex-shrink-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Scan History
            </h1>
            <p className="text-gray-400 text-lg">
              View and analyze your previous network scans and vulnerability
              assessments.
            </p>
          </div>

          {isHistoryLoading && (
            <motion.div
              className="mx-6 mb-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex-shrink-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <p className="text-cyan-400 font-medium">
                    {getLoadingMessage("scan-history")}
                  </p>
                  <p className="text-cyan-300/70 text-sm">
                    Loading your scan history...
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="px-6 pb-4 flex-shrink-0 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by target..."
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  disabled={isHistoryLoading}
                  className={`w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isHistoryLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <motion.button
                onClick={() => setSearchTarget("")}
                disabled={isHistoryLoading}
                className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors ${
                  isHistoryLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileHover={isHistoryLoading ? {} : { scale: 1.05 }}
                whileTap={isHistoryLoading ? {} : { scale: 0.95 }}
              >
                Clear
              </motion.button>
            </div>

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
                  disabled={isHistoryLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === filterOption.id
                      ? "bg-cyan-600 text-white shadow-lg"
                      : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700"
                  } ${isHistoryLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={isHistoryLoading ? {} : { scale: 1.02 }}
                  whileTap={isHistoryLoading ? {} : { scale: 0.98 }}
                >
                  <span>{filterOption.icon}</span>
                  {filterOption.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-6">
            <div className="h-full overflow-y-auto scrollbar-hide p-2">
              <div className="space-y-4 pb-4">
                {isHistoryLoading ? (
                  <motion.div
                    className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-semibold mb-2">
                      Loading scan history...
                    </p>
                    <p className="text-gray-400">
                      {getLoadingMessage("scan-history")}
                    </p>
                  </motion.div>
                ) : filteredScans.length === 0 ? (
                  <motion.div
                    className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">📋</span>
                    </div>
                    <p className="text-white font-semibold mb-2">
                      No scans found
                    </p>
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
                        setSelectedScan(
                          selectedScan?.id === scan.id ? null : scan
                        )
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
                              <h3 className="text-sm bg-black px-2  w-fit text-green-300">
                                Scan Type: {scan.scanType}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {new Date(scan.createdAt).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(scan.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* //agar quick scan h to ai ko cll nahi jana chahiye qki scan result sahi nahi ayega model trin nahi jh */}
                            {scan.pdfUrl && scan.scanType != "quick" && (
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPDF(
                                    scan.pdfFilename ||
                                      scan.pdfUrl.split("/").pop()
                                  );
                                }}
                                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="View PDF Report"
                              >
                                📄
                              </motion.button>
                            )}
                            {scan.scanType != "quick" && (
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRegeneratePDF(scan.id);
                                }}
                                disabled={isRegenerating(scan.id)}
                                className={`p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
                                  isRegenerating(scan.id)
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                whileHover={
                                  isRegenerating(scan.id) ? {} : { scale: 1.05 }
                                }
                                whileTap={
                                  isRegenerating(scan.id) ? {} : { scale: 0.95 }
                                }
                                title="Regenerate PDF Report"
                              >
                                {isRegenerating(scan.id) ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  "🔄"
                                )}
                              </motion.button>
                            )}

                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteScan(scan.id);
                              }}
                              disabled={isDeleting(scan.id)}
                              className={`p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors ${
                                isDeleting(scan.id)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              whileHover={
                                isDeleting(scan.id) ? {} : { scale: 1.05 }
                              }
                              whileTap={
                                isDeleting(scan.id) ? {} : { scale: 0.95 }
                              }
                              title="Delete Scan"
                            >
                              {isDeleting(scan.id) ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                "🗑️"
                              )}
                            </motion.button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              scan.status === "completed"
                                ? "bg-green-900/30 text-green-400 border border-green-500/30"
                                : scan.status === "failed"
                                ? "bg-red-900/30 text-red-400 border border-red-500/30"
                                : "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
                            }`}
                          >
                            {scan.status === "completed" && "✅ Completed"}
                            {scan.status === "failed" && "❌ Failed"}
                            {scan.status === "running" && "🔄 Running"}
                          </span>
                        </div>

                        {selectedScan?.id === scan.id && (
                          <motion.div
                            className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <h4 className="text-sm font-medium text-gray-300 mb-2">
                              Scan Details
                            </h4>
                            <div className="text-sm text-gray-400 space-y-1">
                              <p>Target: {scan.target}</p>
                              <p>
                                Created:{" "}
                                {new Date(scan.createdAt).toLocaleString()}
                              </p>
                              {scan.scanType == "quick" && (
                                <table className="w-full">
                                  <thead className="bg-gray-700/30">
                                    <tr className="text-left">
                                      <th>Port</th>
                                      <th>State</th>
                                      <th>Service</th>
                                      <th>Version</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-left">
                                    {scan.parsedData.ports?.map((eachPort) => {
                                      return (
                                        <tr>
                                          <td>{eachPort.port}</td>
                                          <td>{eachPort.state}</td>
                                          <td>{eachPort.service}</td>
                                          <td>{eachPort.version}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {!isHistoryLoading && pagination.totalPages > 1 && (
            <div className="p-6 pt-4 flex-shrink-0">
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: Math.max(1, prev.currentPage - 1),
                      }))
                    }
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pagination.hasPrevPage
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                    whileHover={pagination.hasPrevPage ? { scale: 1.05 } : {}}
                    whileTap={pagination.hasPrevPage ? { scale: 0.95 } : {}}
                  >
                    Previous
                  </motion.button>
                  <span className="px-4 py-2 text-gray-300">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <motion.button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: Math.min(
                          pagination.totalPages,
                          prev.currentPage + 1
                        ),
                      }))
                    }
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pagination.hasNextPage
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                    whileHover={pagination.hasNextPage ? { scale: 1.05 } : {}}
                    whileTap={pagination.hasNextPage ? { scale: 0.95 } : {}}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
