import React, { type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useMobileMenu } from "@site/src/contexts/MobileMenuContext";

type Props = { mobile?: boolean };

export default function MobileMenuToggleNavbarItem({ mobile }: Props): ReactNode {
  const { isOpen, open, close } = useMobileMenu();

  // 不在 Docusaurus 默认移动侧边栏中重复渲染
  if (mobile) return null;

  return (
    <button
      className="mobile-nav-toggle"
      onClick={isOpen ? close : open}
      aria-label={isOpen ? "关闭菜单" : "打开菜单"}
    >
      {isOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
    </button>
  );
}
