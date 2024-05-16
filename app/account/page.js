"use client";

import React, { useEffect, useState } from "react";
import Container from "../container";
import { ROUTES } from "@/routes/routes";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const router = useRouter();

  const initialState = {
    name: "",
    email: "",
    phone: "",
    zone_id: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [zones, setZones] = useState([]);

  // API endpoints
  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.PROFILE}`;
  const zonesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ZONES}`;
  const profileUpdateUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.UPDATE_PROFILE}`;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          toast.error("Missing authToken in localStorage");
          return;
        }

        const [profileResponse, zonesResponse] = await Promise.all([
          fetch(profileUrl, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
          fetch(zonesUrl),
        ]);

        const profileData = await profileResponse.json();
        const zonesData = await zonesResponse.json();

        setFormData({
          ...profileData,
          zone_id: profileData.zone_id,
        });

        setZones(zonesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      console.error("Missing authToken in localStorage");
      // Handle missing authToken (e.g., redirect to login)
      return;
    }

    try {
      const response = await fetch(profileUpdateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          zone_id: formData.zone_id,
          address: formData.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      toast.success("Profile updated successfully:", result);
      router.push("/");
    } catch (error) {
      toast.error("Error updating profile:", error);
    }
  };

  return (
    <Container>
      <form
        className="flex flex-col space-y-4 lg:w-[500px] h-[60vh] lg:mx-auto mg:mx-20 mx-10 my-10"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-3xl font-semibold text-center">Profile</h1>
        </div>
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
          <label htmlFor="zone_id" className="text-sm font-medium">
            Zone
          </label>
          <select
            id="zone_id"
            name="zone_id"
            className="rounded-md border border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.zone_id}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select your zone
            </option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
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
            onChange={handleChange}
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
