import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { 
  Plus, 
  Trash2, 
  X,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Upload,
  Link as LinkIcon
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const GalleryManage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEventId = searchParams.get("eventId") || "";

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Link Form
  const [linkForm, setLinkForm] = useState({
    externalUrl: "",
    mediaType: "VIDEO",
    caption: "",
  });

  // Multi file select
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Fetch list of events on load to fill the dropdown selector
  useEffect(() => {
    const fetchEventsList = async () => {
      try {
        const res = await api.get("/api/content/events");
        setEvents(res);
        if (res.length > 0 && !selectedEventId) {
          setSelectedEventId(res[0].id);
        }
      } catch (err) {
        setError("Failed to fetch events list.");
      }
    };
    fetchEventsList();
  }, []);

  // Fetch gallery media when selected event changes
  const fetchGallery = async () => {
    if (!selectedEventId) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/content/gallery/${selectedEventId}`);
      setMediaItems(res);
      // Sync URL query param
      setSearchParams({ eventId: selectedEventId });
    } catch (err) {
      setError("Failed to load gallery items for this event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedEventId]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleFileUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    setError("");
    setSuccess("");
    setUploadProgress(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await api.post(`/api/content/gallery/${selectedEventId}/upload`, formData);
      setSuccess(`Successfully uploaded ${selectedFiles.length} media files!`);
      setSelectedFiles([]);
      setIsUploadOpen(false);
      fetchGallery();
    } catch (err) {
      setError(err.message || "Failed to upload files.");
    } finally {
      setUploadProgress(false);
    }
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!linkForm.externalUrl) {
      setError("Please input the URL link.");
      return;
    }

    setError("");
    setSuccess("");
    try {
      await api.post(`/api/content/gallery/${selectedEventId}/upload`, linkForm);
      setSuccess("External URL reference saved successfully!");
      setLinkForm({ externalUrl: "", mediaType: "VIDEO", caption: "" });
      setIsLinkOpen(false);
      fetchGallery();
    } catch (err) {
      setError(err.message || "Failed to save link.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/api/content/gallery/media/${id}`);
      setSuccess("Media asset permanently deleted.");
      setDeleteConfirmId(null);
      fetchGallery();
    } catch (err) {
      setError(err.message || "Failed to delete item.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-medium tracking-wide">
            Event Gallery Media Manager
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Configure photos, mp4 videos, or YouTube links grouped by specific diocese events.
          </p>
        </div>
        
        {selectedEventId && (
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsLinkOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LinkIcon size={14} />
              Add Video Link
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex-1 sm:flex-initial px-5 py-3 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] hover:scale-[1.03] text-white font-semibold text-xs rounded-xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={14} />
              Upload Files
            </button>
          </div>
        )}
      </div>

      {/* Select Event dropdown */}
      <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Active Event Folder:
        </label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="flex-1 px-4 py-3 bg-[#090d16] border border-white/5 rounded-xl outline-none focus:border-[#C6A75E] text-white text-sm"
        >
          {events.length === 0 && <option value="">No events recorded yet</option>}
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({e.id})
            </option>
          ))}
        </select>
      </div>

      {/* Notices alerts */}
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

      {/* Gallery Media Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl text-slate-500 text-sm">
          No images or videos uploaded in this event folder yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl aspect-square relative group flex flex-col justify-between"
            >
              
              {/* Media element or placeholder preview */}
              <div className="w-full h-full bg-slate-900 overflow-hidden relative flex items-center justify-center">
                {item.type === "IMAGE" ? (
                  <img src={item.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  // If video is local, display video thumbnail. If YouTube link, show link placeholder
                  item.mediaUrl.startsWith("http") ? (
                    <div className="text-center p-4">
                      <ExternalLink size={24} className="text-[#C6A75E] mx-auto mb-2" />
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.mediaUrl}</p>
                    </div>
                  ) : (
                    <video src={item.mediaUrl} className="w-full h-full object-cover" muted />
                  )
                )}

                {/* Overlaid badges */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    item.type === "IMAGE" 
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/35"
                      : "bg-[#C6A75E]/20 text-[#C6A75E] border border-[#C6A75E]/35"
                  }`}>
                    {item.type}
                  </span>
                </div>

                {/* Overlaid delete button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition transform scale-95 group-hover:scale-100 duration-300 cursor-pointer"
                    title="Delete Media"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <h3 className="text-lg font-bold text-white">Delete Media Item?</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Deleting this photo or video is irreversible and unlinks the asset file from the web server directory.
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

      {/* MULTI UPLOAD FILES MODAL */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-[#090d16] border border-white/10 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl"
            >
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-serif text-white font-medium mb-6">
                Upload Gallery Files
              </h3>

              <form onSubmit={handleFileUploadSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Select File(s)
                  </label>
                  <div className="border border-white/10 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-white/5">
                    <ImageIcon className="text-slate-500" size={32} />
                    <input
                      type="file"
                      id="gallery-files"
                      multiple
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.webp,.mp4"
                      className="hidden"
                    />
                    <label
                      htmlFor="gallery-files"
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs text-slate-300 font-semibold cursor-pointer transition"
                    >
                      Browse Files
                    </label>
                    <p className="text-[10px] text-slate-500 text-center">
                      Select multiple Photos (JPG, PNG, WEBP) or Videos (MP4). Size limit 50MB max.
                    </p>
                  </div>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto bg-black/25 p-3 rounded-xl border border-white/5">
                    <p className="text-xs font-semibold text-slate-300 mb-1">Queue ({selectedFiles.length} files):</p>
                    {selectedFiles.map((file, idx) => (
                      <p key={idx} className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                        <span>•</span> {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => { setSelectedFiles([]); setIsUploadOpen(false); }}
                    className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadProgress}
                    className="px-6 py-3 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] hover:scale-[1.03] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#DB2D0B]/10 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                  >
                    {uploadProgress ? "Uploading..." : "Start Upload"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXTERNAL VIDEO LINK MODAL */}
      <AnimatePresence>
        {isLinkOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLinkOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-[#090d16] border border-white/10 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl"
            >
              <button
                onClick={() => setIsLinkOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-serif text-white font-medium mb-6">
                Add External Video Link
              </h3>

              <form onSubmit={handleLinkSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Link Source Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLinkForm({ ...linkForm, mediaType: "VIDEO" })}
                      className={`py-3 rounded-xl border text-xs font-bold transition ${
                        linkForm.mediaType === "VIDEO"
                          ? "bg-[#C6A75E]/10 border-[#C6A75E] text-[#C6A75E]"
                          : "border-white/15 text-slate-400 hover:text-white"
                      }`}
                    >
                      YouTube / Vimeo Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setLinkForm({ ...linkForm, mediaType: "IMAGE" })}
                      className={`py-3 rounded-xl border text-xs font-bold transition ${
                        linkForm.mediaType === "IMAGE"
                          ? "bg-blue-500/10 border-blue-500 text-blue-400"
                          : "border-white/15 text-slate-400 hover:text-white"
                      }`}
                    >
                      External Image URL
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    URL Address
                  </label>
                  <input
                    type="url"
                    required
                    value={linkForm.externalUrl}
                    onChange={(e) => setLinkForm({ ...linkForm, externalUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Caption / Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkForm.caption}
                    onChange={(e) => setLinkForm({ ...linkForm, caption: e.target.value })}
                    placeholder="e.g. Silentium Gospel Worship Song"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsLinkOpen(false)}
                    className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] hover:scale-[1.03] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#DB2D0B]/10 transition cursor-pointer"
                  >
                    Save URL Reference
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

export default GalleryManage;
