import ScanForm from "../components/ScanForm";
import { ScanProvider } from "../contexts/scanContext";

export default function ScanOptions() {
  return (
    <ScanProvider>
      <div className="p-6 text-white max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Scan & Get Report</h2>
        <p className="text-gray-400 mb-6">
          Enter a valid IP or domain name to begin a secure vulnerability scan.
        </p>
        <ScanForm />
      </div>
    </ScanProvider>
  );
}
