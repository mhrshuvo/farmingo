import { Spinner } from "@nextui-org/react";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen text-center">
      <Spinner label="Success" color="success" labelColor="success" />
    </div>
  );
};

export default loading;
