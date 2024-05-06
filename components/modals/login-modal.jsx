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

export default function LoginModal({ isOpen, onClose }) {
  // AUTH CONTEXT
  const { login, setUser } = useAuth();

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

  // this function works to signup or login the user
  const handleFormSubmit = async () => {
    try {
      // Signup logic here
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

        const formDataWithZone = {
          ...formData,
          zone_id: zoneId,
        };

        const signupResponse = await fetch(
          "http://192.168.68.109:8000/api/v1/signup",
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
          const userName = responseData.name;
          localStorage.setItem("UserName", userName);
          setUser(userName);

          // Use the login function from AuthContext to set the token
          login(token);

          onClose();
          setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            zone_id: 1,
            address: "",
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
          "http://192.168.68.109:8000/api/v1/login",
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
          const userName = responseData.name;
          localStorage.setItem("UserName", userName);
          setUser(userName);

          // Use the login function from AuthContext to set the token
          login(token);

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
      toast.error("Error signing up or in:", error);
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
