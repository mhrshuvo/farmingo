"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Link,
} from "@nextui-org/react";
import toast from "react-hot-toast";

export default function LoginModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    zone_id: 1,
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      if (isSignUp) {
        const response = await fetch("http://192.168.68.109:8000/api/v1/zones");
        if (!response.ok) {
          throw new Error("Failed to fetch zones");
        }
        const zonesData = await response.json();

        const selectedZone = localStorage.getItem("selectedZone");
        const zone = zonesData.find((zone) => zone.name === selectedZone);
        if (!zone) {
          throw new Error("Selected zone not found");
        }
        const zoneId = zone.id;

        setFormData((prevFormData) => ({
          ...prevFormData,
          zone_id: zoneId,
        }));

        const signupResponse = await fetch(
          "http://192.168.68.109:8000/api/v1/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (signupResponse.ok) {
          toast.success("Sign-up successful");
          onClose();
        } else {
          if (signupResponse.status === 422) {
            const responseData = await signupResponse.json();
            if (responseData && responseData.message) {
              toast.error("Email or Phone already taken");
            } else {
              toast.error("Sign-up failed");
            }
          } else {
            toast.error("Sign-up failed");
          }
        }
      } else {
        // Handle sign-in form submission
        toast.error("Signing in with data:", formData);
        // Here you would typically make an API request to the server to authenticate the user
      }
    } catch (error) {
      toast.error("Error signing up:", error);
      // Optionally, you can handle errors that occur during the sign-up process
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp); // Toggle between sign-up and sign-in mode
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isSignUp ? "Sign Up" : "Sign In"}
            </ModalHeader>
            <ModalBody>
              {isSignUp && (
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="bordered"
                />
              )}
              {isSignUp && (
                <Input
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="bordered"
                />
              )}
              {isSignUp && (
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  variant="bordered"
                />
              )}
              {!isSignUp && (
                <Input
                  autoFocus
                  label="Email or Phone"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  variant="bordered"
                />
              )}
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                variant="bordered"
              />
              {isSignUp && (
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  variant="bordered"
                />
              )}
              <div className="flex py-2 px-1 justify-between items-center">
                <Link className="text-[#145D4C]" href="#" size="sm">
                  Forgot password?
                </Link>
                <div className="flex justify-center">
                  <Link
                    className="text-[#145D4C] cursor-pointer"
                    size="sm"
                    onClick={handleToggleMode}
                  >
                    {isSignUp
                      ? "Already have an account? Sign In"
                      : "Don't have an account? Sign Up"}
                  </Link>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="text-white bg-[#145D4C]"
                fullWidth
                onPress={handleFormSubmit}
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
