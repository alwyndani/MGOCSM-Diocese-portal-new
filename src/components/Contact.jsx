import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Facebook, Instagram } from "lucide-react";

const Contact = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102B4E] to-[#0B1F3A] text-white">

      {/* ===== Floating Glow Background ===== */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C6A75E]/20 blur-[140px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-[#3A6EA5]/20 blur-[140px] rounded-full animate-pulse"></div>

      {/* ================= HERO ================= */}
      <section className="pt-28 pb-16 px-6 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-widest"
        >
          Get In Touch
        </motion.h1>

        <div className="w-20 h-[2px] bg-[#C6A75E] mx-auto my-6"></div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base"
        >
          We welcome your questions, suggestions, and fellowship. Reach out to us anytime.
        </motion.p>
      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="px-6 pb-20 relative z-10 max-w-6xl mx-auto">

        <div className="grid gap-8 md:grid-cols-2">

          {/* Office Address */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <MapPin className="text-[#C6A75E]" size={28} />
              <h3 className="text-lg font-semibold">Office Address</h3>
            </div>

            <p className="text-gray-300 text-sm sm:text-base">
              Basil Aramana, Pathanamthitta - 689645
            </p>

            <a
              href="https://maps.app.goo.gl/dpgnqPS434wd9H6e9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-[#C6A75E] hover:underline"
            >
              View on Google Maps →
            </a>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <Mail className="text-[#C6A75E]" size={28} />
              <h3 className="text-lg font-semibold">Official Email</h3>
            </div>

            <p className="text-gray-300 text-sm sm:text-base break-words">
              mgocsmdioceseofthumpamon@gmail.com
            </p>

           
          </motion.div>

        </div>
      </section>

      {/* ================= LEADERSHIP CONTACTS ================= */}
<section className="px-6 pb-20 relative z-10 max-w-6xl mx-auto">

  <motion.h2
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-2xl sm:text-3xl font-light tracking-wide text-center mb-12"
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
      className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-[#C6A75E] mb-2">
        Vice-President
      </h3>

      <p className="text-lg font-medium mb-2">
        Fr. Rijosh George
      </p>

      <a
        href="tel:+918281749446"
        className="text-gray-300 hover:text-[#C6A75E] transition"
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
      className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-[#C6A75E] mb-2">
        General Secretary
      </h3>

      <p className="text-lg font-medium mb-2">
        Dr. Jomy Linu
      </p>

      <a
        href="tel:+91860600565"
        className="text-gray-300 hover:text-[#C6A75E] transition"
      >
        +91 86060 05651
      </a>
    </motion.div>

  </div>
</section>

      {/* ================= GOOGLE MAP ================= */}
      <section className="px-6 pb-24 relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        >
          <iframe
            src="https://www.google.com/maps?q=Basil%20Aramana%20Pathanamthitta%20689645&output=embed"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
            className="w-full"
            title="Google Map"
          ></iframe>
        </motion.div>
      </section>

      {/* ================= SOCIAL MEDIA ================= */}
      <section className="px-6 pb-28 text-center relative z-10">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-light tracking-wide mb-10"
        >
          Connect With Us
        </motion.h2>

        <div className="flex justify-center gap-8">

          {/* Facebook */}
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.facebook.com/share/1DHLvEfQNy/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#C6A75E] to-[#E6C77D] text-[#0B1F3A] font-medium shadow-lg"
          >
            <Facebook size={20} />
            Facebook
          </motion.a>

          {/* Instagram */}
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.instagram.com/mgocsm_thumpamon_diocese?utm_source=qr&igsh=MTFtcGU1ZmI1NHlrMA=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg"
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