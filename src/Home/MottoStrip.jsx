import { motion } from "framer-motion";

const MottoStrip = () => {
  return (
    <section className="bg-[#0f172a] py-8 text-center">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-[#d4af37] text-2xl md:text-4xl font-semibold tracking-widest"
      >
        Worship in Faith · Study in Truth · Service in Love
      </motion.h2>
    </section>
  );
};

export default MottoStrip;
