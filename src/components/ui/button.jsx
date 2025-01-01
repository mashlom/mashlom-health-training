import React from "react";

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

export { Button };
