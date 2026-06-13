import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative text-[#F5F1E6] pt-24 pb-12 px-6 bg-gradient-to-b from-[#000000] via-[#050505] to-[#1c0400]">

      {/* ===== Premium Glowing Top Line ===== */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#DB2D0B]/50 to-transparent absolute top-0 left-0"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-14">


        {/* ===== Brand Section ===== */}
        <div className="space-y-6">
          <h2 className="text-3xl text-white font-serif tracking-wide">
            MGOCSM
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] rounded-full"></div>

          <p className="text-sm leading-relaxed opacity-80">
            A vibrant student movement committed to nurturing faith,
            intellectual growth, and compassionate service.
          </p>

          <p className="bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] bg-clip-text text-transparent font-medium tracking-widest text-sm inline-block">
            WORSHIP · STUDY · SERVICE
          </p>
        </div>

        {/* ===== Quick Links ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] bg-clip-text text-transparent tracking-wide inline-block">
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
                  className="relative hover:text-[#ffb6a0] transition duration-300 before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-gradient-to-r before:from-[#DB2D0B] before:to-[#ffb6a0] hover:before:w-full before:transition-all before:duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Contact Info ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] bg-clip-text text-transparent tracking-wide inline-block">
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
          <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] bg-clip-text text-transparent tracking-wide inline-block">
            Prayer & Fellowship
          </h3>

          <p className="text-sm opacity-80 mb-6 leading-relaxed">
            Join us in prayer and spiritual growth.
            Submit your prayer requests or participate in upcoming gatherings.
          </p>

          <Link
            to="/request"
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] text-white font-medium text-sm shadow-lg hover:scale-105 transition duration-300"
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