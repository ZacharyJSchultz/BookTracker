import React, { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  btnType?: "button" | "submit" | "reset"
}

const Button: React.FC<ButtonProps> = ( {children, onClick, btnType = "button"} ) => {
  return (
    <button type={btnType} className="btn btn-primary" onClick={onClick}>{children}</button>
  );
};

export default Button;
