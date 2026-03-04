import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

const Articles = () => {

  const articles = []; // Future data will go here

  return (
    <section className="relative min-h-screen bg-[#FBF9F5] px-6 py-24 overflow-hidden">

      {/* Animated Soft Background Glow */}
      <motion.div
        animate={{ x: ["-10%", "10%", "-10%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 -z-10 opacity-30"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2),transparent_70%)] blur-3xl"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-[#1E1E24]">
          </h1>
          <div className="w-28 h-[2px] bg-[#D4AF37] mx-auto mt-6"></div>
          <p className="mt-8 max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
            Spiritual reflections, theological insights, and official publications of MGOCSM Diocese of Thumpamon will be available here for reading and download.
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
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#D4AF37]/20 mb-8">
              <Download size={40} className="text-[#C6A75E]" />
            </div>

            <h2 className="text-2xl font-semibold text-[#1E1E24]">
              Articles Coming Soon
            </h2>

            <p className="mt-4 text-gray-600 max-w-md">
              We are preparing spiritual resources, theological articles,
              and official documents for download. Please check back soon.
            </p>

            <div className="mt-8 w-24 h-[2px] bg-[#D4AF37]"></div>
          </motion.div>

        ) : (

          /* Future Article Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-3xl shadow-lg p-8 hover:shadow-2xl transition duration-500"
              >
                <h3 className="text-xl font-semibold text-[#1E1E24]">
                  {article.title}
                </h3>

                <p className="text-gray-600 mt-4">
                  {article.description}
                </p>

                <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#C6A75E] text-white rounded-full hover:scale-105 transition duration-300">
                  <Download size={18} />
                  Download
                </button>
              </motion.div>
            ))}
          </div>

        )}

      </div>
    </section>
  );
};

export default Articles;