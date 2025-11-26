import React from "react";
import { Input } from "./ui/input";

export const PhoneInput = ({ value, onChange, placeholder, ...props }) => {
  const handleChange = (e) => {
    const formattedValue = e.target.value.replace(/[^\d]/g, "");
    if (onChange) {
      onChange(formattedValue);
    }
  };

  return (
    <Input
      type="tel"
      value={value}
      onChange={handleChange}
      placeholder={placeholder || "Enter phone number"}
      {...props}
    />
  );
};
