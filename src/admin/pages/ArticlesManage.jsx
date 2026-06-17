import React, { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  User,
  Calendar,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFileUrl } from "../../utils/media";

// Custom Rich Text Editor Component for React 19 compatibility
const CustomRichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "<p><br></p>";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, arg = null) => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden flex flex-col font-sans">
      {/* Editor Formatting Bar */}
      <div className="flex flex-wrap gap-1 p-2 bg-[#090d16] border-b border-white/10">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          title="Bold"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          title="Italic"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          title="Underline"
        >
          <Underline size={15} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1 align-middle self-center"></div>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<h1>")}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition font-bold"
          title="Heading 1"
        >
          <Heading1 size={15} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<h2>")}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition font-bold"
          title="Heading 2"
        >
          <Heading2 size={15} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1 align-middle self-center"></div>
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          title="Bullet List"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto outline-none text-slate-200 text-sm prose prose-invert max-w-none focus:ring-1 focus:ring-[#C6A75E] rounded-b-xl"
        style={{ caretColor: "#C6A75E" }}
      />
    </div>
  );
};

const ArticlesManage = () => {
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // CRUD Panel States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorName: "",
    category: "Spiritual",
    status: "DRAFT",
    publishDate: new Date().toISOString().split("T")[0],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/content/articles/admin?page=${page}&limit=8&search=${search}&status=${statusFilter}`
      );
      setArticles(res.articles);
      setMeta(res.meta);
    } catch (err) {
      setError("Failed to fetch articles from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleOpenForm = (article = null) => {
    setError("");
    setSuccess("");
    setSelectedFile(null);
    setImagePreview(null);

    if (article) {
      setEditingId(article.id);
      setFormData({
        title: article.title,
        content: article.content,
        authorName: article.authorName,
        category: article.category || "Spiritual",
        status: article.status,
        publishDate: new Date(article.publishDate).toISOString().split("T")[0],
      });
      if (article.featuredImage) {
        setImagePreview(article.featuredImage);
      }
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        authorName: "",
        category: "Spiritual",
        status: "DRAFT",
        publishDate: new Date().toISOString().split("T")[0],
      });
    }
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Featured image size exceeds 5MB limit.");
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

    if (!formData.title || !formData.content || !formData.authorName) {
      setError("Title, author name, and article content are required.");
      return;
    }

    const multipartData = new FormData();
    multipartData.append("title", formData.title);
    multipartData.append("content", formData.content);
    multipartData.append("authorName", formData.authorName);
    multipartData.append("category", formData.category);
    multipartData.append("status", formData.status);
    multipartData.append("publishDate", formData.publishDate);

    if (selectedFile) {
      multipartData.append("image", selectedFile);
    }

    try {
      if (editingId) {
        await api.put(`/api/content/articles/${editingId}`, multipartData);
        setSuccess("Article updated successfully!");
      } else {
        await api.post("/api/content/articles", multipartData);
        setSuccess("Article published successfully!");
      }
      setIsFormOpen(false);
      fetchArticles(meta.page);
    } catch (err) {
      setError(err.message || "Failed to commit article record.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/api/content/articles/${id}`);
      setSuccess("Article permanently deleted.");
      setDeleteConfirmId(null);
      fetchArticles(articles.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page);
    } catch (err) {
      setError(err.message || "Failed to delete article.");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-medium tracking-wide">
            Articles Manager
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Publish spiritual journals, theological thoughts, and newsletters.
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="px-5 py-3 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] hover:scale-[1.03] text-white font-semibold text-xs rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Create Article
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
            placeholder="Search articles by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-[#090d16] border border-white/5 rounded-xl outline-none focus:border-[#C6A75E] text-slate-300 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft Only</option>
          <option value="PUBLISHED">Published Only</option>
          <option value="ARCHIVED">Archived Only</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            No articles found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead className="bg-[#090d16] text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author & Category</th>
                  <th className="px-6 py-4">Publish Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-white/5 transition duration-150">
                    <td className="px-6 py-4 font-medium text-white max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 border border-white/10">
                          {article.featuredImage ? (
                            <img src={getFileUrl(article.featuredImage)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={18} className="text-slate-500 m-auto mt-3" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate text-white">{article.title}</p>
                          <p className="text-slate-500 text-[10px] truncate">{article.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="space-y-1">
                        <span className="flex items-center gap-1 text-xs">
                          <User size={11} className="text-[#C6A75E]" />
                          {article.authorName}
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400 font-medium">
                          {article.category || "General"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Calendar size={12} className="text-slate-500" />
                        {new Date(article.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        article.status === "PUBLISHED" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        article.status === "DRAFT" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}>
                        {article.status === "PUBLISHED" ? "Published" : article.status === "DRAFT" ? "Draft" : "Archived"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenForm(article)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                          title="Edit Article"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(article.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition"
                          title="Delete Article"
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

        {/* Pagination panel */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 bg-[#090d16]/50 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing page {meta.page} of {meta.totalPages} ({meta.total} records total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page === 1}
                onClick={() => fetchArticles(meta.page - 1)}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={meta.page === meta.totalPages}
                onClick={() => fetchArticles(meta.page + 1)}
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
                <h3 className="text-lg font-bold text-white">Permanently Delete Article?</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Deleting this article will erase it from the public records. Any associated image will be deleted.
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

      {/* CRUD PANEL MODAL (LARGER SCREEN LAYOUT) */}
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
              className="bg-[#090d16] border border-white/10 rounded-3xl p-8 max-w-4xl w-full relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-serif text-white font-medium mb-6">
                {editingId ? "Modify Article Content" : "Write New Article"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Image input column */}
                  <div className="md:col-span-1 space-y-4">
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      Featured Cover Image
                    </label>
                    <div className="w-full aspect-video md:aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center relative group">
                      {imagePreview ? (
                        <img src={getFileUrl(imagePreview)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-500" />
                      )}
                    </div>
                    <input
                      type="file"
                      id="article-cover"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                    />
                    <label
                      htmlFor="article-cover"
                      className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 border-dashed rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <ImageIcon size={14} />
                      Upload Cover Image
                    </label>
                  </div>

                  {/* Metadata fields columns */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        Article Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Orthodox Spirituality in the 21st Century"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                          Author Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.authorName}
                          onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                          placeholder="e.g. Dr. Jomy Linu"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                          Category / Topic
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-3.5 bg-[#090d16] border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm"
                        >
                          <option value="Spiritual">Spiritual</option>
                          <option value="Theological">Theological</option>
                          <option value="Official">Official</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                          Publish Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.publishDate}
                          onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm transition"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-4 py-3.5 bg-[#090d16] border border-white/10 rounded-xl outline-none focus:border-[#C6A75E] text-slate-200 text-sm"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor Area */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Article Body Content
                  </label>
                  <CustomRichTextEditor
                    value={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
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
                    {editingId ? "Save Article" : "Publish Article"}
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

export default ArticlesManage;
