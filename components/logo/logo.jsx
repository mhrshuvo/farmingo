"use client";

import React from "react";
import logo from "@/public/assets/logo.png";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route path

  const handleLogoClick = () => {
    if (pathname === "/") {
      // If already on the homepage, reload the page
      window.location.reload();
    } else {
      // Otherwise, navigate to the homepage
      router.push("/");
    }
  };

  return (
    <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
      <Image src={logo} height={100} width={100} alt="Logo" />
    </div>
  );
};

export default Logo;
