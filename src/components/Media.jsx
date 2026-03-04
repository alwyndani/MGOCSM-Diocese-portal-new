








import React from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useState } from "react";

import silentium1 from "../assets/silentium1.jpeg";
import silentium2 from "../assets/silentium2.jpeg";
import silentiumV1 from "../assets/silentiumV1.mp4";
import silentiumV2 from "../assets/silentiumV2.mp4";
import silentiumV3 from "../assets/silentiumV3.mp4";
import silentiumV4 from "../assets/silentiumV4.mp4";



import mediaImage from "../assets/media.jpg";
import educaa2 from "../assets/educa-1.jpeg";
import educa2 from "../assets/educa.jpeg";
import educa5 from "../assets/educa2.jpeg";
import educa6 from "../assets/educa3.jpeg";
import educa8 from "../assets/educa4.jpeg";
import educa1 from "../assets/educa5.jpeg";
import educa3 from "../assets/educa6.jpeg";
import educa7 from "../assets/educa7.jpeg";
import educa4 from "../assets/educa8.jpeg";
import educa9 from "../assets/educa9.jpeg";
import educaV1 from "../assets/eduV1.mp4";

import ponnonnaV1 from "../assets/ponnonaV1.mp4";
import ponnonna1 from "../assets/ponnonapunchiri1.jpeg";

import praise1 from "../assets/praise1.jpeg";
import praise2 from "../assets/praise2.jpeg";
import praise3 from "../assets/praise3.jpeg";
import praise4 from "../assets/praise4.jpeg";
import praise5 from "../assets/praise5.jpeg";
import praise6 from "../assets/praise6.jpeg";
import praise7 from "../assets/praise7.jpeg";
import praise8 from "../assets/praise8.jpeg";
import praise9 from "../assets/praise9.jpeg";
import praise10 from "../assets/praise10.jpeg";
import praise11 from "../assets/praise11.jpeg";
import praise12 from "../assets/praise12.jpeg";
import praise13 from "../assets/praise13.jpeg";
import praise14 from "../assets/praise14.jpeg";
import praise15 from "../assets/praise15.jpeg";
import praise16 from "../assets/praise16.jpeg";
import praise17 from "../assets/praise17.jpeg";



import praiseV1 from "../assets/praiseV1.mp4";
import praiseV2 from "../assets/praiseV2.mp4";
import praiseV3 from "../assets/praiseV3.mp4";

import swamanaya7 from "../assets/swamanaya2.jpeg";
import swamanaya3 from "../assets/swamanaya3.jpeg";
import swamanaya4 from "../assets/swamanaya4.jpeg";
import swamanaya5 from "../assets/swamanaya5.jpeg";
import swamanaya10 from "../assets/swamanaya6.jpeg";
import swamanaya2 from "../assets/swamanaya7.jpeg";
import swamanaya8 from "../assets/swamanaya8.jpeg";
import swamanaya9 from "../assets/swamanaya9.jpeg";
import swamanaya11 from "../assets/swamanaya11.jpeg";
import swamanaya6 from "../assets/swamanaya10.jpeg";
import swamanayaV1 from "../assets/swamanayaV1.mp4";

import oppam1 from "../assets/oppam1.jpeg";
import oppamV1 from "../assets/oppamV1.mp4";
import oppam2 from "../assets/oppam2.jpeg"; 
import oppam3 from "../assets/oppam3.jpeg";
import oppam4 from "../assets/oppam4.jpeg";


import smaranika1 from "../assets/smaranika1.jpeg";
import smaranika2 from "../assets/smaranika2.jpeg";
import smaranika3 from "../assets/smaranika3.jpeg";
import smaranika4 from "../assets/smaranika4.jpeg";

import examFavour1 from "../assets/examFavour1.jpeg";
import examFavour2 from "../assets/examFavour2.jpeg";
import examFavour3 from "../assets/examFavour3.jpeg";
import examFavour4 from "../assets/examFavour4.jpeg";

