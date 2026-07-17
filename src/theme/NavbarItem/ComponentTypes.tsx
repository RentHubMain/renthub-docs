import React from "react";
import OriginalComponentTypes from "@theme-original/NavbarItem/ComponentTypes";
import MobileMenuToggleNavbarItem from "@theme/NavbarItem/MobileMenuToggleNavbarItem";
import TooltipLinkNavbarItem from "@theme/NavbarItem/TooltipLinkNavbarItem";

const ComponentTypes = {
  ...OriginalComponentTypes,
  "custom-MobileMenuToggle": MobileMenuToggleNavbarItem,
  "custom-TooltipLink": TooltipLinkNavbarItem,
};

export default ComponentTypes;
