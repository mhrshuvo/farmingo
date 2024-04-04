"use client";

// NavbarWithSearch.js
import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import Container from "@/app/container";
import LocationModal from "../modals/location-modal";
import { Button, Badge } from "@nextui-org/react";
import { CiShoppingCart } from "react-icons/ci";
import LoginModal from "../modals/login-modal"; // Import LoginModal component

export default function NavbarWithSearch() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const savedZone = localStorage.getItem("selectedZone");
    if (!savedZone) {
      setIsFirstVisit(true);
      setIsLocationModalOpen(true);
    } else {
      setSelectedZone(savedZone);
    }
  }, []);

  const handleZoneSelection = (zone) => {
    setSelectedZone(zone);
    setIsLocationModalOpen(false);
    localStorage.setItem("selectedZone", zone);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <nav className="bg-green-600">
      <Container>
        <div className="md:flex lg:flex justify-between items-center px-4 py-4">
          <div className="flex items-center md:gap-10 lg:gap-10 gap-2">
            <div className="font-bold text-white">LOGO</div>
            <div className="relative ">
              <input
                className="w-[300px] md:w-[600px] lg:w-[800px]  h-10 px-3 pr-10 rounded-md focus:outline-none"
                type="search"
                placeholder="Search your fresh vegetables..."
              />
              <FaSearch className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
            </div>
          </div>
          <div className="flex mt-5 md:mt-0 lg:mt-0 mx-14 md:mx-0 lg:mx-0 space-x-4 items-center">
            <div
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 cursor-pointer font-bold"
            >
              <FaMapMarkerAlt className="text-white cursor-pointer" />
              {selectedZone && (
                <div className="text-white mr-2">{`${selectedZone}`}</div>
              )}
            </div>

            {/* Login and cart */}
            <div className="flex items-center gap-5">
              <div>
                <Button
                  color="#FFFFFF"
                  variant="bordered"
                  className="text-white font-bold"
                  onClick={openLoginModal}
                >
                  Login
                </Button>
              </div>

              <div className="cursor-pointer">
                <Badge content="5" color="warning">
                  <CiShoppingCart className="text-white" size={30} />
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onZoneSelect={handleZoneSelection}
      />
    </nav>
  );
}
