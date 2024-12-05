import React from "react";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card, CardContent };