import unitV1 from "../assets/UnitV1.jpeg";
import unitV2 from "../assets/UnitV2.jpeg";
import unitV3 from "../assets/UnitV3.jpeg";
import unitV4 from "../assets/UnitV4.jpeg";
import unitV5 from "../assets/UnitV5.jpeg";
import unitV6 from "../assets/UnitV6.jpeg";
import unitV7 from "../assets/UnitV7.jpeg";
import unitV8 from "../assets/UnitV8.jpeg";
import unitV9 from "../assets/UnitV9.jpeg";
import unitV10 from "../assets/UnitV10.jpeg";
import unitV11 from "../assets/UnitV11.jpeg";
import unitV12 from "../assets/UnitV12.jpeg";
import unitV13 from "../assets/UnitV13.jpeg";
import unitV14 from "../assets/UnitV14.jpeg";
import unitV15 from "../assets/UnitV15.jpeg";
import unitV16 from "../assets/UnitV16.jpeg";
import unitV17 from "../assets/UnitV17.jpeg";
import unitV18 from "../assets/UnitV18.jpeg";

import unitVedio1 from "../assets/UnitV1.mp4";
import unitVedio2 from "../assets/UnitV2.mp4";
import unitVedio3 from "../assets/UnitV3.mp4";


import snehaThanalilV1 from "../assets/snehaThanalilV1.mp4";
import snehaThanalilV2 from "../assets/snehaThanalilV2.mp4";
import { p } from "framer-motion/client";




/* ===========================
   EVENT MEDIA DATA
   =========================== */

const mediaData = {
  Silentium: {
    title: "Silentium",
    hero: mediaImage,
    images: [
     silentium1,
     silentium2,
    ],
    videos: [
      silentiumV3,
      silentiumV1,
      silentiumV2,
      silentiumV4,
    ],
  },

  Educa: {
    title: "Educa",
    hero: mediaImage,
    images: [
      educa1,
      educa2,
      educaa2,
        educa3,
        educa4,
        educa5,
        educa6,
        educa7,
        educa8,
        educa9,
  
    ],
    videos: [educaV1
    ],
  },


  PonnonaPunchiri: {
    title: "പൊന്നോണ പുഞ്ചിരി",
    hero: mediaImage,
    images: [
     ponnonna1
    ],
    videos: [ponnonnaV1],
  },

    PraiseinAction: {
    title: "Praise in Action",
    hero: mediaImage,
    images: [
      praise1,
      praise2,
      praise3,
     praise4,
      praise5,
      praise6,
      praise7,
      praise8,
      praise9,
      praise10,
      praise11,
      praise12,
      praise13, 
      praise14,
      praise15,
      praise16,
      praise17,
      
    ],
    videos: [praiseV1,praiseV2],
  },

      Swamanaya: {
    title: "സമന്വയ",
    hero: mediaImage,
    images: [
  swamanaya2,
  swamanaya3,
  swamanaya4,
  swamanaya5,
  swamanaya6,
  swamanaya7,
  swamanaya8,
  swamanaya9,
  swamanaya10,
    ],
    videos: [swamanayaV1],
  },

  
      examFavour: {
    title: "Exam Favour",
    hero: mediaImage,
    images: [
examFavour1,
examFavour2,
examFavour3,
    ],
    videos: [],
  },

    Oppam: {
    title: "Oppam",
    hero: mediaImage,
    images: [
      oppam1,
 oppam2,
 oppam3,
 oppam4,
    ],
    videos: [
      oppamV1,
    ],
  },

  Smaranika: {
    title: "Smaranika",
    hero: mediaImage,
    images: [
    smaranika1,
    smaranika2,
    smaranika3,
    smaranika4,
    ],
    videos: [
      "/videos/silentium/1.mp4",
      "/videos/silentium/2.mp4",
    ],
  },

    UnitVisits: {
    title: "Unit Visits",
    hero: mediaImage,
    images: [
    unitV1,
    unitV2,
    unitV3,
    unitV4,
    unitV5,
    unitV6,
    unitV7,
    unitV8,
    unitV9,
    unitV10,
    unitV11,
    unitV12,
    unitV13,
    unitV14,
    unitV15,
    unitV16,
    unitV17,
    unitV18,
    ],
    videos: [
      unitVedio1,
      unitVedio2,
      unitVedio3
    ],
  },
 
    snehaThanalil: {
    title: "സ്നേഹത്തണലിൽ ഇത്തിരി നേരം",
    hero: mediaImage,
    images: [
  
    ],
    videos: [
      snehaThanalilV1,
      snehaThanalilV2,
     
    ],
  },

};

