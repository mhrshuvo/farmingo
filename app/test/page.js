"use client";

import React from "react";
import toast from "react-hot-toast";

const TestPage = () => {
  const handleClick = () => {
    console.log("clicked");
    const data = {
      name: "sihab",
      last_name: "hossain",
      phone: "01867149812",
      email: "sihab@gmail.com",
      password: "123456",
      c_password: "123456",
    };

    fetch("http://192.168.68.117:8080/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Registration successful!");
          // You can add further actions here upon successful registration
        } else {
          console.error("Registration failed.");
        }
      })
      .catch((error) => {
        console.error("Error:", error.email);
      });
  };

  return (
    <div>
      <button className="bg-red-600 py-4 px-2 rounded-lg" onClick={handleClick}>
        TEST
      </button>
    </div>
  );
};

export default TestPage;
