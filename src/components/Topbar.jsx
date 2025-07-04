import { useUI } from "../contexts/uiContext";

export default function Topbar() {
  const { toggleSidebar } = useUI();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex items-center justify-between">
      <h1 className="text-xl font-bold">ScanSynth</h1>
      <button onClick={toggleSidebar} className="text-white">
        ☰
      </button>
    </header>
  );
}
