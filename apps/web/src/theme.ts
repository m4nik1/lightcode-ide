export const aiTheme = {
  background: "#0A0A0A",
  sidebar: "#171717",
  surface: "#1B1B1B",
  surfaceHover: "#222222",
  surfaceActive: "#292929",
  mentionActive: "rgba(52,107,241,0.35)",
  border: "#2A2A2A",
  borderFocus: "#555555",
  textPrimary: "#FCFCFC",
  textMuted: "#A1A1A1",
  textDisabled: "#6F6F6F",
  primaryAction: "#FCFCFC",
  primaryActionForeground: "#0A0A0A",
  primaryActionHover: "#E7E7E7",
  primaryActionDisabled: "#4B4B4B",
  primaryActionDisabledForeground: "#8A8A8A",
  stopAction: "#E5484D",
  rail: "rgba(255,255,255,0.08)",
  accent: "#346BF1",
  accentHover: "#4A7CF3",
  // Lighter tint of the accent for text on dark surfaces; the pure accent
  // falls short of readable contrast at 13px.
  accentText: "#7FA0F7",
  accentSoft: "rgba(52,107,241,0.2)",
} as const;

export const aiThemeClassNames = {
  background: "bg-[#0A0A0A]",
  sidebar: "bg-[#171717]",
  surface: "bg-[#1B1B1B]",
  raisedSurface:
    "bg-[#1B1B1B] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_16px_44px_rgba(0,0,0,0.42)]",
  composerSurface:
    "bg-[#1B1B1B]/80 bg-linear-to-b from-white/[0.035] to-transparent backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.3)]",
  menuSurface:
    "bg-[#1B1B1B] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_36px_rgba(0,0,0,0.5)]",
  glassMenuSurface:
    "bg-[#1B1B1B]/55 bg-linear-to-br from-white/[0.06] to-transparent backdrop-blur-3xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_48px_rgba(0,0,0,0.4)]",
  glassBorder: "border-[rgba(255,255,255,0.1)]",
  messageSurface:
    "bg-[#292929] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_18px_rgba(0,0,0,0.24)]",
  selectedSurface:
    "bg-[#292929] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_3px_10px_rgba(0,0,0,0.2)]",
  rail: "before:bg-[rgba(255,255,255,0.08)]",
  railSelected: "before:bg-[#346BF1]",
  accentSoftSurface: "bg-[rgba(52,107,241,0.2)]",
  textAccent: "text-[#7FA0F7]",
  accentAction:
    "bg-[#346BF1] text-white hover:bg-[#4A7CF3] active:scale-95",
  accentActionDisabled: "cursor-not-allowed bg-[#346BF1]/40 text-white/45",
  surfaceHover: "hover:bg-[#222222]",
  surfaceActive: "bg-[#292929]",
  mentionActiveSurface: "bg-[rgba(52,107,241,0.35)]",
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
    "bg-[#FCFCFC] text-[#0A0A0A] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_14px_rgba(0,0,0,0.35)] hover:bg-[#E7E7E7] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_7px_18px_rgba(0,0,0,0.42)] active:translate-y-px active:bg-[#D8D8D8] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.3)]",
  primaryActionDisabled:
    "cursor-not-allowed bg-[#4B4B4B] text-[#8A8A8A] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
  stopAction:
    "bg-[#E5484D] text-[#FCFCFC] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_5px_14px_rgba(0,0,0,0.35)] hover:bg-[#F2555A] active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.3)]",
} as const;
