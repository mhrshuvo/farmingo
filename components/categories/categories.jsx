"use client";

import { useState, useEffect } from "react";
import Container from "@/app/container";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";

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
    <div className="bg-gray-100 p-1 md:p-6 sticky top-0 right-0 z-50">
      <Container>
        <div className="flex flex-wrap justify-between font-semibold cursor-pointer mx-1">
          {categories.map((category) => (
            <Link
              href={`/category/${category.id}`}
              key={category.id}
              className="mb-2 border border-green-500 rounded-lg p-1 sm:mb-0"
            >
              <p className="block whitespace-nowrap">{category.name}</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default CategoriesNavbar;
