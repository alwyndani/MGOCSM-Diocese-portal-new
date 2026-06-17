import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import mediaImage from "../assets/media.jpg";
import { getFileUrl, getApiUrl } from "../utils/media";

export const Media = () => {
  const [activeTab, setActiveTab] = useState("images");
  const { eventId } = useParams();

  const [media, setMedia] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    Promise.all([
      fetch(getApiUrl(`/api/content/gallery/${encodeURIComponent(eventId)}`)).then(res => res.json()),
      fetch(getApiUrl(`/api/content/events`)).then(res => res.json())
    ])
      .then(([mediaData, eventsList]) => {
        setMedia(Array.isArray(mediaData) ? mediaData : []);
        const matched = eventsList.find(e => e.id === eventId);
        setEventDetails(matched || { title: eventId, featuredImage: mediaImage });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading gallery media details:", err);
        setLoading(false);
      });
  }, [eventId]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl bg-[#0a0a0a] text-white">
        <p>Event Folder Not Found</p>
        <Link to="/gallery" className="mt-4 text-sm text-[#C6A75E] hover:underline">
          ← Back to Events Gallery
        </Link>
      </div>
    );
  }

  const imagesList = media.filter(m => m.type === "IMAGE");
  const videosList = media.filter(m => m.type === "VIDEO");

  return (
    <div className="relative bg-slate-50 text-slate-900 min-h-screen overflow-hidden">
      {/* Floating Gradient Blobs */}
      <div className="absolute top-40 -left-40 w-96 h-96 bg-[#C6A75E]/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-40 -right-40 w-96 h-96 bg-[#3A6EA5]/20 rounded-full blur-[120px] animate-pulse"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        {eventDetails.featuredImage ? (
          <motion.img
            src={getFileUrl(eventDetails.featuredImage)}
            alt={eventDetails.title}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] to-[#0a0a0a]" />
        )}

        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-6"
        >
          <span className="text-[#C6A75E] uppercase tracking-widest text-xs font-semibold">
            Gallery Archive
          </span>
          <h1 className="text-3xl md:text-5xl font-light tracking-wide mt-2 leading-tight">
            {eventDetails.title}
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] mx-auto my-6 rounded-full"></div>

          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            {eventDetails.description || "Capturing moments of faith, fellowship, and divine purpose."}
          </p>

          <Link to="/gallery">
            <motion.button
              whileHover={{ scale: 1.08 }}
              className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] text-white font-semibold shadow-xl relative overflow-hidden group cursor-pointer"
            >
              <span className="relative z-10">← Back to Events Gallery</span>
              <span className="absolute inset-0 bg-white/30 blur-md opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition"></span>
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ================= MEDIA TABS SECTION ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        {/* ======= TAB SELECTOR ======= */}
        <div className="flex justify-center mb-16">
          <div className="relative flex bg-white border border-slate-200 rounded-full p-2 shadow-lg">
            {/* Sliding Indicator */}
            <motion.div
              layout
              className="absolute top-2 bottom-2 w-1/2 rounded-full bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] shadow-md"
              style={{
                left: activeTab === "images" ? "4px" : "50%",
              }}
            />

            {/* Image Tab */}
            <button
              onClick={() => setActiveTab("images")}
              className={`relative z-10 px-10 py-3 rounded-full font-semibold text-xs tracking-wider uppercase transition duration-300 cursor-pointer ${
                activeTab === "images" ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Event Images
            </button>

            {/* Video Tab */}
            <button
              onClick={() => setActiveTab("videos")}
              className={`relative z-10 px-10 py-3 rounded-full font-semibold text-xs tracking-wider uppercase transition duration-300 cursor-pointer ${
                activeTab === "videos" ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Event Videos
            </button>
          </div>
        </div>

        {/* ======= CONTENT AREA ======= */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ================= IMAGES ================= */}
          {activeTab === "images" && imagesList.length > 0 && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {imagesList.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl group border border-slate-200"
                >
                  <img
                    src={getFileUrl(img.mediaUrl)}
                    alt={img.title || "Event Gallery"}
                    className="w-full h-72 object-cover transition duration-700 group-hover:scale-105"
                  />
                  {img.title && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition duration-300">
                      <p className="text-white text-xs font-semibold truncate">{img.title}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* ================= VIDEOS ================= */}
          {activeTab === "videos" && videosList.length > 0 && (
            <div className="grid gap-14 md:grid-cols-2">
              {videosList.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/5"
                >
                  {(() => {
                    const videoUrl = getFileUrl(video.mediaUrl);
                    const isExternalEmbed = videoUrl.startsWith("http") && !videoUrl.includes("cloudinary.com");
                    return isExternalEmbed ? (
                      // External link (e.g. YouTube share link format or regular embed)
                      <iframe
                        src={videoUrl.replace("watch?v=", "embed/")}
                        title={video.title || "Video Player"}
                        className="w-full h-[60vh] border-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        controls
                        className="w-full h-[60vh] object-cover"
                      >
                        <source src={videoUrl} type="video/mp4" />
                      </video>
                    );
                  })()}
                  {video.title && (
                    <div className="bg-[#090d16] p-4 border-t border-white/5">
                      <p className="text-slate-300 text-xs font-semibold">{video.title}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty States */}
          {activeTab === "images" && imagesList.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-10">
              No images available in this event folder.
            </p>
          )}

          {activeTab === "videos" && videosList.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-10">
              No videos available in this event folder.
            </p>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Media;