import React from "react";
import worship from "../assets/worship.jpg";
import study from "../assets/study.jpg";
import service from "../assets/service.jpg";
import aboutBG from "../assets/aboutBG.jpg";
import TeamMembers from "./TeamMembers";
import { Link } from "react-router-dom";
// Hero Section
const AboutHero = () => {
  return (
    <section style={{
      backgroundImage: `
        linear-gradient(
          to right,
          rgba(118, 121, 120, 0.75),
          rgba(0, 0, 0, 0.45),
          rgba(24, 52, 61, 0.65)
        ),
        url(${aboutBG})
      `, backgroundSize: "cover", backgroundPosition: "center"
    }}
      className="relative h-[100dvh] flex items-center justify-center text-white px-6 text-center">

      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-6xl font-serif font-semibold tracking-wide">
          About MGOCSM
        </h1>

        <div className="w-20 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] mx-auto rounded-full"></div>

        <p className="text-xl md:text-2xl text-[#C6A75E] font-medium tracking-wide">
          Worship · Study · Service
        </p>

        <p className="text-lg md:text-xl opacity-80 leading-relaxed">
          A movement dedicated to nurturing faith, shaping character,
          and inspiring purposeful service among students.
        </p>
      </div>
    </section>
  );
};

// Intro Section
const AboutIntro = () => {
  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
          The Mar Gregorios Orthodox Christian Student Movement (MGOCSM) is the
          dynamic student ministry of the Malankara Orthodox Syrian Church,
          dedicated to nurturing young believers in faith, character, and
          service.
        </p>

        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
          Inspired by its guiding motto,
          <span className="text-[#C6A75E] font-semibold"> Worship · Study · Service, </span>
          the movement seeks to cultivate spiritually grounded, socially
          responsible, and intellectually enriched students.
        </p>

        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
          Through prayer gatherings, faith formation programs, leadership
          initiatives, and outreach missions, MGOCSM empowers young minds
          to live their faith authentically while contributing meaningfully
          to society.
        </p>

      </div>
    </section>

  );
};

// Worship · Study · Service Section
const WorshipStudyServiceSection = () => {
  const services = [
    {
      title: "Worship",
      description:
        "Nurturing Christ-centered life through prayer, Holy Qurbana, Bible study, and spiritual reflection. Faith is lived, experienced, and strengthened.",
      img: worship
    },
    {
      title: "Study",
      description:
        "Encouraging theological awareness, intellectual growth, and biblical understanding to engage contemporary challenges with wisdom.",
      img: study
    },
    {
      title: "Service",
      description:
        "Empowering students to serve Church and society through outreach, charity programs, and community initiatives embodying compassion and justice.",
      img: service
    },
  ];

  return (
    <section className="bg-slate-50 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">

        <p className="text-slate-600 max-w-2xl mx-auto">
          Our guiding motto is the heart of MGOCSM. Each pillar shapes the lives of students in faith, knowledge, and action.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((item, idx) => (
          <div
            key={idx}
            style={{ backgroundImage: `url(${item.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
            className="bg-white rounded-[28px] p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[#C6A75E] hover:-translate-y-2 font-bold"
          >
            <h3 className="text-2xl font-serif font-bold mb-3 text-[#ffffff]">
              ✨ {item.title}
            </h3>
            <p className="text-white  leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};





// Closing Statement
const ClosingStatement = () => {
  return (
    <section className="bg-[#0a0a0a] text-white py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold">
          Worship in Faith. Study in Truth. Serve in Love.
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] mx-auto rounded-full"></div>
        <p className="text-lg opacity-80 leading-relaxed">
          MGOCSM continues to shape a generation rooted in Christ, committed
          to excellence, and driven by compassionate service.
        </p>
      </div>

    </section>
  );
};

// Call to Action

const CallToAction = () => {
  return (
    <section className="bg-slate-50 py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <h3 className="text-3xl font-serif font-semibold text-slate-900">
          Join the Journey of Worship · Study · Service
        </h3>

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] text-white rounded-full font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Connect With Us
        </Link>

      </div>
    </section>
  );
};

// Main AboutPage
const About = () => {
  return (
    <div className="overflow-hidden">
      <AboutHero />
      <AboutIntro />
      <WorshipStudyServiceSection />
      <TeamMembers />
      <ClosingStatement />
      <CallToAction />
    </div>
  );
};

export default About;