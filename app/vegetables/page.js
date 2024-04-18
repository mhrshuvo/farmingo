"use client";

import { useEffect, useState } from "react";
import Container from "../container";
import ProductCard from "@/components/product-card/product-card";

export default function VegetablesPage() {
  const [vegetables, setVegetables] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("api/products.json");
        const data = await response.json();
        setVegetables(data.Vegetables);
      } catch (error) {
        console.error("Error fetching vegetables:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <Container>
        <div className="my-20 mx-auto space-y-10">
          <section>
            <div className="flex justify-between items-center mx-2">
              <div>
                <h2 className="text-2xl font-bold mb-4">Vegetables</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 xl:gap-6">
              {vegetables.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
