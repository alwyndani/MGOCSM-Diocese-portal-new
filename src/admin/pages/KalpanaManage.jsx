import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  X,
  FileCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFileUrl } from "../../utils/media";

const KalpanaManage = () => {
  const [kalpanas, setKalpanas] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [visibleFilter, setVisibleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    displayOrder: 0,
    isVisible: true,
    publishedDate: new Date().toISOString().split("T")[0],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchKalpanas = async (page = 1) => {
    setLoading(true);
    try {
      const isVisible = visibleFilter === "all" ? "" : visibleFilter;
      const res = await api.get(
        `/api/content/kalpanas/admin?page=${page}&limit=8&search=${search}&isVisible=${isVisible}`
      );
      setKalpanas(res.kalpanas);
      setMeta(res.meta);
    } catch (err) {
      setError("Failed to fetch Kalpana logs from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchKalpanas(1);
    }, 300); // Debounce search input
    return () => clearTimeout(timer);
  }, [search, visibleFilter]);

  const handleOpenForm = (kalpana = null) => {
    setError("");
    setSuccess("");
    setSelectedFile(null);
    setFilePreview(null);

    if (kalpana) {
      setEditingId(kalpana.id);
      setFormData({
        title: kalpana.title,
        description: kalpana.description || "",
        displayOrder: kalpana.displayOrder,
        isVisible: kalpana.isVisible,
        publishedDate: new Date(kalpana.publishedDate).toISOString().split("T")[0],
      });
      if (kalpana.documentUrl) {
        setFilePreview(kalpana.documentUrl);
      }
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        displayOrder: 0,
        isVisible: true,
        publishedDate: new Date().toISOString().split("T")[0],
      });
    }
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit.");
        return;
      }
      setSelectedFile(file);
      setFilePreview(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.publishedDate) {
      setError("Title and Published Date are required.");
      return;
    }

    const multipartData = new FormData();
    multipartData.append("title", formData.title);
    multipartData.append("description", formData.description);
    multipartData.append("displayOrder", formData.displayOrder);
    multipartData.append("isVisible", formData.isVisible);
    multipartData.append("publishedDate", formData.publishedDate);

    if (selectedFile) {
      multipartData.append("file", selectedFile);
    }

    try {
      if (editingId) {
        await api.put(`/api/content/kalpanas/${editingId}`, multipartData);
        setSuccess("Kalpana updated successfully!");
      } else {
        await api.post("/api/content/kalpanas", multipartData);
        setSuccess("Kalpana added successfully!");
      }
      setIsFormOpen(false);
      fetchKalpanas(meta.page);
    } catch (err) {
      setError(err.message || "Failed to commit record.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/api/content/kalpanas/${id}`);
      setSuccess("Kalpana record permanently deleted.");
      setDeleteConfirmId(null);
      fetchKalpanas(kalpanas.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page);
    } catch (err) {
      setError(err.message || "Failed to delete Kalpana.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-medium tracking-wide">
            Kalpanas Directory
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Manage diocesan letters, notifications, and visibility ordering.
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="px-5 py-3 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] hover:scale-[1.03] text-white font-semibold text-xs rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Add Kalpana
        </button>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-200 rounded-2xl text-xs">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl text-xs">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Kalpanas by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
          />
        </div>
        <select
          value={visibleFilter}
          onChange={(e) => setVisibleFilter(e.target.value)}
          className="px-4 py-3 bg-[#090d16] border border-white/5 rounded-xl outline-none focus:border-[#C6A75E] text-slate-300 text-sm"
        >
          <option value="all">All Visibilities</option>
          <option value="true">Visible Only</option>
          <option value="false">Hidden Only</option>
        </select>
      </div>

      {/* Grid Content */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
          </div>
        ) : kalpanas.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            No Kalpanas match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead className="bg-[#090d16] text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Publish Date</th>
                  <th className="px-6 py-4 text-center">Order</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {kalpanas.map((kalpana) => (
                  <tr key={kalpana.id} className="hover:bg-white/5 transition duration-150">
                    <td className="px-6 py-4 font-medium text-white max-w-xs truncate">
                      {kalpana.title}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(kalpana.publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      {kalpana.displayOrder}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        kalpana.isVisible 
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}>
                        {kalpana.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {kalpana.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenForm(kalpana)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(kalpana.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Panel */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 bg-[#090d16]/50 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing page {meta.page} of {meta.totalPages} ({meta.total} records total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page === 1}
                onClick={() => fetchKalpanas(meta.page - 1)}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={meta.page === meta.totalPages}
                onClick={() => fetchKalpanas(meta.page + 1)}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRM DELETE DIALOG BOX */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#090d16] border border-white/10 rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl text-center space-y-6"
            >
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl">
                ⚠️
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Permanently Delete Record?</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  This action cannot be undone. Any document or file linked to this Kalpana will be erased from the server.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="py-3 bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-500/10 transition cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CRUD PANEL MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-[#090d16] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-serif text-white font-medium mb-6">
                {editingId ? "Modify Kalpana Record" : "Add New Kalpana"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Kalpana Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Kalpana No. 124/2026"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Description / Note
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a brief summary of the contents"
                    rows={3}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.publishedDate}
                      onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                    />
                  </div>
                </div>

                {/* File Upload Segment */}
                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Upload Document (PDF / Image)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-grow">
                      <input
                        type="file"
                        id="document-upload"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />
                      <label
                        htmlFor="document-upload"
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer border-dashed transition"
                      >
                        <FileCheck size={16} />
                        {selectedFile ? "Change Document" : "Select Document File"}
                      </label>
                    </div>
                  </div>
                  {filePreview && (
                    <p className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1">
                      <span>📄</span> Linked: {getFileUrl(filePreview).split("/").pop()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isVisible"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-4 h-4 bg-white/5 border border-white/10 rounded text-[#DB2D0B] focus:ring-0 outline-none"
                  />
                  <label htmlFor="isVisible" className="text-sm text-slate-300 select-none">
                    Make visible on the public website immediately
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] hover:scale-[1.03] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#DB2D0B]/10 transition cursor-pointer"
                  >
                    {editingId ? "Save Changes" : "Create Record"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default KalpanaManage;
