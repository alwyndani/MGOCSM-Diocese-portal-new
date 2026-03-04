import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import gallery from "../assets/gallery.jpeg";
import educa from "../assets/educa.jpeg";
import silentium from "../assets/silentium.jpeg";
import ponnonaPunchiri from "../assets/ponnonapunchiri.jpeg";
import oppam from "../assets/oppam.jpeg";
import praiseIA from "../assets/praiseIA.jpeg";
import swamanaya from "../assets/swamanaya.jpeg";
import examFavour from "../assets/examFavour.jpeg";
import smaranika1 from "../assets/smaranika1.jpeg";
import unitVisit from "../assets/unitVisit.jpeg";
import snehaThanalil from "../assets/snehaThanalil.jpg";

const events = [
  { id: "Silentium", title: "Silentium", date: "March 2025", image: silentium },
  { id: "Educa", title: "Educa", date: "January 2025", image: educa },
  { id: "PonnonaPunchiri", title: "പൊന്നോണ പുഞ്ചിരി", date: "December 2024", image: ponnonaPunchiri },
  { id: "Oppam", title: "ഒപ്പം", date: "November 2024", image: oppam },
  { id: "PraiseinAction", title: "Praise in Action", date: "October 2024", image: praiseIA },
  { id: "Swamanaya", title: "സമന്വയ", date: "September 2024", image: swamanaya },
  { id: "examFavour", title: "Exam Favour", date: "August 2024", image: examFavour },
  { id: "Smaranika", title: "സ്മരണിക", date: "July 2024", image: smaranika1 },
  { id: "UnitVisits", title: "Unit Visits", date: "June 2024", image: unitVisit },
    { id: "snehaThanalil", title: "സ്നേഹത്തണലിൽ ഇത്തിരി നേരം", date: "June 2024", image: snehaThanalil },

];

export const EventsPage = () => {
  const featured = events[0];
  const others = events.slice(1);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative w-full min-h-[100svh] pt-20 bg-gradient-to-b from-[#011925] via-[#405f7b] to-[#0B1F3A] overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-white space-y-6"
          >
            <p className="text-[#C6A75E] uppercase tracking-[4px] text-sm">
              Diocese Events
            </p>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light leading-tight">
              Events & <span className="font-semibold">Programs</span>
            </h1>

            <div className="w-20 h-[2px] bg-[#C6A75E]"></div>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg">
              Celebrating faith, fellowship, leadership, and service through
              dynamic diocesan initiatives.
            </p>

            <a
              href="#events"
              className="inline-block mt-6 px-8 py-3 rounded-full bg-[#C6A75E] text-[#0B1F3A] font-medium hover:bg-white transition duration-500 shadow-lg"
            >
              Explore Events
            </a>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <motion.img
                src={gallery}
                alt="Events"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 5 }}
                className="w-full h-[320px] sm:h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0B1F3A]/30 via-transparent to-[#C6A75E]/20"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURED EVENT ================= */}
      <section id="events" className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div className="overflow-hidden rounded-3xl shadow-2xl group">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-[350px] md:h-[450px] object-cover transform group-hover:scale-110 transition duration-700"
            />
          </div>

          <div>
            <p className="text-[#C6A75E] uppercase tracking-widest text-sm mb-3">
              Featured Event
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              {featured.title}
            </h2>
            <p className="text-gray-500 mb-4">{featured.date}</p>

            <Link
              to={`/media/${featured.id}`}
              className="inline-block mt-4 px-8 py-3 rounded-full bg-[#123C63] text-white hover:bg-[#C6A75E] hover:text-[#0B1F3A] transition duration-500 shadow-lg"
            >
              Explore Media →
            </Link>
          </div>
        </motion.div>

        {/* ================= OTHER EVENTS ================= */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {others.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
              </div>

              <div className="p-6">
                <p className="text-sm text-[#C6A75E] mb-2">{event.date}</p>
                <h3 className="text-lg font-semibold mb-4 group-hover:text-[#123C63] transition">
                  {event.title}
                </h3>

                <Link
                  to={`/media/${event.id}`}
                  className="text-sm font-medium text-[#123C63] hover:text-[#C6A75E] transition"
                >
                  View Media →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default EventsPage;