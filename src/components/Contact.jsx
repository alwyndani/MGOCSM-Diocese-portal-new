import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Facebook, Instagram } from "lucide-react";

const Contact = () => {
  return (
    <div className="relative overflow py-10-hidden bg-[#16181d] text-white">

      {/* ================= PREMIUM MEDIUM DARK BACKGROUND ================= */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Main Premium Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(219,45,11,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(198,167,94,0.12),_transparent_30%),linear-gradient(to_bottom,_#16181d,_#1d2026,_#252932)]"></div>

        {/* Warm Orange Glow */}
        <div className="absolute -top-40 -left-32 w-[550px] h-[550px] bg-[#DB2D0B]/16 blur-[170px] rounded-full"></div>

        {/* Gold Glow */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C6A75E]/14 blur-[170px] rounded-full"></div>

        {/* Soft Center Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-white/[0.04] blur-[140px] rounded-full"></div>

        {/* Premium Grid Texture */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      </div>

      {/* ================= HERO ================= */}
      <section className="relative z-10 pt-33 pb-20 px-6 text-center">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="uppercase tracking-[6px] text-[#C6A75E] text-sm mb-4"
        >
          MGOCSM Diocese of Thumpamon
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight bg-gradient-to-r from-white via-[#f8ddb0] to-[#fff4dc] bg-clip-text text-transparent"
        >
          Get In <span className="font-semibold">Touch</span>
        </motion.h1>

        <div className="w-24 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] mx-auto my-8 rounded-full"></div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-200 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed"
        >
          We welcome your questions, suggestions, fellowship, and spiritual
          connection. Reach out to us anytime for ministry activities,
          diocesan programs, and guidance.
        </motion.p>

      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="relative z-10 px-6 pb-20 max-w-6xl mx-auto">

        <div className="grid gap-8 md:grid-cols-2">

          {/* Office Address */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white/[0.08] backdrop-blur-2xl border border-white/10 p-8 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.30)] hover:bg-white/[0.12] hover:-translate-y-2 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-5">
              <MapPin className="text-[#C6A75E]" size={30} />
              <h3 className="text-xl font-semibold text-gray-100">
                Office Address
              </h3>
            </div>

            <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
              Basil Aramana, Pathanamthitta - 689645
            </p>

            <a
              href="https://maps.app.goo.gl/dpgnqPS434wd9H6e9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 text-[#C6A75E] hover:text-[#DB2D0B] transition font-medium"
            >
              View on Google Maps →
            </a>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white/[0.08] backdrop-blur-2xl border border-white/10 p-8 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.30)] hover:bg-white/[0.12] hover:-translate-y-2 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-5">
              <Mail className="text-[#C6A75E]" size={30} />
              <h3 className="text-xl font-semibold text-gray-100">
                Official Email
              </h3>
            </div>

            <p className="text-gray-200 text-sm sm:text-base break-words">
              mgocsmdioceseofthumpamon@gmail.com
            </p>
          </motion.div>

        </div>
      </section>

      {/* ================= LEADERSHIP CONTACTS ================= */}
      <section className="relative z-10 px-6 pb-20 max-w-6xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-light tracking-wide text-center mb-14 text-gray-100"
        >
          Leadership Contacts
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2">

          {/* Vice President */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white/[0.08] backdrop-blur-2xl border border-white/10 p-8 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.30)] hover:bg-white/[0.12] hover:-translate-y-2 transition-all duration-500"
          >
            <h3 className="text-2xl font-semibold text-[#C6A75E] mb-3">
              Vice-President
            </h3>

            <p className="text-lg font-medium mb-3 text-gray-100">
              Fr. Rijosh George
            </p>

            <a
              href="tel:+918281749446"
              className="text-gray-200 hover:text-[#DB2D0B] transition font-medium"
            >
              +91 82817 49446
            </a>
          </motion.div>

          {/* General Secretary */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white/[0.08] backdrop-blur-2xl border border-white/10 p-8 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.30)] hover:bg-white/[0.12] hover:-translate-y-2 transition-all duration-500"
          >
            <h3 className="text-2xl font-semibold text-[#C6A75E] mb-3">
              General Secretary
            </h3>

            <p className="text-lg font-medium mb-3 text-gray-100">
              Dr. Jomy Linu
            </p>

            <a
              href="tel:+918606005651"
              className="text-gray-200 hover:text-[#DB2D0B] transition font-medium"
            >
              +91 86060 05651
            </a>
          </motion.div>

        </div>
      </section>

      {/* ================= GOOGLE MAP ================= */}
      <section className="relative z-10 px-6 pb-24 max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.30)] border border-white/10"
        >
          <iframe
            src="https://www.google.com/maps?q=Basil%20Aramana%20Pathanamthitta%20689645&output=embed"
            width="100%"
            height="380"
            allowFullScreen=""
            loading="lazy"
            className="w-full"
            title="Google Map"
          ></iframe>
        </motion.div>

      </section>

      {/* ================= SOCIAL MEDIA ================= */}
      <section className="relative z-10 px-6 pb-28 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-light tracking-wide mb-12 text-gray-100"
        >
          Connect With Us
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-6">

          {/* Facebook */}
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.facebook.com/share/1DHLvEfQNy/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] text-white font-medium shadow-[0_15px_40px_rgba(219,45,11,0.30)] hover:shadow-[0_20px_50px_rgba(219,45,11,0.45)] transition-all duration-500"
          >
            <Facebook size={20} />
            Facebook
          </motion.a>

          {/* Instagram */}
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.instagram.com/mgocsm_diocese_of_thumpamon?igsh=MWlncDE5ZGYycWR3NQ%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] text-white font-medium shadow-[0_15px_40px_rgba(219,45,11,0.30)] hover:shadow-[0_20px_50px_rgba(219,45,11,0.45)] transition-all duration-500"
          >
            <Instagram size={20} />
            Instagram
          </motion.a>

        </div>

      </section>

    </div>
  );
};

export default Contact;