import React from "react";
import { Home } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

interface HomeButtonProps {
  onClick: () => void;
  text?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-md ${className} hover:opacity-80 transition-opacity`}
      {...props}
    >
      {children}
    </button>
  );
};

const HomeButton: React.FC<HomeButtonProps> = ({ 
  onClick, 
  text = "", 
  className = "" 
}) => (
  <Button onClick={onClick} className={className}>
    <div className="flex items-center gap-2">
      <Home className="w-4 h-4" />
      {text && <span>{text}</span>}
    </div>
  </Button>
);

export { Button, HomeButton };