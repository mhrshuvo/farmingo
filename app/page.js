"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-card/product-card";
import Container from "./container";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";
import CategoriesNavbar from "@/components/categories/categories";
import Loading from "./loading";
import ImageSlider from "@/components/slider/Slider";

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

  return (
    <main>
      {/* Change sticky to fixed and add z-index */}
      <div className="fixed top-16  w-full z-50 bg-white">
        <div className="md:block hidden">
          <CategoriesNavbar />
        </div>
      </div>

      {/* Adjust padding/margin for the slider so it doesn't overlap with the navbar */}
      <div className="lg:pt-10 md:pt-5 pt-2">
        <ImageSlider />
      </div>

      <Container>
        <div className="py-10 space-y-20 mx-auto">
          {categories.map((category) => (
            <section key={category.id}>
              <div className="flex justify-between items-center mx-2">
                <div>
                  <h2 className="text-3xl font-semibold mb-7">
                    {category.name}
                  </h2>
                </div>
                <div>
                  <Link
                    href={`/category/${category.id}?name=${encodeURIComponent(
                      category.name
                    )}`}
                    className="font-bold text-green-800 text-xl capitalize"
                  >
                    See More
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 xl:gap-6">
                {category.products.slice(0, 12).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
