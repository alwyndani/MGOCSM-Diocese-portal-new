import React, { useState } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import AdminSidebar from "./AdminSidebar";
import { Menu, Globe } from "lucide-react";

const AdminLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b12] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium text-sm tracking-wide">Validating session credentials...</p>
      </div>
    );
  }

  // Redirect unauthorized users to login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans flex">
      {/* Sidebar navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay to close sidebar on mobile click */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        ></div>
      )}

      {/* Main content body */}
      <div className="flex-1 flex flex-col md:pl-72 min-w-0">
        
        {/* Top Header bar */}
        <header className="sticky top-0 z-20 bg-[#070b12]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 md:hidden transition"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold tracking-wide hidden sm:block">
              Control Panel
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition"
            >
              <Globe size={14} />
              View Site
            </Link>
          </div>
        </header>

        {/* Content Outlet for matching sub-routes */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default AdminLayout;