export const Media = () => {

  const [activeTab, setActiveTab] = useState("images");

  const { eventId } = useParams();

  const event = mediaData[eventId];

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Event Not Found
      </div>
    );
  }

 return (
  <div className="relative text-[#0B1F3A] overflow-hidden">

    {/* Floating Gradient Blobs */}
    <div className="absolute top-40 -left-40 w-96 h-96 bg-[#C6A75E]/20 rounded-full blur-[120px] animate-pulse"></div>
    <div className="absolute bottom-40 -right-40 w-96 h-96 bg-[#3A6EA5]/20 rounded-full blur-[120px] animate-pulse"></div>

    {/* ================= HERO SECTION ================= */}
    <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">

      <motion.img
        src={event.hero}
        alt={event.title}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8 }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center text-white px-6"
      >
        <h1 className="text-4xl md:text-6xl font-light tracking-widest">
          {event.title}
        </h1>

        <div className="w-24 h-[2px] bg-[#C6A75E] mx-auto my-6"></div>

        <p className="text-gray-300 max-w-xl mx-auto">
          Capturing moments of faith, fellowship, and divine purpose.
        </p>

        {/* 🔥 PREMIUM BACK BUTTON */}
        <Link to="/gallery">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-[#C6A75E] to-[#E6C77D] text-[#0B1F3A] font-semibold shadow-xl relative overflow-hidden group"
          >
            <span className="relative z-10">← Back to Gallery</span>

            {/* Shine animation */}
            <span className="absolute inset-0 bg-white/30 blur-md opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition"></span>
          </motion.button>
        </Link>
      </motion.div>
    </section>



{/* ================= MEDIA TABS SECTION ================= */}
<section className="py-28 px-6 max-w-7xl mx-auto relative">

  {/* ======= TAB SELECTOR ======= */}
  <div className="flex justify-center mb-16">

    <div className="relative flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-xl">

      {/* Sliding Indicator */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`absolute top-2 bottom-2 w-1/2 rounded-full bg-gradient-to-r from-[#C6A75E] to-[#E6C77D] shadow-lg`}
        style={{
          left: activeTab === "images" ? "4px" : "50%",
        }}
      />

      {/* Image Tab */}
      <button
        onClick={() => setActiveTab("images")}
        className={`relative z-10 px-10 py-3 rounded-full font-medium transition duration-300 ${
          activeTab === "images"
            ? "text-[#0B1F3A]"
            : "text-[#0B1F3A]"
        }`}
      >
        Event Images
      </button>

      {/* Video Tab */}
      <button
        onClick={() => setActiveTab("videos")}
        className={`relative z-10 px-10 py-3 rounded-full font-medium transition duration-300 ${
          activeTab === "videos"
            ? "text-[#0B1F3A]"
            : "text-[0B1F3A]"
        }`}
      >
        Event Videos
      </button>

    </div>
  </div>

  {/* ======= CONTENT AREA ======= */}
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >

    {/* ================= IMAGES ================= */}
    {activeTab === "images" && event.images.length > 0 && (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">

        {event.images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            whileHover={{ y: -10 }}
            className="relative overflow-hidden rounded-3xl shadow-2xl group"
          >
            <img
              src={img}
              alt="Event"
              className="w-full h-72 object-cover transition duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
          </motion.div>
        ))}

      </div>
    )}

    {/* ================= VIDEOS ================= */}
    {activeTab === "videos" && event.videos.length > 0 && (
      <div className="grid gap-14 md:grid-cols-2">

        {event.videos.map((video, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            whileHover={{ scale: 1.03 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-black"
          >
            <video
              controls
              className="w-full h-[60vh] object-cover"
            >
              <source src={video} type="video/mp4" />
            </video>
          </motion.div>
        ))}

      </div>
    )}

    {/* Empty State */}
    {activeTab === "images" && event.images.length === 0 && (
      <p className="text-center text-gray-400 text-lg">
        No images available for this event.
      </p>
    )}

    {activeTab === "videos" && event.videos.length === 0 && (
      <p className="text-center text-gray-400 text-lg">
        No videos available for this event.
      </p>
    )}

  </motion.div>
</section>

  </div>
);
};

export default Media;