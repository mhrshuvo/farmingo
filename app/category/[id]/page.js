"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-card/product-card";
import Container from "@/app/container";
import { ROUTES } from "@/routes/routes";
import CategoriesNavbar from "@/components/categories/categories";

function CategoryPage({ params }) {
  const { id } = params;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.CATEGORY_PRODUCTS}/${id}`
        );
        const data = await response.json();

        // Update state with products
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <div className="sticky top-16">
        <div className="md:block hidden">
          <CategoriesNavbar></CategoriesNavbar>
        </div>
      </div>
      <Container>
        <div className="my-20 space-y-20 mx-auto h-screen">
          <section>
            <div className="flex justify-between items-center mx-2">
              <h2 className="text-3xl font-semibold mb-4">Products</h2>
            </div>
            <div className="grid grid-cols-2  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 xl:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}

export default CategoryPage;
