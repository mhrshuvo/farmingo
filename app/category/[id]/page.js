"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card/product-card";
import Container from "@/app/container";
import { ROUTES } from "@/routes/routes";
import CategoriesNavbar from "@/components/categories/categories";
import Footer from "@/components/footer/footer";
import { useSearch } from "@/contexts/search/search-context";

function CategoryPage({ params }) {
  const { id } = params;
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const { searchTerm } = useSearch();

  useEffect(() => {
    // Accessing location only on the client side
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get("name");
    setName(categoryName);

    const fetchData = async () => {
      try {
        const apiUrl = searchTerm
          ? `https://backend.farmingo.xyz/api/v1/search?name=${searchTerm}` // Search API
          : `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.CATEGORY_PRODUCTS}/${id}`; // Category API

        // Fetch data from the appropriate API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Update state with products
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [id, searchTerm]); // Re-fetch when id or searchTerm changes

  return (
    <main>
      <div className="sticky top-16">
        <div className="md:block hidden">
          <CategoriesNavbar />
        </div>
      </div>
      <Container>
        <div>
          <section className="min-h-screen">
            <div className="py-10">
              {products.length === 0 ? (
                <p className="text-center text-lg text-gray-600">
                  No products available in this category.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 xl:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </Container>

      <div>
        <Footer />
      </div>
    </main>
  );
}

export default CategoryPage;
