import { useState } from "react";
import { useScan } from "../contexts/scanContext";
import { showError, showSuccess } from "../utils/toastHelpers";

export default function ScanForm() {
  const { updateTarget } = useScan();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid =
      /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}|(\d{1,3}\.){3}\d{1,3}$/.test(
        input
      );

    if (!isValid) {
      showError("Enter a valid domain or IP address.");
      return;
    }

    updateTarget(input);
    showSuccess("Target saved. You can now initiate scan.");
    // Later: trigger backend scan
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 w-full max-w-2xl"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter domain or IP (e.g., iamprashu.in or 192.168.1.1)"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition"
      >
        Start Scan
      </button>
    </form>
  );
}
