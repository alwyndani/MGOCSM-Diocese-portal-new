import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { api } from "../utils/api";
import { 
  FileText, 
  Users, 
  CalendarDays, 
  Image, 
  BookOpen, 
  ShieldAlert,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch stats
      const statsRes = await api.get("/api/dashboard/stats");
      setStats(statsRes.stats);

      // Fetch logs if Super Admin
      if (user?.role === "SUPER_ADMIN") {
        const logsRes = await api.get("/api/dashboard/logs?limit=5");
        setLogs(logsRes.logs);
      }
    } catch (err) {
      setError("Failed to load dashboard metrics. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { name: "Total Kalpanas", value: stats?.kalpanas || 0, icon: FileText, color: "from-[#DB2D0B]/20 to-red-500/5", border: "border-red-500/20" },
    { name: "Team Members", value: stats?.teamMembers || 0, icon: Users, color: "from-[#C6A75E]/20 to-[#C6A75E]/5", border: "border-[#C6A75E]/20" },
    { name: "Events Scheduled", value: stats?.events || 0, icon: CalendarDays, color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20" },
    { name: "Gallery Media Items", value: stats?.galleryItems || 0, icon: Image, color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20" },
    { name: "Published Articles", value: stats?.articles || 0, icon: BookOpen, color: "from-green-500/20 to-green-500/5", border: "border-green-500/20" },
  ];

  return (
    <div className="space-y-10">
      
      {/* Header and Welcome */}
      <div>
        <h2 className="text-3xl font-serif text-white font-medium tracking-wide">
          Welcome back, {user?.username} 👋
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Here is what is happening across the MGOCSM Diocese portal.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white/5 border ${card.border} rounded-3xl p-6 flex flex-col justify-between h-40 shadow-xl relative overflow-hidden`}
            >
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-tr ${card.color} blur-2xl rounded-full`}></div>
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  {card.name}
                </span>
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                  <Icon size={20} className="text-slate-300" />
                </div>
              </div>
              <div className="text-4xl font-bold text-white tracking-tight mt-4">
                {card.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Breakdown and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Core breakdown card */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
          <h3 className="text-lg font-serif text-white font-medium flex items-center gap-2">
            <Users size={18} className="text-[#C6A75E]" />
            Leadership Breakdown
          </h3>
          <div className="w-full h-px bg-white/5"></div>
          
          <div className="space-y-4">
            {[
              { label: "Core Leadership", count: stats?.leadersBreakdown?.CORE_LEADER || 0, percent: "w-[40%]", color: "bg-[#DB2D0B]" },
              { label: "District Presidents", count: stats?.leadersBreakdown?.DISTRICT_PRESIDENT || 0, percent: "w-[75%]", color: "bg-[#C6A75E]" },
              { label: "District Secretaries", count: stats?.leadersBreakdown?.DISTRICT_SECRETARY || 0, percent: "w-[90%]", color: "bg-blue-500" },
            ].map(item => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-semibold">{item.count} members</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.max((item.count / (stats?.teamMembers || 1)) * 100, 10)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit logs card (Super Admin only) */}
        {user?.role === "SUPER_ADMIN" ? (
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-serif text-white font-medium flex items-center gap-2">
              <Clock size={18} className="text-[#C6A75E]" />
              Recent Operations Log
            </h3>
            <div className="w-full h-px bg-white/5"></div>

            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">No recent actions logged.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-4 items-start text-sm border-b border-white/5 pb-4 last:border-none last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-[#DB2D0B] mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 font-medium">
                        {log.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>by {log.admin?.username || "System"}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#C6A75E]">
              <ShieldAlert size={28} />
            </div>
            <h3 className="text-base font-semibold text-white">Standard Admin Access</h3>
            <p className="text-slate-400 text-xs mt-2 max-w-xs leading-relaxed">
              System logs and configuration tools are restricted. Please contact a Super Admin for advanced server tasks.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;
