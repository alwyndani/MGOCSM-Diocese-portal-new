import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  User,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFileUrl } from "../../utils/media";

const AboutManage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    category: "DISTRICT_SECRETARY",
    district: "",
    contactEmail: "",
    contactPhone: "",
    displayOrder: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/content/team-members");
      setMembers(res);
    } catch (err) {
      setError("Failed to fetch leadership profiles from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenForm = (member = null) => {
    setError("");
    setSuccess("");
    setSelectedFile(null);
    setImagePreview(null);

    if (member) {
      setEditingId(member.id);
      setFormData({
        name: member.name,
        designation: member.designation,
        category: member.category,
        district: member.district || "",
        contactEmail: member.contactEmail || "",
        contactPhone: member.contactPhone || "",
        displayOrder: member.displayOrder,
      });
      if (member.imageUrl) {
        setImagePreview(member.imageUrl);
      }
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        designation: "",
        category: "DISTRICT_SECRETARY",
        district: "",
        contactEmail: "",
        contactPhone: "",
        displayOrder: 0,
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

    if (!formData.name || !formData.designation || !formData.category) {
      setError("Name, designation, and category are required.");
      return;
    }

    const multipartData = new FormData();
    multipartData.append("name", formData.name);
    multipartData.append("designation", formData.designation);
    multipartData.append("category", formData.category);
    multipartData.append("district", formData.district);
    multipartData.append("contactEmail", formData.contactEmail);
    multipartData.append("contactPhone", formData.contactPhone);
    multipartData.append("displayOrder", formData.displayOrder);

    if (selectedFile) {
      multipartData.append("image", selectedFile);
    }

    try {
      if (editingId) {
        await api.put(`/api/content/team-members/${editingId}`, multipartData);
        setSuccess("Profile updated successfully!");
      } else {
        await api.post("/api/content/team-members", multipartData);
        setSuccess("Profile added successfully!");
      }
      setIsFormOpen(false);
      fetchMembers();
    } catch (err) {
      setError(err.message || "Failed to save details.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/api/content/team-members/${id}`);
      setSuccess("Profile permanently deleted.");
      setDeleteConfirmId(null);
      fetchMembers();
    } catch (err) {
      setError(err.message || "Failed to remove profile.");
    }
  };

  // Filters logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.designation.toLowerCase().includes(search.toLowerCase()) ||
                          (m.district && m.district.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || m.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-medium tracking-wide">
            Leadership & About Management
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Manage Core Leaders, District Presidents, and District Secretaries.
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="px-5 py-3 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] hover:scale-[1.03] text-white font-semibold text-xs rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Alert Notices */}
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

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search profiles by name, designation, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-[#090d16] border border-white/5 rounded-xl outline-none focus:border-[#C6A75E] text-slate-300 text-sm"
        >
          <option value="all">All Classifications</option>
          <option value="CORE_LEADER">Core Leadership</option>
          <option value="DISTRICT_PRESIDENT">District Presidents</option>
          <option value="DISTRICT_SECRETARY">District Secretaries</option>
        </select>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl text-slate-500 text-sm">
          No leadership profiles found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white/5 border border-white/5 hover:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative group"
            >
              {/* Category tag */}
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                  member.category === "CORE_LEADER" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                  member.category === "DISTRICT_PRESIDENT" ? "bg-amber-500/10 text-[#C6A75E] border border-amber-500/20" :
                  "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {member.category.replace("_", " ")}
                </span>
              </div>

              {/* Photo & Identity */}
              <div className="flex flex-col items-center text-center mt-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center mb-4 relative">
                  {member.imageUrl ? (
                    <img src={getFileUrl(member.imageUrl)} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={36} className="text-slate-500" />
                  )}
                </div>

                <h4 className="text-base font-bold text-white leading-snug line-clamp-1">
                  {member.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2rem]">
                  {member.designation}
                </p>
                {member.district && (
                  <p className="text-[11px] text-[#C6A75E] mt-1 font-semibold uppercase tracking-wider">
                    {member.district} District
                  </p>
                )}
              </div>

              {/* Sorting and Actions */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  Order Index: {member.displayOrder}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenForm(member)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(member.id)}
                    className="p-1.5 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition"
                    title="Delete"
                  >
                    <Trash2 size={14} />
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
                <h3 className="text-lg font-bold text-white">Permanently Delete Profile?</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  This action will permanently delete this leadership record and erase their profile photo file.
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
                {editingId ? "Modify Member Profile" : "Add New Team Member"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image upload circles */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center relative group">
                    {imagePreview ? (
                      <img src={getFileUrl(imagePreview)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-slate-500" />
                    )}
                    <input
                      type="file"
                      id="profile-upload"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                    />
                  </div>
                  <label
                    htmlFor="profile-upload"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold border border-white/10 rounded-xl cursor-pointer transition"
                  >
                    Upload Profile Photo
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      Classification
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                    >
                      <option value="CORE_LEADER">Core Leader</option>
                      <option value="DISTRICT_PRESIDENT">District President</option>
                      <option value="DISTRICT_SECRETARY">District Secretary</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      District (If applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder="e.g. Omalloor"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rev. Fr. Abin Mathew"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Designation Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Thumpamon District President"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                  />
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
                    {editingId ? "Save Profile" : "Create Profile"}
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

export default AboutManage;
