import React from "react";

export function Card({ children, className }) {
  return (
    <div className={`border rounded-lg shadow-md p-4 ${className || ""}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={`mb-2 ${className || ""}`}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={`text-gray-700 ${className || ""}`}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h2 className={`text-xl font-bold ${className || ""}`}>{children}</h2>;
}
