"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import Container from "@/app/container";
import LocationModal from "../modals/location-modal";
import LoginModal from "../modals/login-modal";
import CartSidebar from "../sidebar/cart-sidebar";
import { Button, Badge, Input } from "@nextui-org/react";
import { useCart } from "@/contexts/cart/cart-context";
import { useAuth } from "@/contexts/auth/auth-context";
import Link from "next/link";
import { useAuthModal } from "@/contexts/auth/login-modal";
import Logo from "../logo/logo";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function NavbarWithSearch() {
  // State variables and hooks
  const { openLoginModal, isLoginModalOpen, closeLoginModal } = useAuthModal();
  const [selectedZone, setSelectedZone] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const { cart } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef(null); // Create a ref for the sidebar

  // useEffect to handle the initial state of the location modal
  useEffect(() => {
    const savedZone = localStorage.getItem("selectedZone");
    if (!savedZone) {
      setIsLocationModalOpen(true);
    } else {
      setSelectedZone(savedZone);
    }
  }, []);

  // Handlers for different actions
  const handleZoneSelection = (zone) => {
    setSelectedZone(zone);
    setIsLocationModalOpen(false);
    localStorage.setItem("selectedZone", zone);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  const toggleCartSidebar = () => {
    setIsCartSidebarOpen((prev) => !prev);
  };

  const handleZoneButtonClick = () => {
    setIsLocationModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    toast.success("User signed out");
    router.push("/");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    // Check if the click was outside the sidebar
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      toggleCartSidebar(); // Use toggleCartSidebar to close the sidebar
    }
  };

  // useEffect to handle clicks outside the menu
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-[#152721]">
      {/* Container for the navbar */}
      <Container>
        {/* Desktop Navbar */}
        <div className="hidden md:flex lg:flex justify-between items-center px-4 py-4">
          {/* Logo and search bar */}
          <div className="flex items-center md:gap-10 lg:gap-10 gap-2">
            <Link href={"/"} className="font-bold text-white">
              <Logo />
            </Link>
            <div className="relative">
              <Input
                className="w-full md:w-[300px] lg:w-[600px] xl:w-[800px] h-10 px-3 pr-10 rounded-md focus:outline-none"
                type="search"
                placeholder="Search your fresh vegetables..."
                style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
              />
              <FaSearch className="absolute md:right-14 hidden md:block top-2/4 transform -translate-y-2/4 text-gray-400" />
            </div>
          </div>
          {/* User actions */}
          <div className="flex mt-5 md:mt-0 lg:mt-0 space-x-4 items-center">
            {/* Select zone button */}
            <button
              onClick={handleZoneButtonClick}
              className="flex items-center gap-2 cursor-pointer font-bold"
            >
              <FaMapMarkerAlt className="text-white cursor-pointer" />
              {selectedZone && (
                <div className="text-white mr-2">{`${selectedZone}`}</div>
              )}
            </button>
            {/* User profile and cart */}
            <div className="flex items-center gap-5">
              {/* User profile and logout */}

              {isAuthenticated ? (
                <div className="relative inline-block text-left">
                  <button
                    className="text-white cursor-pointer"
                    onClick={handleMenuToggle}
                  >
                    <FaUserCircle className="h-6 w-6" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Orders
                        </Link>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  color="#FFFFFF"
                  variant="bordered"
                  className="text-white font-bold"
                  onClick={openLoginModal}
                >
                  Login
                </Button>
              )}

              {/* Cart button */}
              <div className="cursor-pointer" onClick={toggleCartSidebar}>
                <Badge
                  content={cart
                    .reduce((total, item) => total + item.quantity, 0)
                    .toString()}
                  color="warning"
                >
                  <CiShoppingCart className="text-white" size={30} />
                </Badge>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Navbar */}{" "}
        <div className="flex md:hidden justify-between items-center px-4 py-4">
          {" "}
          {/* Logo */}{" "}
          <Link href={"/"} className="font-bold text-white">
            {" "}
            <Logo />{" "}
          </Link>{" "}
          {/* User actions */}{" "}
          <div className="flex items-center gap-5">
            <button
              onClick={handleZoneButtonClick}
              className="flex items-center gap-2 cursor-pointer font-bold"
            >
              <FaMapMarkerAlt className="text-white cursor-pointer" />
              {selectedZone && (
                <div className="text-white mr-2">{`${selectedZone}`}</div>
              )}
            </button>
            {isAuthenticated ? (
              <div className="relative inline-block text-left">
                {" "}
                <button
                  className="text-white cursor-pointer"
                  onClick={handleMenuToggle}
                >
                  {" "}
                  <FaUserCircle className="h-6 w-6" />{" "}
                </button>{" "}
                {isMenuOpen && (
                  <div className="menu-content absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 sm:mx-auto">
                    {" "}
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {" "}
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        {" "}
                        Profile{" "}
                      </Link>{" "}
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        {" "}
                        Orders{" "}
                      </Link>{" "}
                      <button
                        className="w-full text-left px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        {" "}
                        Logout{" "}
                      </button>{" "}
                    </div>{" "}
                  </div>
                )}{" "}
              </div>
            ) : (
              <Button
                color="#FFFFFF"
                variant="bordered"
                className="text-white font-bold"
                onClick={openLoginModal}
              >
                {" "}
                Login{" "}
              </Button>
            )}{" "}
            <div className="cursor-pointer" onClick={toggleCartSidebar}>
              {" "}
              <Badge
                content={cart
                  .reduce((total, item) => total + item.quantity, 0)
                  .toString()}
                color="warning"
              >
                {" "}
                <CiShoppingCart className="text-white" size={30} />{" "}
              </Badge>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      </Container>
      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onZoneSelect={handleZoneSelection}
      />
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartSidebarOpen}
        toggle={toggleCartSidebar}
        ref={sidebarRef}
      />
    </nav>
  );
}
