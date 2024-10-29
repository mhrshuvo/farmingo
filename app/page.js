"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-card/product-card";
import Container from "./container";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";
import CategoriesNavbar from "@/components/categories/categories";
import Loading from "./loading";
import ImageSlider from "@/components/slider/Slider";
import Footer from "@/components/footer/footer";
import Slider from "react-slick";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.CATEGORY_PRODUCTS}`
        );
        const data = await response.json();

        // Update state with categories
        setCategories(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        // Set loading to false regardless of whether the fetch was successful
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Slider settings for desktop screens
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // Adjust the number of products visible at a time on PC
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Adjust for tablet
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Adjust for smaller tablets
        },
      },
    ],
  };

  return (
    <main>
      {/* Change sticky to fixed and add z-index */}
      <div className="fixed md:top-16 w-full z-50 bg-white">
        <div>
          <CategoriesNavbar />
        </div>
      </div>

      {/* Adjust padding/margin for the slider so it doesn't overlap with the navbar */}
      <div className="lg:pt-10 md:pt-5 pt-28">
        <ImageSlider />
      </div>

      <Container>
        <div className="pb-10 space-y-10 mx-auto">
          {categories.map((category) => (
            <section key={category.id}>
              <div className="flex justify-between items-center p-2 mx-2">
                <div>
                  <h2 className="font-bold text-green-800 text-xl capitalize">
                    {category.name}
                  </h2>
                </div>
                <div>
                  <Link
                    href={`/category/${category.id}?name=${encodeURIComponent(
                      category.name
                    )}`}
                    className="text-1xl lg:text-2xl font-semibold"
                  >
                    See More
                  </Link>
                </div>
              </div>

              {/* Use a horizontal scroll for mobile devices */}
              <div className="block lg:hidden mx-4 overflow-x-auto">
                <div className="flex space-x-4">
                  {category.products.slice(0, 14).map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-44">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Use a slider for PC */}
              <div className="hidden lg:block">
                <Slider {...sliderSettings}>
                  {category.products.slice(0, 14).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Slider>
              </div>
            </section>
          ))}
        </div>
      </Container>

      <Footer />
    </main>
  );
}
