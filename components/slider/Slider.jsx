"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Container from "@/app/container";
import Loading from "@/app/loading";

const mobileImages = [
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
  "/images/4.png",
];

const pcImages = [
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
  "/images/4.png",
];

const ImageSlider = () => {
  const [isPc, setIsPc] = useState(window.innerWidth >= 1024);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsPc(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const images = isPc ? pcImages : mobileImages;
    let loadedImages = 0;

    images.forEach((image) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        loadedImages += 1;
        if (loadedImages === images.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, [isPc]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
  };

  if (!imagesLoaded) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const images = isPc ? pcImages : mobileImages;

  return (
    <Container>
      <div className="relative lg:mt-16 mt-2 w-full overflow-hidden z-10">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="flex justify-center items-center">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full max-w-full h-auto max-h-[400px] border-2 rounded-2xl border-green-500 object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>
      {/* Add margin-bottom to ensure spacing */}
      <div className="mb-10"></div>
    </Container>
  );
};

export default ImageSlider;
