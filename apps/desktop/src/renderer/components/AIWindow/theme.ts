export const aiTheme = {
  background: "#0A0A0A",
  sidebar: "#101010",
  surface: "#141414",
  surfaceHover: "#1D1D1D",
  surfaceActive: "#242424",
  border: "#232323",
  borderFocus: "#555555",
  textPrimary: "#FCFCFC",
  textMuted: "#A1A1A1",
  textDisabled: "#6F6F6F",
  primaryAction: "#FCFCFC",
  primaryActionForeground: "#111111",
  primaryActionHover: "#E7E7E7",
  primaryActionDisabled: "#4B4B4B",
  primaryActionDisabledForeground: "#8A8A8A",
  mutedAction: "#23263A",
  mutedActionForeground: "#B9BFD8",
  mutedActionHover: "#2B2F4A",
  stopAction: "#E5484D",
} as const;

export const aiThemeClassNames = {
  background: "bg-[#0A0A0A]",
  sidebar: "bg-[#101010]",
  surface: "bg-[#141414]",
  raisedSurface:
    "bg-[#141414] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_44px_rgba(0,0,0,0.42)]",
  menuSurface:
    "bg-[#141414] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_36px_rgba(0,0,0,0.5)]",
  messageSurface:
    "bg-[#242424] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_18px_rgba(0,0,0,0.24)]",
  selectedSurface:
    "bg-[#242424] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_3px_10px_rgba(0,0,0,0.2)]",
  sidebarDepth:
    "shadow-[inset_-1px_0_0_rgba(255,255,255,0.025),8px_0_28px_rgba(0,0,0,0.22)]",
  surfaceHover: "hover:bg-[#1D1D1D]",
  surfaceActive: "bg-[#242424]",
  border: "border-[#232323]",
  divider: "bg-[#232323]",
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
  focusVisibleSurfaceHover: "focus-visible:bg-[#1D1D1D]",
  focusVisibleTextPrimary: "focus-visible:text-[#FCFCFC]",
  dataOpenSurfaceHover: "data-[state=open]:bg-[#1D1D1D]",
  placeholder: "placeholder:text-[#6F6F6F]",
  menuItemFocus: "focus:bg-[#1D1D1D] focus:text-[#FCFCFC]",
  shimmer:
    "[--color-background:#FCFCFC] [--color-muted-foreground:#6F6F6F]",
  primaryAction:
    "bg-[#FCFCFC] text-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_14px_rgba(0,0,0,0.35)] hover:bg-[#E7E7E7] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_7px_18px_rgba(0,0,0,0.42)] active:translate-y-px active:bg-[#D8D8D8] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.3)]",
  primaryActionDisabled:
    "cursor-not-allowed bg-[#4B4B4B] text-[#8A8A8A] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
  mutedAction:
    "bg-[#23263A] text-[#B9BFD8] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[#2B2F4A]",
  stopAction:
    "bg-[#E5484D] text-[#FCFCFC] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_5px_14px_rgba(0,0,0,0.35)] hover:bg-[#F2555A] active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.3)]",
} as const;
