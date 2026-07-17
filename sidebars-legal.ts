import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  legalSidebar: [
    {
      type: "category",
      label: "法律文档",
      link: { type: "doc", id: "index" },
      items: ["lessor-rental-agreement", "lessee-rental-agreement"],
    },
  ],
};

export default sidebars;
