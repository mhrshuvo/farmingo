"use client";

import { useState, useEffect } from "react";
import Container from "@/app/container";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Slick settings
const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToScroll: 1,
  variableWidth: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToScroll: 1,
      },
    },
  ],
};

const CategoriesNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.CATEGORIES}`
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-gray-100 p-1 sticky top-0 right-0 z-50">
      <Container>
        <Slider {...sliderSettings}>
          {categories.map((category) => (
            <div key={category.id} className="px-1">
              <Link
                href={`/category/${category.id}`}
                className="mb-2 rounded-lg p-1 sm:mb-0"
              >
                {/* Greenish border around text */}
                <p className="block whitespace-nowrap border border-green-500 rounded-lg px-2 py-1">
                  {category.name}
                </p>
              </Link>
            </div>
          ))}
        </Slider>
      </Container>
    </div>
  );
};

export default CategoriesNavbar;
