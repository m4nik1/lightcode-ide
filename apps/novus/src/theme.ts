export const aiTheme = {
  background: "#111111",
  sidebar: "#171717",
  surface: "#1B1B1B",
  surfaceHover: "#222222",
  surfaceActive: "#292929",
  border: "#2A2A2A",
  borderFocus: "#555555",
  textPrimary: "#FCFCFC",
  textMuted: "#A1A1A1",
  textDisabled: "#6F6F6F",
  primaryAction: "#FCFCFC",
  primaryActionForeground: "#111111",
  primaryActionHover: "#E7E7E7",
  primaryActionDisabled: "#4B4B4B",
  primaryActionDisabledForeground: "#8A8A8A",
  stopAction: "#E5484D",
} as const;

export const aiThemeClassNames = {
  background: "bg-[#111111]",
  sidebar: "bg-[#171717]",
  surface: "bg-[#1B1B1B]",
  raisedSurface:
    "bg-[#1B1B1B] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_16px_44px_rgba(0,0,0,0.42)]",
  menuSurface:
    "bg-[#1B1B1B] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_36px_rgba(0,0,0,0.5)]",
  messageSurface:
    "bg-[#292929] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_18px_rgba(0,0,0,0.24)]",
  selectedSurface:
    "bg-[#292929] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_3px_10px_rgba(0,0,0,0.2)]",
  sidebarDepth:
    "shadow-[inset_-1px_0_0_rgba(255,255,255,0.025),8px_0_28px_rgba(0,0,0,0.22)]",
  surfaceHover: "hover:bg-[#222222]",
  surfaceActive: "bg-[#292929]",
  border: "border-[#2A2A2A]",
  divider: "bg-[#2A2A2A]",
  borderFocus: "focus-visible:outline-[#555555]",
  focusRing: "focus-visible:ring-[#555555]",
  focusWithinBorder: "focus-within:border-[#555555]",
  focusWithinRing: "focus-within:ring-[#555555]/35",
  focusWithinDepth:
    "focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_20px_52px_rgba(0,0,0,0.5)]",
  textPrimary: "text-[#FCFCFC]",
  textMuted: "text-[#A1A1A1]",
  textDisabled: "text-[#6F6F6F]",
  hoverTextPrimary: "hover:text-[#FCFCFC]",
  textWarning: "text-[#F5A623]",
  hoverTextWarning: "hover:text-[#FFB84D]",
  dataOpenTextWarning: "data-[state=open]:text-[#F5A623]",
  focusVisibleSurfaceHover: "focus-visible:bg-[#222222]",
  focusVisibleTextPrimary: "focus-visible:text-[#FCFCFC]",
  dataOpenSurfaceHover: "data-[state=open]:bg-[#222222]",
  placeholder: "placeholder:text-[#6F6F6F]",
  menuItemFocus: "focus:bg-[#222222] focus:text-[#FCFCFC]",
  shimmer:
    "[--color-background:#FCFCFC] [--color-muted-foreground:#6F6F6F]",
  primaryAction:
    "bg-[#FCFCFC] text-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_14px_rgba(0,0,0,0.35)] hover:bg-[#E7E7E7] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_7px_18px_rgba(0,0,0,0.42)] active:translate-y-px active:bg-[#D8D8D8] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.3)]",
  primaryActionDisabled:
    "cursor-not-allowed bg-[#4B4B4B] text-[#8A8A8A] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
  stopAction:
    "bg-[#E5484D] text-[#FCFCFC] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_5px_14px_rgba(0,0,0,0.35)] hover:bg-[#F2555A] active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.3)]",
} as const;
