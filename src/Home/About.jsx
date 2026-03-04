import { motion } from "framer-motion";
import about1 from "../assets/about1.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 bg-[#f8fafc] px-6 overflow-hidden">

      {/* Decorative Background Blur */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#DB2D0B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative group"
        >
          {/* Decorative Frame */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#DB2D0B]/20 to-[#d4af37]/20 blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />

          <motion.img
            src={about1}
            alt="About"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-3xl shadow-2xl object-cover"
          />

          {/* Floating Badge */}
          <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg text-sm font-semibold text-[#0f172a]">
            Established with Purpose
          </div>
        </motion.div>

        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Section Label */}
        

          <h2 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 leading-tight">
            About the Organization
          </h2>

          {/* Gold Accent Line */}
          <div className="w-20 h-1 bg-[#d4af37] mt-6 mb-6 rounded-full" />

          <p className="text-gray-600 leading-relaxed text-lg">
            The Mar Gregorios Orthodox Christian Movement (MGOCSM) is the
            vibrant student wing of the Malankara Orthodox Syrian Church.
            Guided by the motto “Worship · Study · Service”, MGOCSM moulds young
            minds and hearts to live their faith authentically.
          </p>

          {/* Feature Highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <h4 className="font-semibold text-[#0f172a]">Faith</h4>
              <p className="text-sm text-gray-500">Rooted in worship</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <h4 className="font-semibold text-[#0f172a]">Leadership</h4>
              <p className="text-sm text-gray-500">Shaping young minds</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <h4 className="font-semibold text-[#0f172a]">Service</h4>
              <p className="text-sm text-gray-500">Community outreach</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <h4 className="font-semibold text-[#0f172a]">Fellowship</h4>
              <p className="text-sm text-gray-500">Spiritual growth</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
