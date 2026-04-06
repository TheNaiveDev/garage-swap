import { useState } from "react";
import { Outlet } from "react-router-dom";
import { RiMenuLine } from "@remixicon/react";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with hamburger*/}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#0f172a]">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <RiMenuLine size={22} />
          </button>
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined font-extrabold text-[#f48c25]">
              handyman
            </span>
            <span className="text-lg font-bold text-white">GarageSwap</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
