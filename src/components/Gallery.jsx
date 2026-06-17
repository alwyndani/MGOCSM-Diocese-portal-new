import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import gallery from "../assets/gallery.png";
import galleryBg from "../assets/galleryBG.jpg";
import { getFileUrl, getApiUrl } from "../utils/media";


export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl("/api/content/events"))
      .then((res) => res.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-[#DB2D0B] rounded-full animate-spin"></div>
      </div>
    );
  }

  const featured = events[0];
  const others = events.slice(1);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* ================= HERO ================= */}
      <section style={{
        backgroundImage: `
    linear-gradient(
      to right,
      rgba(97, 182, 181, 0.34),
      rgba(0, 0, 0, 0.17),
      rgba(3, 45, 42, 0.21)
    ),
    url(${galleryBg})
  `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }} className="relative w-full min-h-[100svh] pt-20 bg-[#0a0a0a] overflow-hidden flex items-center">
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

            <div className="w-20 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] rounded-full"></div>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg">
              Celebrating faith, fellowship, leadership, and service through
              dynamic diocesan initiatives.
            </p>

            <a
              href="#events"
              className="inline-block mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] text-white font-medium hover:scale-105 transition duration-500 shadow-lg"
            >
              Explore Events
            </a>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative "
          >
            <div className="relative flex justify-start md:justify-center overflow-hidden ">
              <motion.img
                src={gallery}
                alt="Events"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 5 }}
                className=" h-[280px] sm:h-[350px] md:h-[400px] object-cover"
              />
              <div className="absolute inset-0 "></div>
            </div>
          </motion.div>
        </div>
      </section>

      {events.length === 0 ? (
        <section id="events" className="py-24 px-6 max-w-7xl mx-auto text-center text-slate-500">
          No events published yet.
        </section>
      ) : (
        <>
          {/* ================= FEATURED EVENT ================= */}
          {featured && (
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
                    src={getFileUrl(featured.featuredImage) || galleryBg}
                    alt={featured.title}
                    className="w-full h-[350px] md:h-[450px] object-cover transform group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div>
                  <p className="text-[#C6A75E] uppercase tracking-widest text-sm mb-3">
                    Featured Event
                  </p>
                  <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900">
                    {featured.title}
                  </h2>
                  <p className="text-slate-500 mb-4">{formatDate(featured.eventDate)}</p>

                  <Link
                    to={`/media/${featured.id}`}
                    className="inline-block mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] text-white hover:scale-105 transition duration-500 shadow-lg"
                  >
                    Explore Media →
                  </Link>
                </div>
              </motion.div>
            </section>
          )}

          {/* ================= OTHER EVENTS ================= */}
          {others.length > 0 && (
            <section className="pb-24 px-6 max-w-7xl mx-auto">
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
                        src={getFileUrl(event.featuredImage) || galleryBg}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                      />
                    </div>

                    <div className="p-6">
                      <p className="text-sm text-[#C6A75E] mb-2">{formatDate(event.eventDate)}</p>
                      <h3 className="text-lg font-semibold mb-4 group-hover:text-[#DB2D0B] transition text-slate-900">
                        {event.title}
                      </h3>

                      <Link
                        to={`/media/${event.id}`}
                        className="text-sm font-medium text-[#DB2D0B] hover:text-[#C6A75E] transition"
                      >
                        View Media →
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

    </div>
  );
};

export default EventsPage;