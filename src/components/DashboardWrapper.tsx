import React, { ReactNode } from "react";

type DashboardHeightProps = {
  children: ReactNode;
};

export function DashboardWrapper({ children }: DashboardHeightProps) {
  return (
    <div className="w-full flex flex-col md:h-[calc(100vh-100px)]">
      <div className="flex-1 min-h-0 flex flex-col gap-4">{children}</div>
    </div>
  );
}
