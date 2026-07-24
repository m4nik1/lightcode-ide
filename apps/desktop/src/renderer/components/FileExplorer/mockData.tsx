import { FileTreeNode } from "../../types/FileTreeNode";

export const mockTree: FileTreeNode[] = [
  {
    name: "src",
    kind: "folder",
    children: [
      {
        name: "main",
        kind: "folder",
        children: [{ name: "main.ts", kind: "file" }],
      },
      {
        name: "preload",
        kind: "folder",
        children: [{ name: "preload.ts", kind: "file" }],
      },
      {
        name: "renderer",
        kind: "folder",
        children: [
          { name: "App.tsx", kind: "file" },
          { name: "main.tsx", kind: "file" },
          { name: "index.css", kind: "file" },
          { name: "index.html", kind: "file" },
          {
            name: "components",
            kind: "folder",
            children: [
              { name: "FileExplorer.tsx", kind: "file" },
              { name: "ModernEditor.tsx", kind: "file" },
              { name: "TopBar.tsx", kind: "file" },
              { name: "Panel.tsx", kind: "file" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "assets",
    kind: "folder",
    children: [
      {
        name: "appIcon",
        kind: "folder",
        children: [
          { name: "icon.ico", kind: "file" },
          { name: "icon.icns", kind: "file" },
          { name: "icon.png", kind: "file" },
        ],
      },
    ],
  },
  { name: "package.json", kind: "file" },
  { name: "tsconfig.json", kind: "file" },
  { name: "forge.config.ts", kind: "file" },
  { name: "vite.main.config.ts", kind: "file" },
  { name: "vite.renderer.config.mts", kind: "file" },
  { name: ".eslintrc.json", kind: "file" },
];
