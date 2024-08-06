"use client";

import { useState, useEffect } from "react";
import Container from "@/app/container";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";

const CategoriesNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
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
    // Update the screen size state on mount and resize
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call the handler to set initial state
    handleResize();

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const closeMoreOptions = () => {
    setShowMoreOptions(false);
  };

  const visibleCategories = categories.slice(0, isDesktop ? 4 : 3);
  const hiddenCategories = categories.slice(isDesktop ? 4 : 3);

  return (
    <div className="bg-gray-100 py-5 px-4">
      <Container>
        <div className="flex flex-wrap justify-between font-semibold cursor-pointer mx-1">
          {visibleCategories.map((category) => (
            <Link
              href={`/category/${category.id}`}
              key={category.id}
              className="mb-2 sm:mb-0"
            >
              <p className="block whitespace-nowrap">{category.name}</p>
            </Link>
          ))}
          {hiddenCategories.length > 0 && (
            <div className="relative">
              <p className="cursor-pointer" onClick={toggleMoreOptions}>
                More
              </p>
              {showMoreOptions && (
                <ul className="absolute md:right-10 bg-white border rounded-md py-1 mt-1 shadow-md">
                  {hiddenCategories.map((category) => (
                    <li key={category.id} onClick={closeMoreOptions}>
                      <Link href={`/category/${category.id}`}>
                        <p className="block px-4 py-2 hover:bg-gray-200 whitespace-nowrap">
                          {category.name}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default CategoriesNavbar;
