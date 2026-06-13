import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PrayerRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 11. Backend & Frontend validation to prevent empty required fields
    if (!name.trim() || !message.trim()) {
      setError("Name and Prayer Request details are required fields.");
      return;
    }

    // 1. Validate that the email address entered is in a valid email format
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address (e.g. name@example.com).");
        return;
      }
    }

    setError("");
    setSubmitting(true);

    try {
      // 2. Collect all form data entered by the user
      // 8. The form submission should directly trigger the email sending process
      const response = await fetch("/api/content/prayer-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim() || null, 
          phoneNumber: phoneNumber.trim() || null, 
          message: message.trim() 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }
      
      setSubmitted(true);
    } catch (err) {
      // 10. If email sending fails, display an appropriate error message
      setError(err.message || "Server connection error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setMessage("");
    setError("");
    setSubmitted(false);
  };

  return (
    <section className="relative py-28 px-6 bg-[radial-gradient(circle_at_top,#E8DDC6_10%,#EFE6D3_50%,#F8F4EC_0%)] overflow-hidden font-sans">

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

          <div className="w-24 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] mx-auto my-6 rounded-full"></div>

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

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-700 text-sm rounded-2xl">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">

                <div>
                  <label className="text-sm text-gray-600 block mb-2 font-medium">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={submitting}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#C6A75E] focus:ring-2 focus:ring-[#E6C77D]/40 outline-none transition text-slate-800 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 block mb-2 font-medium">
                      Email Address (Optional)
                    </label>
                    <input
                      type="text"
                      disabled={submitting}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#C6A75E] focus:ring-2 focus:ring-[#E6C77D]/40 outline-none transition text-slate-800 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2 font-medium">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="text"
                      disabled={submitting}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#C6A75E] focus:ring-2 focus:ring-[#E6C77D]/40 outline-none transition text-slate-800 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2 font-medium">
                    Prayer Request Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="5"
                    required
                    disabled={submitting}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your prayer intention..."
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#C6A75E] focus:ring-2 focus:ring-[#E6C77D]/40 outline-none transition resize-none text-slate-800 disabled:opacity-50"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: submitting ? 1 : 1.03 }}
                  whileTap={{ scale: submitting ? 1 : 0.97 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] text-white font-semibold tracking-wide shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting Prayer...
                    </>
                  ) : (
                    "Send Prayer Request"
                  )}
                </motion.button>

              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-16 rounded-[40px] shadow-xl text-center border border-slate-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-5xl mb-6"
              >
                ✨🙏
              </motion.div>

              {/* 9. After successful submission, display simple success message */}
              <h3 className="text-2xl font-medium text-[#1A1A1A] mb-4">
                Your prayer request has been submitted successfully.
              </h3>

              <p className="text-gray-650 max-w-sm mx-auto text-sm leading-relaxed">
                Our church community unites with you in faith, hope, and prayer.
              </p>

              <button
                onClick={handleReset}
                className="mt-8 text-[#C6A75E] hover:underline text-sm font-semibold cursor-pointer"
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