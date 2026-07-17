import React, { type ReactNode } from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import clsx from "clsx";
import styles from "./TooltipLinkNavbarItem.module.css";

type Props = {
  label: string;
  tooltip?: string;
  to: string;
  activeBasePath?: string;
  position?: "left" | "right";
  mobile?: boolean;
};

export default function TooltipLinkNavbarItem({
  label,
  tooltip,
  to,
  activeBasePath,
  mobile,
}: Props): ReactNode {
  // 移动端由自定义抽屉负责，这里不渲染
  if (mobile) return null;

  const { pathname } = useLocation();
  const isActive = activeBasePath ? pathname.startsWith(activeBasePath) : pathname === to;

  return (
    <Link
      to={to}
      data-tooltip={tooltip}
      className={clsx("navbar__item navbar__link", styles.link, {
        "navbar__link--active": isActive,
      })}
    >
      {label}
    </Link>
  );
}
