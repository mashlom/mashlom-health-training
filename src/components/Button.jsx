import React from "react";
import { Home } from "lucide-react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md ${className} hover:opacity-80`}
      {...props}
    >
      {children}
    </button>
  );
};

const HomeButton = ({ onClick, text = "", className = "" }) => (
  <Button onClick={onClick} className={`${className}`}>
    <Home className="w-4 h-4" />
    {text && <span>{text}</span>}
  </Button>
);

export { Button, HomeButton };
