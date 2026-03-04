import React from "react";




export const Vision = () => {


  // Feature Grid Section (Faith, Leadership, Fellowship)
const FeatureCard = ({ title, subtitle, description }) => {
  return (
    <div className="group bg-white rounded-[28px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[#C6A75E] hover:-translate-y-2">
      <h3 className="text-2xl font-serif font-semibold mb-3 text-[#1C1C1C]">
        ✨ {title}
      </h3>
      <p className="text-[#C6A75E] font-medium mb-5">{subtitle}</p>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

const FeatureGrid = () => {
  return (
    <section className="bg-[#F8F6F2] py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <FeatureCard
          title="Faith"
          subtitle="Rooted in Worship and Sacramental Life"
          description="Faith is lived and strengthened within a nurturing community through prayer, Holy Qurbana, Bible study, and spiritual reflection."
        />
        <FeatureCard
          title="Leadership"
          subtitle="Shaping Responsible and Visionary Youth"
          description="Through camps, seminars, and organizational roles, members grow into confident leaders who inspire positive change."
        />
        <FeatureCard
          title="Fellowship"
          subtitle="Building Bonds in Spiritual Unity"
          description="Through fellowship gatherings, retreats, and shared experiences, members form lifelong friendships rooted in shared faith and encouragement."
        />
      </div>
    </section>
  );
};




  return (
    <div className="bg-[#F8F6F1] text-[#0B1F3A]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-24 px-6 text-center bg-gradient-to-b from-[#0B1F3A] via-[#123C63] to-[#0B1F3A] text-white overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl mt-3.5 sm:text-4xl md:text-6xl font-light tracking-wide">
            Vision · Mission · Objectives
          </h1>
          <div className="w-24 h-[2px] bg-[#C6A75E] mx-auto my-6"></div>
          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto">
            Rooted in <span className="text-[#C6A75E]">Worship</span>, 
            enlightened through <span className="text-[#C6A75E]">Study</span>, 
            committed to <span className="text-[#C6A75E]">Service</span>.
          </p>
        </div>
      </section>

      {/* ================= VISION SECTION ================= */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-semibold mb-6">
          Our Vision
        </h2>
        <p className="text-lg md:text-xl leading-relaxed text-gray-700">
          To shape a generation of Malankara Orthodox Syrian Church rooted in 
          <span className="text-[#C6A75E] font-medium"> Worship</span>, 
          enlightened through 
          <span className="text-[#C6A75E] font-medium"> Study</span>, 
          and committed to 
          <span className="text-[#C6A75E] font-medium"> Service</span>, 
          living out their faith with spiritual depth, intellectual clarity, 
          and social responsibility.
        </p>
      </section>

      {/* ================= MISSION SECTION ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-semibold mb-12">
            Our Mission
          </h2>

          <div className="grid gap-8 md:grid-cols-3">

            {/* Worship */}
            <div className="bg-[#F8F6F1] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-500">
              <h3 className="text-xl font-semibold text-[#123C63] mb-4">
                Worship
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Nurturing a Christ-centred life among the student community through prayer, 
                sacraments, liturgical participation, and a deep personal relationship with God 
                rooted in the faith and traditions of the Malankara Orthodox Syrian Church.
              </p>
            </div>

            {/* Study */}
            <div className="bg-[#F8F6F1] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-500">
              <h3 className="text-xl font-semibold text-[#123C63] mb-4">
                Study
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Encouraging theological awareness, biblical understanding, and intellectual growth, 
                enabling students to engage with contemporary issues and bear witness to Christ 
                with wisdom and conviction.
              </p>
            </div>

            {/* Service */}
            <div className="bg-[#F8F6F1] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-500">
              <h3 className="text-xl font-semibold text-[#123C63] mb-4">
                Service
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Inspiring selfless service to the Church, society, and nation by fostering 
                compassion, justice, leadership, and active involvement in outreach and 
                community development.
              </p>
            </div>

          </div>

          <p className="mt-12 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Through worship that transforms, study that enlightens, and service that uplifts, 
            MGOCSM seeks to form faithful disciples and responsible citizens who carry 
            Orthodox Christian values into every sphere of life.
          </p>
        </div>
      </section>

      {/* ================= OBJECTIVES SECTION ================= */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#F8F6F1] to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-semibold text-center mb-16">
            Our Objectives
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            {[
              "To nurture spiritually grounded students through worship and sacramental life.",
              "To promote biblical understanding and intellectual growth rooted in Orthodox faith.",
              "To inspire selfless service and responsible leadership in Church and society.",
              "To deepen the spiritual life of students through prayer and active liturgical participation.",
              "To equip students with sound biblical and theological knowledge.",
              "To create a platform for intellectual dialogue in the light of Christian values.",
              "To cultivate servant leadership among students.",
              "To promote compassion and social responsibility through outreach programs.",
              "To strengthen unity and fellowship among Orthodox students."
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border-l-4 border-[#C6A75E] p-6 rounded-xl shadow-md hover:shadow-xl transition duration-500"
              >
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {item}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>


<FeatureGrid />

    </div>
  );
};

export default Vision;