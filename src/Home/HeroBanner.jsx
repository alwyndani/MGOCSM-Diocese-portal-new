import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import banner1 from "../assets/image1.jpg";
import banner2 from "../assets/banner2.jpg";
import logo from "../assets/LOGO.png";
import { Link } from "react-router-dom";


const slides = [
  {
    id: 1,
    titleTop: "Mar Gregorios",
    titleBottom: "Orthodox Christian Student Movement",
    subtitle: "Worship · Study · Service",
    image: banner1,
  },
  {
    id: 2,
    titleTop: "MGOCSM",
    titleBottom: "Diocese of Thumpamon",
    subtitle: "Faith in Action · Leadership · Fellowship",
    image: banner2,
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );

  return (
    <section
      id="home"
className="relative min-h-[100svh] w-full overflow-hidden pt-24 md:pt-28"    >
      {/* Background Carousel */}
      <AnimatePresence mode="wait">
        <motion.img
          key={slides[current].id}
          src={slides[current].image}
          alt="Hero"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full h-full 
           object-cover 
           object-center 
           sm:object-center 
           md:object-cover"
        />
      </AnimatePresence>

{/* Lighter Overlay */}
<div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/40" />

{/* Floating Logo */}
{/* Center Blended Logo */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.35 }}
  transition={{ duration: 1.5 }}
  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
>
  <img
    src={logo}
    alt="MGOCSM Logo"
    className="w-[140px] sm:w-[200px] md:w-[350px] lg:w-[500px] 
               object-contain 
               mix-blend-overlay 
               brightness-110 
               contrast-125"
  />
</motion.div>



      {/* Main Content */}
     <div className="relative z-10 
                min-h-[calc(100svh-6rem)] 
                md:min-h-[calc(100svh-7rem)]
                flex flex-col justify-center 
                px-5 sm:px-8 md:px-16 lg:px-20 
                text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id + "text"}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 1 }}
            className="max-w-5xl"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light tracking-wide">
              {slides[current].titleTop}
            </h2>

            <h1 className="mt-2 
           text-3xl sm:text-4xl md:text-6xl lg:text-8xl 
           font-bold leading-tight 
           bg-gradient-to-r from-white via-[#d4af37] to-white 
           bg-clip-text text-transparent">
              {slides[current].titleBottom}
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-300">
              {slides[current].subtitle}
            </p>

            {/* CTA Buttons */}
<div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">     
<Link to="/about">
  <motion.div
    whileHover={{ scale: 1.07 }}
    whileTap={{ scale: 0.95 }}
    className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#DB2D0B] text-white font-semibold shadow-2xl text-center cursor-pointer"
  >
    Explore
  </motion.div>
</Link>
            
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 w-full flex justify-between items-center px-6 md:px-12 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition"
        >
          ›
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 transition-all duration-500 rounded-full ${
              current === index
                ? "w-10 bg-[#DB2D0B]"
                : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
