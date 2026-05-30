import type { CSSProperties } from "react";

const FILE_TREE_ICON_SIZE = 16;

/** Colors aligned with FileExplorer dark shell. */
const fileTreePalette = {
  text: "#d4d4d4",
  textMuted: "#9aa3ad",
  folderText: "#e0e0e0",
  border: "rgba(255, 255, 255, 0.05)",
  hoverBg: "rgba(255, 255, 255, 0.06)",
  selectionBg: "rgba(56, 139, 253, 0.22)",
  selectionFg: "#e8eaed",
  focusRing: "rgba(56, 139, 253, 0.55)",
  selectionBorder: "rgba(56, 139, 253, 0.45)",
  indentGuide: "rgba(255, 255, 255, 0.06)",
  scrollbarThumb: "rgba(255, 255, 255, 0.14)",
} as const;

const fileTreeThemeVars = {
  // Text
  "--trees-fg-override": fileTreePalette.text,
  "--trees-fg-muted-override": fileTreePalette.textMuted,
  // Surface
  "--trees-bg-override": "transparent",
  "--trees-bg-muted-override": fileTreePalette.hoverBg,
  "--trees-border-color-override": fileTreePalette.border,
  // Selection and focus
  "--trees-selected-fg-override": fileTreePalette.selectionFg,
  "--trees-selected-bg-override": fileTreePalette.selectionBg,
  "--trees-selected-focused-border-color-override": fileTreePalette.selectionBorder,
  "--trees-focus-ring-color-override": fileTreePalette.focusRing,
  "--trees-focus-ring-width-override": "1px",
  "--trees-focus-ring-offset-override": "-1px",
  // Spacing and typography
  "--trees-border-radius-override": "4px",
  "--trees-font-size-override": "13px",
  "--trees-item-padding-x-override": "8px",
  "--trees-item-margin-x-override": "6px",
  "--trees-item-row-gap-override": "6px",
  "--trees-icon-width-override": `${FILE_TREE_ICON_SIZE}px`,
  // Chrome
  "--trees-indent-guide-bg-override": fileTreePalette.indentGuide,
  "--trees-scrollbar-thumb-override": fileTreePalette.scrollbarThumb,
} as CSSProperties;

export const FILE_TREE_UNSAFE_CSS = `
  [data-type='item'][data-item-type='folder'] [data-item-section='content'] {
    font-weight: 600;
    color: ${fileTreePalette.folderText};
  }

  [data-type='item'] [data-item-section='icon'] svg {
    width: ${FILE_TREE_ICON_SIZE}px;
    height: ${FILE_TREE_ICON_SIZE}px;
  }

  [data-type='item'][data-item-type='folder'] [data-item-section='icon'] {
    opacity: 0.92;
  }
`.trim();

export const styles: Record<string, CSSProperties> = {
  root: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
  fileTreeHost: {
    flex: 1,
    minHeight: 0,
    height: "100%",
  },
};

export const fileTreeHostStyle: CSSProperties = {
  ...styles.fileTreeHost,
  ...fileTreeThemeVars,
};
