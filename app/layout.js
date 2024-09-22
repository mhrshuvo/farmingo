import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavbarWithSearch from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { CartProvider } from "@/contexts/cart/cart-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Farmingo",
  description: "Farmingo app for end to end users",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Providers>
            <div className="sticky top-0 z-10">
              <NavbarWithSearch></NavbarWithSearch>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  backgroundImage: "url('/images/bg.svg')",
                  backgroundSize: "repeat",
                  backgroundPosition: "center",
                  backdropFilter: "blur",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
            </div>

            <Toaster />
            <Footer />
          </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
