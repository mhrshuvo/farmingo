import { Spinner } from "@nextui-org/react";
import React from "react";

const Loader = () => {
  return (
    <div className="h-screen text-center">
      <Spinner label="Loading" color="success" labelColor="success" />
    </div>
  );
};

export default Loader;
