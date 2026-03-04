import React from "react";
import { motion } from "framer-motion";
import leader1 from "../assets/leader1.jpeg";
import leader2 from "../assets/leader2.jpeg";
import leader3 from "../assets/leader3.jpeg";
import secre1 from "../assets/secre1.jpeg";
import secre2 from "../assets/secre2.jpeg";
import secre3 from "../assets/secre3.jpeg";
import secre4 from "../assets/secre4.jpeg";
import secre5 from "../assets/secre5.jpeg";
import pres1 from "../assets/pres1.jpeg";
import pres2 from "../assets/pres2.jpeg";
import pres3 from "../assets/pres3.jpeg"; 
import pres4 from "../assets/pres4.jpeg";
import pres5 from "../assets/pres5.jpeg";
import pres6 from "../assets/pres6.jpeg";
import pres7 from "../assets/pres7.jpeg";

const mainLeaders = [
  {
    name: "H.G. Dr. Abraham Mar Seraphim Metropolitan of Thumpamon Diocese",
    role: "President, MGOCSM Diocese of Thumpamon&  MGOCSM Global",
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
    image: leader3,
  },
];

const districtPresidents = [
  { name: "Rev. Fr. Jithu Thomas", role: "Vakayar District President", image: pres1 },
  { name: "Rev. Fr. Rijo Sunny Varghese", role: "Makkamkunnu District President", image: pres2 },
  { name: "Rev. Fr. Abin Mathew", role: "Thumpamon District President", image: pres3 },
  { name: "Rev. Fr. Liju P Jose", role: "Kozhencherry District President", image: pres4 },
  { name: "Rev. Fr. Alex Mathews", role: "Konni District President", image: pres5 },
  { name: "Rev. Fr. Prince CM", role: "Thannithode District President", image: pres6 },
  { name: "Fr. Ck. Thomas", role: "Omalloor District President", image: pres7 },
];

const districtSecretaries = [
  { name: "Bijo Babu", role: "Konni District Secretary", image: secre1 },
  { name: "Anto P Binu", role: "Thannithode District Secretary", image: secre2 },
  { name: "Dinu S Sunil", role: "Vakayar District Secretary", image: secre3 },
  { name: "Anju S Thudiyil", role: "Makkamkunnu District Secretary", image: secre4 },
  { name: "Gregori Shibu", role: "Thumpamon District Secretary", image: secre5 },
];

const Card = ({ member, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: index * 0.05 }}
    viewport={{ once: true }}
    className="group relative"
  >
    <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-lg border border-white/40 shadow-lg hover:shadow-2xl transition duration-500">

      {/* Image Container with Aspect Ratio */}
      <div className="aspect-square overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 sm:p-6 text-center">
        <h3 className="text-base sm:text-lg font-semibold text-[#1E1E24] leading-snug">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {member.role}
        </p>
      </div>
    </div>
  </motion.div>
);

const TeamMembers = () => {
  return (
    <section className="relative py-32 px-6 bg-[#FBF9F5] overflow-hidden">

      {/* Soft Golden Light */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),transparent_65%)] blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-serif text-[#1E1E24]">
            MGOCSM Leadership
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-gray-600 leading-relaxed">
            The Thumpamon Diocese presently comprises seven districts under the spiritual leadership of the Malankara Orthodox Syrian Church, coordinating and guiding the activities of MGOCSM units within its jurisdiction.
          </p>
          <div className="w-28 h-[2px] bg-[#D4AF37] mx-auto mt-8"></div>
        </motion.div>

        {/* Main Leaders */}
        <h3 className="text-3xl font-semibold text-center mb-14 text-[#1E1E24]">
          Core Leadership
        </h3>
        <div className="grid md:grid-cols-3 gap-12 mb-28">
          {mainLeaders.map((m, i) => <Card key={i} member={m} index={i} />)}
        </div>

        {/* District Presidents */}
        <h3 className="text-3xl font-semibold text-center mb-14 text-[#1E1E24]">
          District Presidents
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-28">
          {districtPresidents.map((m, i) => <Card key={i} member={m} index={i} />)}
        </div>

        {/* District Secretaries */}
        <h3 className="text-3xl font-semibold text-center mb-14 text-[#1E1E24]">
          District Secretaries
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {districtSecretaries.map((m, i) => <Card key={i} member={m} index={i} />)}
        </div>

      </div>
    </section>
  );
};

export default TeamMembers;