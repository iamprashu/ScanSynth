import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ScanOptions from "../components/ScanOptions";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 md:flex">
      <Topbar />
      <Sidebar />
      <main className="flex-1 mt-16 md:mt-0 ">
        <ScanOptions />
      </main>
    </div>
  );
}
