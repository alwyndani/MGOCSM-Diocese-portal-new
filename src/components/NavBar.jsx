import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/LOGO.png";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "#home" , link : "/"},
  { name: "About", href: "#about", link : "/about" },
  { name: "Vision & Mission", href: "#Vision", link : "/vision" },
  { name: "Gallery", href: "#gallery", link : "/gallery" },
  { name: "Articles", href: "#articles", link : "/articles" },
  { name: "Contact", href: "#contact", link : "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed w-full z-50 px-4 md:px-8">
        <div
          className={`mx-auto max-w-7xl transition-all duration-500 rounded-2xl
          ${
            scrolled
              ? "bg-white/70 backdrop-blur-2xl shadow-2xl border border-white/30"
              : "bg-white/30 backdrop-blur-xl"
          }`}
        >
          <div className="flex items-center justify-between px-4 md:px-8 ">

            {/* LOGO */}
            <Link to="/">
            <motion.img
              src={logo}
              alt="MGOCSM Logo"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-28 sm:w-32 md:w-36 cursor-pointer"
            />
</Link>
            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-3">

              {navLinks.map((link) => {
                const isActive = active === link.name;

                return (
                  <Link to={link.link}
                    key={link.name}
                    onClick={() => setActive(link.name)}
                    className="relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300"
                  >
                  
                    {/* Animated Active Background */}
                    {isActive && (
                      <motion.span
                        layoutId="active-bg"
                        className="absolute inset-0 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <span
                      className={`relative z-10 ${
                        isActive
                          ? "text-white"
                          : "text-gray-800 hover:text-[#DB2D0B]"
                      }`}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}

           
            </div>

            {/* MOBILE HAMBURGER */}
            <div
              className="md:hidden flex flex-col justify-between w-6 h-5 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span
                className={`h-0.5 w-full bg-black transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-black transition-all duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-black transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </nav>

<AnimatePresence>
  {isOpen && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-[#DB2D0B]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f172a]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Premium Menu Panel */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="fixed bottom-0 left-0 right-0 h-[85vh] 
        bg-white/80 backdrop-blur-3xl 
        rounded-t-[2.5rem] 
        shadow-2xl 
        z-50 
        px-8 py-12
        flex flex-col items-center"
      >
        {/* Drag Indicator */}
        <div className="w-16 h-1.5 bg-gray-300 rounded-full mb-12" />

        {/* Nav Links */}
        <div className="relative flex flex-col gap-6 w-full max-w-xs">

          {navLinks.map((link, index) => {
            const isActive = active === link.name;

            return (
              <Link to={link.link} key={link.name}>
              <motion.button
                key={link.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActive(link.name);
                  setIsOpen(false);
                }}
                className={`relative px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-300
                ${
                  isActive
                    ? "text-white"
                    : "text-gray-800 hover:text-[#DB2D0B]"
                }`}
              >
                {/* Active Background */}
                {isActive && (
                  <motion.span
                    layoutId="mobileActive"
                    className="absolute inset-0 bg-gradient-to-r from-[#0f172a] to-[#DB2D0B] rounded-xl -z-10 shadow-lg"
                  />
                )}

                {/* Hover Glow */}
                <span className="absolute inset-0 rounded-xl bg-[#DB2D0B]/10 opacity-0 hover:opacity-100 transition duration-300 -z-10" />

                {link.name}
              </motion.button>
              </Link>
            );
          })}
        </div>

        {/* Join Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          className="mt-14 px-10 py-4 text-lg font-semibold 
          rounded-full 
          bg-gradient-to-r from-[#0f172a] to-[#DB2D0B] 
          text-white shadow-2xl relative overflow-hidden"
        >
          Join Us

          {/* Animated Shine */}
          <motion.span
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-0 w-1/2 h-full bg-white/30 skew-x-12 blur-md"
          />
        </motion.button>
      </motion.div>
    </>
  )}
</AnimatePresence>


    </>
  );
};

export default Navbar;
