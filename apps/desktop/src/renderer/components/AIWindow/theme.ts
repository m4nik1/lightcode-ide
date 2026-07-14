export const aiTheme = {
  background: "#000",
  surface: "#0a0a0a",
  surfaceHover: "#171717",
  surfaceActive: "#1a1a1a",
  border: "#262626",
  borderFocus: "#525252",
  textPrimary: "#ededed",
  textMuted: "#a1a1a1",
  textDisabled: "#737373",
} as const;

export const aiThemeClassNames = {
  background: "bg-[#000]",
  surface: "bg-[#0a0a0a]",
  surfaceHover: "hover:bg-[#171717]",
  surfaceActive: "bg-[#1a1a1a]",
  border: "border-[#262626]",
  borderFocus: "focus-visible:outline-[#525252]",
  focusWithinBorder: "focus-within:border-[#525252]",
  focusWithinRing: "focus-within:ring-[#525252]/35",
  textPrimary: "text-[#ededed]",
  textMuted: "text-[#a1a1a1]",
  textDisabled: "text-[#737373]",
  hoverTextPrimary: "hover:text-[#ededed]",
  focusVisibleSurfaceHover: "focus-visible:bg-[#171717]",
  focusVisibleTextPrimary: "focus-visible:text-[#ededed]",
  dataOpenSurfaceHover: "data-[state=open]:bg-[#171717]",
} as const;
