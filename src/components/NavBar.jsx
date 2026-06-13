import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/LOGO.png"; // Ensure this path is correct
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "#home", link: "/" },
  { name: "About", href: "#about", link: "/about" },
  { name: "Vision & Mission", href: "#Vision", link: "/vision" },
  { name: "Gallery", href: "#gallery", link: "/gallery" },
  { name: "Articles", href: "#articles", link: "/articles" },
  { name: "Contact", href: "#contact", link: "/contact" },
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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed w-full z-50 px-4 md:px-8 top-4">
        <div
          className={`mx-auto max-w-7xl transition-all duration-500 rounded-2xl
          ${scrolled
              ? "bg-white/70 backdrop-blur-2xl shadow-2xl border border-white/30"
              : "bg-white/30 backdrop-blur-xl"
            }`}
        >
          <div className="flex items-center justify-between px-4 py-2 md:px-8">
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
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {navLinks.map((link) => {
                const isActive = active === link.name;
                return (
                  <Link
                    to={link.link}
                    key={link.name}
                    onClick={() => setActive(link.name)}
                    className="relative px-4 lg:px-5 py-2 text-sm font-medium rounded-full transition-all duration-300"
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
                      className={`relative z-10 ${isActive
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
              className="md:hidden flex flex-col justify-between w-6 h-5 cursor-pointer z-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span
                className={`h-0.5 w-full bg-black transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2.5" : ""
                  }`}
              />
              <span
                className={`h-0.5 w-full bg-black transition-all duration-300 ${isOpen ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`h-0.5 w-full bg-black transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Premium Sidebar Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="fixed top-0 right-0 h-screen w-[80vw] max-w-[320px] 
              bg-white/90 backdrop-blur-3xl 
              shadow-2xl 
              z-50 
              px-6 py-8
              flex flex-col overflow-y-auto"
            >
              {/* Close Button Header */}
              <div className="flex justify-end mb-8">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200/50 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Animated Background Blobs (inside sidebar) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div
                  animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute -top-10 -right-10 w-40 h-40 bg-[#DB2D0B]/10 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute bottom-10 -left-10 w-56 h-56 bg-[#0f172a]/10 rounded-full blur-3xl"
                />
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-3 w-full flex-grow">
                {navLinks.map((link, index) => {
                  const isActive = active === link.name;

                  return (
                    <Link to={link.link} key={link.name} className="w-full">
                      <motion.button
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.08,
                          type: "spring",
                          stiffness: 120,
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActive(link.name);
                          setIsOpen(false);
                        }}
                        className={`relative w-full text-left px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-300
                        ${isActive
                            ? "text-white"
                            : "text-gray-800 hover:text-[#DB2D0B] bg-gray-50/50"
                          }`}
                      >
                        {/* Active Background */}
                        {isActive && (
                          <motion.span
                            layoutId="mobileActive"
                            className="absolute inset-0 bg-gradient-to-r from-[#0f172a] to-[#DB2D0B] rounded-xl -z-10 shadow-md"
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

    
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;