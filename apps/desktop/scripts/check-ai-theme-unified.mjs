import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const checks = [
  {
    file: "src/renderer/components/AIWindow.tsx",
    forbidden: [
      /radial-gradient/i,
      /linear-gradient/i,
      /#111312/i,
      /#cccccc/i,
    ],
  },
  {
    file: "src/renderer/components/AIWindow/AITextBox.tsx",
    forbidden: [/#333/i, /#444/i, /#2a2a2a/i, /#1e1e1e/i, /#888/i],
  },
  {
    file: "src/renderer/components/AIWindow/ModelPicker.tsx",
    forbidden: [
      /#333/i,
      /#2a2a2a/i,
      /#1e1e1e/i,
      /#888/i,
      /backdrop-blur/i,
    ],
  },
  {
    file: "src/renderer/components/AIWindow/sidebar/AISidebar.tsx",
    forbidden: [/linear-gradient/i, /radial-gradient/i, /bg-white/i],
  },
  {
    file: "src/renderer/components/AIWindow/sidebar/SidebarHeader.tsx",
    forbidden: [/bg-white/i, /outline-white/i],
  },
  {
    file: "src/renderer/components/AIWindow/sidebar/ThreadItem.tsx",
    forbidden: [/bg-white/i, /outline-white/i],
  },
  {
    file: "src/renderer/components/AIWindow/sidebar/ProjectDropdown.tsx",
    forbidden: [/bg-white/i, /outline-white/i],
  },
  {
    file: "src/renderer/index.css",
    forbidden: [/backdrop-filter/i, /linear-gradient/i],
  },
];

const failures = checks.flatMap(({ file, forbidden }) => {
  const content = readFileSync(join(root, file), "utf8");

  return forbidden
    .filter((pattern) => pattern.test(content))
    .map((pattern) => `${file}: found forbidden pattern ${pattern}`);
});

if (failures.length > 0) {
  console.error("AI window theme is not unified:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("AI window theme is unified.");
