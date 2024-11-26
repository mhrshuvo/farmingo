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
  const { login, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false); // For toggling between Sign Up and Sign In
  const [isForgotPassword, setIsForgotPassword] = useState(false); // For toggling Forgot Password mode

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

  // Handle the forgot password click
  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true); // Switch to forgot password form
    setIsSignUp(false); // Make sure we're not in Sign Up mode
  };

  // Reset password logic
  const handleResetPassword = async () => {
    if (!formData.emailOrPhone) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.RESET_REQUEST}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: formData.emailOrPhone }),
        }
      );

      if (response.ok) {
        toast.success("Password reset link sent to your phone");
        onClose();
      } else {
        toast.error("Failed to send password reset link");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  // Validate the form before submitting
  const validateForm = () => {
    const errors = {};
    const passwordRegex = /.{6,}/; // Regex for at least 6 characters
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
        errors.password = "Password must be at least 6 characters long";
      }
      if (!formData.address) errors.address = "Address is required";
    }

    setFormErrors(errors);
    return isSignUp ? Object.keys(errors).length === 0 : true;
  };

  // Handle the form submission (Sign Up, Sign In, or Reset Password)
  const handleFormSubmit = async () => {
    if (isForgotPassword) {
      handleResetPassword(); // Reset password logic
      return;
    }

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
        // Sign Up logic here
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

          signUp(token);
          login(token);

          onClose();
          setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            zone_id: zoneId,
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
      toast.error(`Error signing up or in: ${error.message}`);
    }
  };

  // Toggle between Sign Up and Sign In modes
  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false); // Reset forgot password view when toggling
  };

  // Handle back to Sign In from Forgot Password
  const handleBackToSignIn = () => {
    setIsForgotPassword(false); // Go back to Sign In form
    setIsSignUp(false); // Ensure we're in Sign In mode, not Sign Up
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {isForgotPassword
            ? "Reset Password"
            : isSignUp
            ? "Sign Up"
            : "Sign In"}
        </ModalHeader>
        <ModalBody>
          {isForgotPassword ? (
            <>
              <Input
                label="Phone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                variant="bordered"
                helperText={formErrors.emailOrPhone}
                helperColor={formErrors.emailOrPhone ? "error" : "default"}
              />
              <div className="flex py-2 px-1 justify-between items-center">
                <div className="flex justify-center">
                  <Link
                    className="text-[#145D4C] cursor-pointer"
                    size="sm"
                    onClick={handleBackToSignIn}
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
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

                <div className="flex justify-center">
                  <Link
                    href="#"
                    className="text-[#145D4C] cursor-pointer"
                    size="sm"
                    onClick={handleForgotPasswordClick}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className="text-white bg-[#145D4C]"
            fullWidth
            onPress={handleFormSubmit}
          >
            {isForgotPassword
              ? "Send Reset Link"
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
