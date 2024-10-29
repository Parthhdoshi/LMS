"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";

const images = [
  //   {
  //     src: "https://images.pexels.com/photos/1141853/pexels-photo-1141853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     alt: "Bridge 1",
  //   },
  {
    src: "https://images.pexels.com/photos/220762/pexels-photo-220762.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Bridge 2",
  },
  //   {
  //     src: "https://images.pexels.com/photos/1141853/pexels-photo-1141853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     alt: "Bridge 1",
  //   },
  //   {
  //     src: "https://images.pexels.com/photos/220762/pexels-photo-220762.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     alt: "Bridge 2",
  //   },
];

const Carousel = () => {
  return (
    <div className="w-full h-screen relative">
      <Swiper
        modules={[Autoplay, Pagination]} // Enable the autoplay module
        // loop={true} // Enable infinite looping
        // autoplay={
        //   {
        //     delay: 3000,       // Set delay to 3 seconds (3000ms)
        //     disableOnInteraction: false,  // Allow autoplay even after user interaction
        //   }
        // }
        // pagination={{
        //     clickable: true,     // Enable pagination dots to be clickable
        //     dynamicBullets: true, // Optionally use dynamic bullets that change size
        //   }}
        slidesPerView={1} // Show one slide at a time
        spaceBetween={30} // Add space between slides
        centeredSlides={true} // Center the slide
        className="h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            {/* Image inside the slide */}
            <Image
              quality={100}
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
              <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1, // Controls how slow/fast the animation is (increase value for slower animation)
                ease: "easeInOut", // Can change easing style here
              }}
              >
                <div className="text-center text-white">
                  <h2 className="text-3xl md:text-6xl font-bold mb-2 font-Poppins">
                    Build your career with LMS
                  </h2>
                  <p className="text-lg md:text-2xl font-Poppins">
                    Empower your skill with us
                  </p>
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
