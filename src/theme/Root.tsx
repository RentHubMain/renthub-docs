import React, { type ReactNode } from "react";
import { MobileMenuProvider } from "@site/src/contexts/MobileMenuContext";
import MobileDrawer from "@site/src/components/MobileDrawer";

export default function Root({ children }: { children: ReactNode }) {
  return (
    <MobileMenuProvider>
      {children}
      <MobileDrawer />
    </MobileMenuProvider>
  );
}
