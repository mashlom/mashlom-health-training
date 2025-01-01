import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-blue-500 text-white disabled:opacity-50 ${className} hover:opacity-80`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
