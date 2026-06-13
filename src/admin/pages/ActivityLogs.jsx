import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { 
  History, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Terminal
} from "lucide-react";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/dashboard/logs?page=${page}&limit=15`);
      setLogs(res.logs);
      setMeta(res.meta);
    } catch (err) {
      setError("Failed to fetch system audit logs from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div>
        <h2 className="text-2xl font-serif text-white font-medium tracking-wide flex items-center gap-2">
          <History className="text-[#C6A75E]" />
          System Activity & Audit Logs
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Review administrative changes, log ins, updates, and operations history.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl text-xs">
          {error}
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            No system activity logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead className="bg-[#090d16] text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Operator</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4 text-center">Action</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 font-mono">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition duration-150">
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                      {log.admin?.username || "System / Seeder"}
                    </td>
                    <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Database size={12} className="text-slate-500" />
                        {log.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        log.action === "CREATE" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        log.action === "UPDATE" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        log.action === "DELETE" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        "bg-[#C6A75E]/10 text-[#C6A75E] border border-[#C6A75E]/20"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-200 min-w-[200px]">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination panel */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 bg-[#090d16]/50 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing page {meta.page} of {meta.totalPages} ({meta.total} records total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page === 1}
                onClick={() => fetchLogs(meta.page - 1)}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={meta.page === meta.totalPages}
                onClick={() => fetchLogs(meta.page + 1)}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ActivityLogs;
