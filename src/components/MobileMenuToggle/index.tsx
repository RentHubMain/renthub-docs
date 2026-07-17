import React, { type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useMobileMenu } from "@site/src/contexts/MobileMenuContext";
import styles from "./styles.module.css";

export default function MobileMenuToggle(): ReactNode {
  const { isOpen, open, close } = useMobileMenu();

  return (
    <button
      className={styles.toggle}
      onClick={isOpen ? close : open}
      aria-label={isOpen ? "关闭菜单" : "打开菜单"}
    >
      {isOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
    </button>
  );
}
