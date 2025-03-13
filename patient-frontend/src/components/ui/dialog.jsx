// src/components/ui/dialog.jsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

export function Dialog({ children }) {
  return <DialogPrimitive.Root>{children}</DialogPrimitive.Root>;
}

export function DialogTrigger({ children, asChild }) {
  return (
    <DialogPrimitive.Trigger asChild={asChild}>
      {children}
    </DialogPrimitive.Trigger>
  );
}

export function DialogContent({ children, className = "" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <DialogPrimitive.Content
        className={`fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg p-4 ${className}`}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✕
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ children, className = "" }) {
  return (
    <DialogPrimitive.Title className={`text-xl font-bold ${className}`}>
      {children}
    </DialogPrimitive.Title>
  );
}
