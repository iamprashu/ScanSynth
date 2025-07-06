import ScanForm from "../components/ScanForm";
import ScanResults from "../components/ScanResults";
import { ScanProvider, useScan } from "../contexts/scanContext";
import { motion } from "framer-motion";

function ScanOptionsContent() {
  const { scanResults, isLoading } = useScan();

  return (
    <div className="p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Network Scanner
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Perform comprehensive network scans to detect open ports, services,
            and vulnerabilities. Get detailed reports with AI-powered analysis
            and security recommendations.
          </p>
        </div>

        {/* Scan Form */}
        <div className="mb-8">
          <ScanForm />
        </div>

        {/* Scan Results */}
        {scanResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ScanResults results={scanResults} />
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cyan-400 font-semibold">Scanning target...</p>
            <p className="text-gray-400 text-sm mt-2">
              This may take a few moments
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function ScanOptions() {
  return (
    <ScanProvider>
      <ScanOptionsContent />
    </ScanProvider>
  );
}
