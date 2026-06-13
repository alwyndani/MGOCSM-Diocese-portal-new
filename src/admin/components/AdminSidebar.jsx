import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CalendarDays, 
  Image, 
  BookOpen, 
  History, 
  LogOut, 
  X,
  ShieldCheck
} from "lucide-react";
import logo from "../../assets/LOGO.png";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, role: "ADMIN" },
    { name: "Kalpanas", href: "/admin/kalpanas", icon: FileText, role: "ADMIN" },
    { name: "Team Members", href: "/admin/team-members", icon: Users, role: "ADMIN" },
    { name: "Events", href: "/admin/events", icon: CalendarDays, role: "ADMIN" },
    { name: "Gallery Media", href: "/admin/gallery", icon: Image, role: "ADMIN" },
    { name: "Articles", href: "/admin/articles", icon: BookOpen, role: "ADMIN" },
    { name: "Activity Logs", href: "/admin/logs", icon: History, role: "SUPER_ADMIN" },
  ];

  const filteredLinks = links.filter(link => {
    if (link.role === "SUPER_ADMIN") {
      return user?.role === "SUPER_ADMIN";
    }
    return true;
  });

  return (
    <>
      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#090d16] border-r border-white/5 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full py-6 px-6 relative">
          
          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white md:hidden hover:bg-white/5 transition"
          >
            <X size={20} />
          </button>

          {/* Logo Section */}
          <div className="mb-10 text-center">
            <Link to="/" onClick={onClose}>
              <img src={logo} alt="MGOCSM Logo" className="w-28 mx-auto" />
            </Link>
            <div className="mt-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              CMS Portal
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {filteredLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0]/80 text-white shadow-lg shadow-[#DB2D0B]/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User profile dropdown and Logout */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#DB2D0B]/30 to-[#C6A75E]/30 flex items-center justify-center text-white border border-white/10 font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate leading-tight">
                  {user?.username}
                </p>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                  <ShieldCheck size={10} className="text-[#C6A75E]" />
                  {user?.role?.replace("_", " ")}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition duration-300 cursor-pointer"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
