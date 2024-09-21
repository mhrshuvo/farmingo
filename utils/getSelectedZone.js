import { useState, useEffect } from "react";

export const getSelectedZone = () => {
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    const savedZone = localStorage.getItem("selectedZone");
    setSelectedZone(savedZone);
  }, []);

  return selectedZone;
};
