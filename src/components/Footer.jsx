import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden text-[#F5F1E6] pt-24 pb-12 px-6 bg-gradient-to-br from-[#060B1A] via-[#10243E] to-[#0B1A2F]">

      {/* ===== Premium Glow Background ===== */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#D4AF37]/10 blur-[200px] rounded-full"></div>
      </div>

      {/* ===== Subtle Texture Pattern ===== */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "60px 60px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-14">

        {/* ===== Brand Section ===== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-serif tracking-wide">
            MGOCSM
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent"></div>

          <p className="text-sm leading-relaxed opacity-80">
            A vibrant student movement committed to nurturing faith,
            intellectual growth, and compassionate service.
          </p>

          <p className="text-[#D4AF37] font-medium tracking-widest text-sm">
            WORSHIP · STUDY · SERVICE
          </p>
        </div>

        {/* ===== Quick Links ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-[#D4AF37] tracking-wide">
            Explore
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
              { name: "Vision & Mission", path: "/vision" },
              { name: "Gallery", path: "/gallery" },
              { name: "Articles", path: "/articles" },
              { name: "Contact", path: "/contact" },
            ].map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="relative hover:text-[#D4AF37] transition duration-300 before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[1px] before:bg-[#D4AF37] hover:before:w-full before:transition-all before:duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Contact Info ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-[#D4AF37] tracking-wide">
            Contact
          </h3>
          <ul className="space-y-3 text-sm opacity-80 leading-relaxed">
            <li>mgocsmdioceseofthumpamon@gmail.com</li>
            <li>+91 82817 49446</li>
            <li>Diocese of Thumpamon</li>
          </ul>
        </div>

        {/* ===== Prayer & Fellowship Section (Replaced Newsletter) ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-[#D4AF37] tracking-wide">
            Prayer & Fellowship
          </h3>

          <p className="text-sm opacity-80 mb-6 leading-relaxed">
            Join us in prayer and spiritual growth.  
            Submit your prayer requests or participate in upcoming gatherings.
          </p>

          <Link
            to="/request"
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F0D87A] text-[#0B1A2F] font-medium text-sm shadow-lg hover:scale-105 transition duration-300"
          >
            Submit Prayer Request
          </Link>
        </div>

      </div>

      {/* ===== Elegant Divider ===== */}
      <div className="mt-20 border-t border-white/10 pt-8 text-center text-sm opacity-60 tracking-wide">
        © {new Date().getFullYear()} MGOCSM Diocese of Thumpamon.  
        All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;