import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFileUrl, getApiUrl } from "../utils/media";

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
      <div className="aspect-square overflow-hidden bg-slate-100 flex items-center justify-center">
        {member.imageUrl ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={getFileUrl(member.imageUrl)}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl text-slate-300">👤</span>
        )}
      </div>

      <div className="p-4 sm:p-6 text-center">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
          {member.designation}
        </p>
      </div>
    </div>
  </motion.div>
);

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl("/api/content/team-members"))
      .then((res) => res.json())
      .then((data) => {
        setMembers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading team members:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="relative py-32 px-6 bg-slate-50 text-center flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#DB2D0B] rounded-full animate-spin"></div>
      </section>
    );
  }

  const mainLeaders = members.filter((m) => m.category === "CORE_LEADER");
  const districtPresidents = members.filter((m) => m.category === "DISTRICT_PRESIDENT");
  const districtSecretaries = members.filter((m) => m.category === "DISTRICT_SECRETARY");

  return (
    <section className="relative py-32 px-6 bg-slate-50 overflow-hidden">

      {/* Soft Golden Light */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(198,167,94,0.18),transparent_65%)] blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-serif text-slate-900">
            MGOCSM Leadership
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-slate-600 leading-relaxed">
            The Thumpamon Diocese presently comprises seven districts under the spiritual leadership of the Malankara Orthodox Syrian Church, coordinating and guiding the activities of MGOCSM units within its jurisdiction.
          </p>
          <div className="w-28 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] mx-auto mt-8 rounded-full"></div>
        </motion.div>

        {/* Main Leaders */}
        {mainLeaders.length > 0 && (
          <div className="mb-28">
            <h3 className="text-3xl font-semibold text-center mb-14 text-slate-900">
              Core Leadership
            </h3>
            <div className="grid md:grid-cols-3 gap-12">
              {mainLeaders.map((m, i) => <Card key={m.id} member={m} index={i} />)}
            </div>
          </div>
        )}

        {/* District Presidents */}
        {districtPresidents.length > 0 && (
          <div className="mb-28">
            <h3 className="text-3xl font-semibold text-center mb-14 text-slate-900">
              District Presidents
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {districtPresidents.map((m, i) => <Card key={m.id} member={m} index={i} />)}
            </div>
          </div>
        )}

        {/* District Secretaries */}
        {districtSecretaries.length > 0 && (
          <div>
            <h3 className="text-3xl font-semibold text-center mb-14 text-slate-900">
              District Secretaries
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {districtSecretaries.map((m, i) => <Card key={m.id} member={m} index={i} />)}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default TeamMembers;