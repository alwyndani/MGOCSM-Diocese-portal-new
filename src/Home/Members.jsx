import React from "react";
import { motion } from "framer-motion";
import leader1 from "../assets/leader1.jpeg";
import leader2 from "../assets/leader2.jpeg";
import leader3 from "../assets/leader3.jpeg";

const members = [
  {
    name: "H.G. Dr. Abraham Mar Seraphim Metropolitan of Thumpamon Diocese",
    role: "President, MGOCSM Diocese of Thumpamon& MGOCSM Global",
    image: leader1,
  },
  {
    name: "Rev. Fr. Rijosh George",
    role: "Vice-President, MGOCSM Diocese of Thumpamon",
    image: leader2,
  },
  {
    name: "Dr. Jomy Linu",
    role: "General Secretary, MGOCSM Diocese of Thumpamon",
    image: leader3  ,
  },
];

const Members = () => {
  return (
    <section className="relative py-40 px-6 bg-[#F8F4EC] overflow-hidden">

      {/* Cinematic spotlight background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25),transparent_65%)] blur-3xl"></div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-28"
      >
        <h2 className="text-5xl md:text-6xl font-serif text-[#1E1E24] tracking-wide">
          Spiritual Leadership
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] mx-auto mt-8 rounded-full"></div>
      </motion.div>

      {/* Members */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-28">

        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: index * 0.3 }}
            className="relative group perspective-[1500px]"
          >

            {/* Floating container */}
            <motion.div
              animate={{
                y: [0, -35, 0],
              }}
              transition={{
                duration: 7 + index * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex justify-center"
            >

              {/* Floating Shadow */}
              <motion.div
                animate={{ scale: [1, 0.85, 1], opacity: [0.4, 0.2, 0.4] }}
                transition={{
                  duration: 7 + index * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/30 blur-2xl rounded-full"
              ></motion.div>

              {/* 3D Tilt Card */}
              <motion.div
                whileHover={{
                  rotateX: 8,
                  rotateY: -8,
                  scale: 1.05,
                }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative w-72 h-72 rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
              >

                {/* Image */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                {/* Glow Border */}
                <div className="absolute inset-0 rounded-3xl border border-white/30"></div>

              </motion.div>
            </motion.div>

            {/* Text */}
            <div className="text-center mt-12 max-w-xs mx-auto">
              <h3 className="text-xl font-semibold text-[#1E1E24] leading-snug">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                {member.role}
              </p>
            </div>

          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Members;