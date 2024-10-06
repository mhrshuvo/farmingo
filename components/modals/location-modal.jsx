"use client";

import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { ROUTES } from "@/routes/routes";

export default function LocationModal({ isOpen, onClose, onZoneSelect }) {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ZONES}`
        );
        setZones(response.data);
      } catch (error) {
        console.error("Error fetching Zones:", error);
      }
    };

    if (isOpen) {
      fetchZones();
    }
  }, [isOpen]);

  const handleZoneSelection = (zone) => {
    if (typeof onZoneSelect === "function") {
      onZoneSelect(zone.name);
    } else {
      console.error("onZoneSelect is not a function");
    }
    onClose();
  };

  return (
    <div
      className={`fixed z-10 inset-0 bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl w-full max-w-md relative">
          <button
            className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <MdClose size={24} />
          </button>
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h2 className="text-lg font-bold mb-4">Select a Zone</h2>
            <div className="overflow-y-auto max-h-60">
              {zones.map((zone, index) => (
                <button
                  key={index}
                  onClick={() => handleZoneSelection(zone)}
                  className="w-full text-left py-2 px-4 mb-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-300"
                >
                  {zone.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
