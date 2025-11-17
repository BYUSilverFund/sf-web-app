import React, { ReactNode } from "react";

type DashboardHeightProps = {
  children: ReactNode;
};

const HEADER_HEIGHT = 100; // add your header height here

export function DashboardHeight({ children }: DashboardHeightProps) {
  return (
    <div
      className="w-full flex flex-col overflow-y-auto"
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      <div className="flex-1 min-h-0 flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}