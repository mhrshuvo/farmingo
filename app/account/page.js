"use client";

import React, { useEffect, useState } from "react";
import Container from "../container";
import { ROUTES } from "@/routes/routes";

const AccountPage = () => {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    zone: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [zones, setZones] = useState([]);

  // API endpoints (replace with your actual URLs)
  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.PROFILE}`;
  const zonesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ZONES}`;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          console.error("Missing authToken in localStorage");
          // Handle missing authToken (e.g., redirect to login)
          return;
        }

        const [profileResponse, zonesResponse] = await Promise.all([
          fetch(profileUrl, {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include authToken in header
            },
          }),
          fetch(zonesUrl),
        ]);

        const profileData = await profileResponse.json();
        const zonesData = await zonesResponse.json();

        setFormData(profileData); // Update form data with fetched values

        // Filter out car options (assuming zonesData contains zone objects)
        const filteredZones = zonesData.filter(
          (zone) => !zone.type || zone.type.toLowerCase() !== "car"
        );

        setZones(filteredZones);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <Container>
      <form className="flex flex-col space-y-4 lg:w-[500px] h-[60vh] lg:mx-auto mg:mx-20 mx-10 my-10">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="rounded-md border hover:cursor-pointer border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.name}
            disabled
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="rounded-md border hover:cursor-pointer border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.email}
            disabled
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="rounded-md border hover:cursor-pointer border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.phone}
            disabled
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="zone" className="text-sm font-medium">
            Zone
          </label>
          <select
            id="zones"
            name="zones"
            className="rounded-md border border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {zones.map((zone) => (
              <option key={zone.id || zone.name} value={zone.id || zone.name}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            className="rounded-md border border-gray-300 px-3 py-2 h-24 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.address}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-green-800 hover:bg-green-900 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50"
        >
          Submit
        </button>
      </form>
    </Container>
  );
};

export default AccountPage;
