import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, User, Calendar, X, FileText } from "lucide-react";
import { getFileUrl } from "../utils/media";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetch("/api/content/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading articles:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-250 border-t-[#DB2D0B] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-slate-50 px-6 py-24 overflow-hidden">
      {/* Animated Soft Background Glow */}
      <motion.div
        animate={{ x: ["-10%", "10%", "-10%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 -z-10 opacity-30"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(198,167,94,0.2),transparent_70%)] blur-3xl"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 font-semibold tracking-wide">
            Spiritual Publications
          </h1>
          <div className="w-28 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] mx-auto mt-6 rounded-full"></div>
          <p className="mt-8 max-w-2xl mx-auto text-slate-600 text-lg leading-relaxed">
            Spiritual reflections, theological insights, and official publications of MGOCSM Diocese of Thumpamon.
          </p>
        </motion.div>

        {/* Content Area */}
        {articles.length === 0 ? (
          /* Elegant Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center justify-center text-center py-24 bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl"
          >
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#C6A75E]/20 mb-8">
              <BookOpen size={40} className="text-[#C6A75E]" />
            </div>

            <h2 className="text-2xl font-semibold text-slate-900">
              Articles Coming Soon
            </h2>

            <p className="mt-4 text-slate-600 max-w-md">
              We are preparing spiritual resources, theological articles,
              and official documents for download. Please check back soon.
            </p>

            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] rounded-full"></div>
          </motion.div>
        ) : (
          /* Article Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 }}
                onClick={() => setSelectedArticle(article)}
                className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-[28px] shadow-lg p-6 hover:shadow-2xl hover:border-[#C6A75E]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Article Featured image preview */}
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-6 border border-slate-100 flex items-center justify-center">
                    {article.featuredImage ? (
                      <img src={getFileUrl(article.featuredImage)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <BookOpen size={28} className="text-slate-300" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#C6A75E]/15 border border-[#C6A75E]/30 text-[10px] font-bold text-[#C6A75E] uppercase tracking-wider">
                      {article.category || "General"}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#DB2D0B] transition duration-300 leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Snippet extract */}
                    <div
                      className="text-slate-600 text-sm leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: article.content.replace(/<[^>]*>/g, "") }}
                    />
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <User size={13} className="text-[#C6A75E]" />
                    {article.authorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(article.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FULL ARTICLE READER OVERLAY */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-10 max-w-3xl w-full relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
              >
                <X size={18} />
              </button>

              {/* Reader Cover Photo */}
              {selectedArticle.featuredImage && (
                <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 mb-8 border border-slate-200">
                  <img src={getFileUrl(selectedArticle.featuredImage)} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Reader metadata */}
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-md bg-[#C6A75E]/10 border border-[#C6A75E]/20 text-xs font-bold text-[#C6A75E] uppercase tracking-wider">
                  {selectedArticle.category || "General"}
                </span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-b border-slate-100 pb-6">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <User size={15} className="text-[#C6A75E]" />
                    {selectedArticle.authorName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    {new Date(selectedArticle.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Reader rich-text body */}
              <div
                className="prose prose-slate max-w-none mt-8 text-slate-700 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Articles;