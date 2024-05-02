"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-card/product-card";
import Container from "./container";
import Link from "next/link";

export default function Home() {
  const [vegetables, setVegetables] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [packedProducts, setPackedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch("api/products.json");
        const data = await response.json();

        // Set state variables for each category
        setVegetables(data.Vegetables);
        setFruits(data.Fruits);
        setPackedProducts(data.Packaged);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <Container>
        <div className="my-20 space-y-20 mx-auto  h-full">
          {/* Vegetables section */}

          <section>
            <div className="flex justify-between items-center mx-2">
              <div>
                <h2 className="text-4xl font-bold mb-4">Vegetables</h2>
              </div>
              <div>
                <Link
                  href={"/vegetables"}
                  className="font-bold text-green-800 text-xl capitalize"
                >
                  See More
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 xl:gap-6">
              {vegetables.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Fruits section */}

          <section>
            <div className="flex justify-between items-center mx-2">
              <div>
                <h2 className="text-4xl font-bold mb-4">Fruits</h2>
              </div>
              <div>
                <Link
                  href={"/fruits"}
                  className="font-bold text-green-800 text-xl capitalize"
                >
                  See More
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 xl:gap-6">
              {fruits.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Packaged Products section */}

          <section>
            <div className="flex justify-between items-center mx-2">
              <div>
                <h2 className="text-4xl font-bold mb-4">Packaged Products</h2>
              </div>
              <div>
                <Link
                  href={"/packaged-products"}
                  className="font-bold text-green-800 text-xl capitalize"
                >
                  See More
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 xl:gap-6">
              {packedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
