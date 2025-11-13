import React, { ReactNode } from "react";

type DashboardHeightProps = {
  children: ReactNode;
};

const HEADER_HEIGHT = 65; // Change to match your header height in px

export function DashboardHeight({ children }: DashboardHeightProps) {
  return (
    <div
      className="w-full flex flex-col overflow-hidden"
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      <div className="flex-1 flex flex-col h-full w-full">
        {children}
      </div>
    </div>
  );
}