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
            {/* <div className="bg-[url('/images/bg.png')] bg-cover bg-center"> */}
            {children}
            {/* </div> */}
            <Toaster />
            <Footer />
          </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
