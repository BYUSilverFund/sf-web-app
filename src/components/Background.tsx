import React, { ReactNode } from "react";
import AtriumPic from "@/images/atrium.png";

// styling for the background
const tailwindStyle = `
    fixed
    top-0
    left-0
    w-full
    h-[8vh]
    sm:h-[10vh]
    bg-bottom
    flex
    flex-col
    bg-no-repeat
    bg-cover
    px-5 md:px-6 pt-3
    z-50
`;

interface BackgroundProps {
  children: ReactNode;
}

// pass children here because the background is a wrapper (all other elements will be inside)
export const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,42,92,0.5), rgba(0,42,92,1)), url(${AtriumPic.src})`,
      }}
      className={tailwindStyle}
    >
      {children}
    </div>
  );
};
