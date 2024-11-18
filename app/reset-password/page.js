"use client";

import { ROUTES } from "@/routes/routes";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for show/hide password

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [token, setToken] = useState(null); // State to store the token from the URL

  // Extract token from URL query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token"); // Get the token from the URL
    setToken(tokenFromUrl); // Set the token in state
  }, []);

  const handleSubmit = async () => {
    // Check if the passwords match
    if (password !== confirmPassword) {
      // Show a toast error only if the passwords don't match
      toast.error("Passwords do not match!");
      return;
    } else {
      setError(""); // Clear the error message if passwords match
    }

    // Create the data object for the API call
    const data = {
      token: token,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
    };

    // Make the API call to reset the password
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.RESET_PASSWORD}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Success - show a success message and maybe redirect the user
        toast.success("Password successfully reset!");
        router.push("/");
      } else {
        // If there's an error returned from the API, show it
        toast.error(
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      // Handle network or other errors
      toast.error("An error occurred. Please try again later.");
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"} // Toggle password visibility
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="button" // This is important since we're using onClick and not onSubmit
            onClick={handleSubmit} // Handle submit on button click
            className="w-full cursor-pointer text-white py-2 rounded-md bg-green-800 hover:bg-green-900 transition duration-200"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
