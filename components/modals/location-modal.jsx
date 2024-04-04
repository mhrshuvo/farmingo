"use client";

// location-modal.js
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";

export default function LocationModal({ isOpen, onClose, onZoneSelect }) {
  const zones = ["Uttara", "Gulshan", "Banani", "Dhanmondi"];

  const handleZoneSelection = (zone) => {
    onZoneSelect(zone);
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Select a Zone</ModalHeader>
        <ModalBody>
          {zones.map((zone, index) => (
            <Button
              key={index}
              onClick={() => handleZoneSelection(zone)}
              variant="light"
              className="w-full"
            >
              {zone}
            </Button>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
