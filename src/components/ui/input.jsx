import React from "react";

export function Input({ type = "text", placeholder, className, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`border px-3 py-2 rounded ${className}`}
      {...props}
    />
  );
}
