import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PrayerRequest = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 600);
  };

  return (
    <section className="relative py-28 px-6 bg-[radial-gradient(circle_at_top,#E8DDC6_10%,#EFE6D3_50%,#F8F4EC_0%)] overflow-hidden">

      {/* Divine Radiant Halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#E6C77D]/20 blur-[160px] rounded-full"></div>

      {/* Floating Light Particles */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-10 w-4 h-4 bg-[#E6C77D]/40 rounded-full blur-sm"
      ></motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-32 right-16 w-3 h-3 bg-[#C6A75E]/40 rounded-full blur-sm"
      ></motion.div>

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-light tracking-wide text-[#1A1A1A]">
            Submit a Prayer
          </h2>

          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent mx-auto my-6"></div>

          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Share your intentions. We unite with you in faith, hope, and prayer.
          </p>
        </motion.div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7 }}
              className="relative bg-white/60 backdrop-blur-2xl border border-white/40 p-10 sm:p-14 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              {/* Soft Border Glow */}
              <div className="absolute inset-0 rounded-[40px] border border-[#E6C77D]/30 pointer-events-none"></div>

              <form onSubmit={handleSubmit} className="space-y-7">

                <div>
                  <label className="text-sm text-gray-600 block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#C6A75E] focus:ring-2 focus:ring-[#E6C77D]/40 outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#C6A75E] focus:ring-2 focus:ring-[#E6C77D]/40 outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">
                    Prayer Request
                  </label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Write your prayer intention..."
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#C6A75E] focus:ring-2 focus:ring-[#E6C77D]/40 outline-none transition resize-none"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#C6A75E] to-[#E6C77D] text-white font-medium tracking-wide shadow-lg"
                >
                  Send Prayer Request
                </motion.button>

              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-16 rounded-[40px] shadow-xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-5xl mb-6"
              >
                ✨🙏
              </motion.div>

              <h3 className="text-2xl font-medium text-[#1A1A1A] mb-4">
                Your request has been submitted
              </h3>

              <p className="text-gray-600">
                We will keep your intention in our prayers.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 text-[#C6A75E] hover:underline"
              >
                Submit another request
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PrayerRequest;