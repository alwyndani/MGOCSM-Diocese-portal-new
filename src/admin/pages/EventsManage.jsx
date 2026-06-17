import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  Calendar,
  MapPin,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Images
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getFileUrl } from "../../utils/media";

const EventsManage = () => {
  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID is slug string
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: new Date().toISOString().split("T")[0],
    location: "",
    isPublished: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/content/events/admin?page=${page}&limit=8&search=${search}`);
      setEvents(res.events);
      setMeta(res.meta);
    } catch (err) {
      setError("Failed to fetch events from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenForm = (event = null) => {
    setError("");
    setSuccess("");
    setSelectedFile(null);
    setImagePreview(null);

    if (event) {
      setEditingId(event.id);
      setFormData({
        title: event.title,
        description: event.description || "",
        eventDate: new Date(event.eventDate).toISOString().split("T")[0],
        location: event.location || "",
        isPublished: event.isPublished,
      });
      if (event.featuredImage) {
        setImagePreview(event.featuredImage);
      }
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        eventDate: new Date().toISOString().split("T")[0],
        location: "",
        isPublished: true,
      });
    }
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.eventDate) {
      setError("Title and Event Date are required.");
      return;
    }

    const multipartData = new FormData();
    multipartData.append("title", formData.title);
    multipartData.append("description", formData.description);
    multipartData.append("eventDate", formData.eventDate);
    multipartData.append("location", formData.location);
    multipartData.append("isPublished", formData.isPublished);

    if (selectedFile) {
      multipartData.append("image", selectedFile);
    }

    try {
      if (editingId) {
        await api.put(`/api/content/events/${editingId}`, multipartData);
        setSuccess("Event updated successfully!");
      } else {
        await api.post("/api/content/events", multipartData);
        setSuccess("Event created successfully!");
      }
      setIsFormOpen(false);
      fetchEvents(meta.page);
    } catch (err) {
      setError(err.message || "Failed to commit event record.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/api/content/events/${id}`);
      setSuccess("Event and all its gallery files permanently deleted.");
      setDeleteConfirmId(null);
      fetchEvents(events.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page);
    } catch (err) {
      setError(err.message || "Failed to delete event.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-medium tracking-wide">
            Events Manager
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Publish diocesan programs, configure dates, and attach event galleries.
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="px-5 py-3 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] hover:scale-[1.03] text-white font-semibold text-xs rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Create Event
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

      {/* Search Filter */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search events by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            No events found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead className="bg-[#090d16] text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Date & Venue</th>
                  <th className="px-6 py-4 text-center">Media Assets</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-white/5 transition duration-150">
                    <td className="px-6 py-4 font-medium text-white max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 border border-white/10">
                          {event.featuredImage ? (
                            <img src={getFileUrl(event.featuredImage)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={18} className="text-slate-500 m-auto mt-3" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate text-white">{event.title}</p>
                          <p className="text-slate-500 text-[11px] font-mono truncate">{event.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-xs">
                          <Calendar size={12} className="text-[#C6A75E]" />
                          {new Date(event.eventDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin size={12} className="text-slate-500" />
                          {event.location || "No venue declared"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin/gallery?eventId=${event.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-[#C6A75E]/10 text-slate-300 hover:text-[#C6A75E] rounded-xl text-xs transition font-semibold"
                      >
                        <Images size={13} />
                        {event._count?.galleryMedia || 0} Media items
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        event.isPublished 
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {event.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                        {event.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenForm(event)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                          title="Edit Event Details"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(event.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition"
                          title="Delete Event"
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

        {/* Pagination bar */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 bg-[#090d16]/50 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing page {meta.page} of {meta.totalPages} ({meta.total} records total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page === 1}
                onClick={() => fetchEvents(meta.page - 1)}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={meta.page === meta.totalPages}
                onClick={() => fetchEvents(meta.page + 1)}
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
                <h3 className="text-lg font-bold text-white">Permanently Delete Event?</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Crucial: deleting this event will cascade delete all related pictures, media files, and video records on the server.
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
                  Yes, Delete All
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
                {editingId ? "Modify Event Record" : "Create New Event"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image upload widget */}
                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Event Thumbnail / Featured Image
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                      {imagePreview ? (
                        <img src={getFileUrl(imagePreview)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-slate-500" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <input
                        type="file"
                        id="featured-upload"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />
                      <label
                        htmlFor="featured-upload"
                        className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition"
                      >
                        <ImageIcon size={14} />
                        Upload Thumbnail Image
                      </label>
                      <p className="text-[10px] text-slate-500 mt-1.5">JPG, PNG, WEBP formats. Max size 5MB.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Silentium 2K25"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      Location / Venue
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Cathedral Hall, Omalloor"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Description Details
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Write a brief overview describing the event program..."
                    rows={4}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 bg-white/5 border border-white/10 rounded text-[#DB2D0B] focus:ring-0 outline-none"
                  />
                  <label htmlFor="isPublished" className="text-sm text-slate-300 select-none">
                    Publish immediately (visible on Events page)
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
                    {editingId ? "Save Changes" : "Create Event"}
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

export default EventsManage;
