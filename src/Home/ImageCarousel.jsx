import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";


const ImageCarousel = () => {
  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto">
        <Swiper spaceBetween={30} slidesPerView={1} autoplay>
          <SwiperSlide>
            <img src={img1} className="rounded-2xl shadow-xl" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={img2} className="rounded-2xl shadow-xl" />
          </SwiperSlide>
            <SwiperSlide>
            <img src={img3} className="rounded-2xl shadow-xl" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={img4} className="rounded-2xl shadow-xl" />
          </SwiperSlide>
    
        </Swiper>
      </div>
    </section>
  );
};

export default ImageCarousel;
