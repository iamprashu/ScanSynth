import ScanForm from "./ScanForm";
import ScanResults from "./ScanResults";
import { motion } from "framer-motion";

export default function ScanOptions() {
  return (
    <div className="p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Network Scanner
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Perform comprehensive network scans to detect open ports, services,
            and vulnerabilities. Get detailed reports with AI-powered analysis
            and security recommendations.
          </p>
        </div>{" "}
        <div className="mb-8">
          <ScanForm />
        </div>{" "}
      </motion.div>
    </div>
  );
}
