"use client";

import React from "react";
import { MdClose } from "react-icons/md";

export default function LocationModal({ isOpen, onClose, onZoneSelect }) {
  const dhakaAreas = [
    "Uttara",
    "Gulshan",
    "Banani",
    "Dhanmondi",
    "Mirpur",
    "Mohammadpur",
    "Baridhara",
    "Baridhara DOHS",
    "Bashundhara",
    "Elephant Road",
    "Farmgate",
    "Jatrabari",
    "Khilgaon",
    "Kuril",
    "Malibagh",
    "Motijheel",
    "Puran Dhaka",
    "Ramna",
    "Shyamoli",
    "Tejgaon",
    "Tejgaon Industrial Area",
    "Uttar Khan",
    "Wari",
    "Banglamotor",
    "Hatirpool",
    "Kawran Bazar",
    "Panthapath",
    "Shahbagh",
    "Gendaria",
    "Kotwali",
    "Lalbagh",
    "New Market",
    "Sutrapur",
    "Azimpur",
    "Babubazar",
    "Chankharpool",
    "Chawkbazar",
    "Dholaikhal",
    "Gopibagh",
    "Kamrangirchar",
    "Matuail",
    "Postagola",
    "Shampur",
    "Shyampur",
    "Wari",
  ];

  const handleZoneSelection = (zone) => {
    onZoneSelect(zone);
    onClose();
  };

  return (
    <div
      className={`fixed z-10 inset-0 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"></div>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <button
            className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <MdClose size={24} />
          </button>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h2 className="text-lg font-bold mb-4">Select a Zone</h2>
            <div className="overflow-y-auto max-h-[300px]">
              {dhakaAreas.map((area, index) => (
                <button
                  key={index}
                  onClick={() => handleZoneSelection(area)}
                  className="w-full text-left py-2 px-4 mb-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-300"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
