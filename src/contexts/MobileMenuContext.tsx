import React, { createContext, useContext, useState, type ReactNode } from "react";

export type SidebarItem = {
  type: string;
  label?: string;
  href?: string;
  items?: SidebarItem[];
};

type SidebarData = {
  name: string;
  items: SidebarItem[];
};

type MobileMenuContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  sidebar: SidebarData | null;
  setSidebar: (data: SidebarData | null) => void;
};

const MobileMenuContext = createContext<MobileMenuContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  sidebar: null,
  setSidebar: () => {},
});

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebar, setSidebar] = useState<SidebarData | null>(null);

  return (
    <MobileMenuContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        sidebar,
        setSidebar,
      }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
}
