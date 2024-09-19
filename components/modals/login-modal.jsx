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
import { useAuth } from "@/contexts/auth/auth-context";
import { ROUTES } from "@/routes/routes";

export default function LoginModal({ isOpen, onClose }) {
  // AUTH CONTEXT
  const { login } = useAuth(); // Only login method is needed now

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emailOrPhone: "",
    password: "",
    zone_id: 1,
    address: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    emailOrPhone: "",
    password: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    const passwordRegex = /.{8,}/; // Regex for at least 8 characters
    const phoneRegex = /^[0-9]{1,11}$/; // Regex for up to 11 digits
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for valid email

    if (isSignUp) {
      if (!formData.name) errors.name = "Name is required";
      if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = "Valid email is required";
      }
      if (!formData.phone || !phoneRegex.test(formData.phone)) {
        errors.phone = "Phone number must be up to 11 digits";
      }
      if (!formData.password || !passwordRegex.test(formData.password)) {
        errors.password = "Password must be at least 8 characters long";
      }
      if (!formData.address) errors.address = "Address is required";
    }

    setFormErrors(errors);
    return isSignUp ? Object.keys(errors).length === 0 : true;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      if (isSignUp) {
        Object.values(formErrors).forEach((error) => {
          if (error) toast.error(error); // Display all errors as toast during signup
        });
      }
      return;
    }

    try {
      if (isSignUp) {
        // Signup logic here
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ZONES}`
        );
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

        const formDataWithZone = {
          ...formData,
          zone_id: zoneId,
        };

        const signupResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.SIGN_UP}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(formDataWithZone),
          }
        );

        if (signupResponse.ok) {
          toast.success("Sign-up successful");

          const responseData = await signupResponse.json();
          const token = responseData.token;

          login(token); // Use the login function from AuthContext to set the token

          onClose();
          setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            zone_id: 1,
            address: "",
            emailOrPhone: "",
          });
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
        // Login logic here
        const loginData = {
          email: formData.emailOrPhone,
          password: formData.password,
        };

        const loginResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.LOGIN}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(loginData),
          }
        );

        if (loginResponse.ok) {
          toast.success("Login successful");

          const responseData = await loginResponse.json();
          const token = responseData.token;

          login(token); // Use the login function from AuthContext to set the token

          onClose();
          setFormData({
            ...formData,
            emailOrPhone: "",
            password: "",
          });
        } else {
          if (loginResponse.status === 401) {
            toast.error("Invalid email or password");
          } else {
            toast.error("Login failed");
          }
        }
      }
    } catch (error) {
      toast.error(`Error signing up or in: ${error.message}`); // Fixed error handling
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
                <>
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    variant="bordered"
                    helperText={formErrors.name}
                    helperColor={formErrors.name ? "error" : "default"}
                  />
                  <Input
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="bordered"
                    helperText={formErrors.email}
                    helperColor={formErrors.email ? "error" : "default"}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    variant="bordered"
                    helperText={formErrors.phone}
                    helperColor={formErrors.phone ? "error" : "default"}
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    variant="bordered"
                    helperText={formErrors.address}
                    helperColor={formErrors.address ? "error" : "default"}
                  />
                </>
              )}
              {!isSignUp && (
                <Input
                  autoFocus
                  label="Email or Phone"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  variant="bordered"
                  helperText={formErrors.emailOrPhone}
                  helperColor={formErrors.emailOrPhone ? "error" : "default"}
                />
              )}
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                variant="bordered"
                helperText={formErrors.password}
                helperColor={formErrors.password ? "error" : "default"}
              />
              <div className="flex py-2 px-1 justify-between items-center">
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
