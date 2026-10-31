// Colors live once, as CSS variables in index.css (T3 Code's dark palette).
// These helpers only reference them, so the palette never drifts.

/** For inline styles. */
export const aiTheme = {
  background: "var(--color-canvas)",
  border: "var(--color-line)",
  textPrimary: "var(--color-fg)",
  textMuted: "var(--color-fg-muted)",
  textDisabled: "var(--color-fg-disabled)",
} as const;

export const aiThemeClassNames = {
  background: "bg-canvas",
  sidebar: "bg-canvas",
  surface: "bg-surface",
  raisedSurface:
    "bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_16px_44px_rgba(0,0,0,0.42)]",
  composerSurface:
    "bg-surface/80 bg-linear-to-b from-white/[0.035] to-transparent backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.3)]",
  menuSurface:
    "bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_36px_rgba(0,0,0,0.5)]",
  glassMenuSurface:
    "bg-surface/55 bg-linear-to-br from-white/[0.06] to-transparent backdrop-blur-3xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_48px_rgba(0,0,0,0.4)]",
  glassBorder: "border-white/10",
  messageSurface:
    "bg-surface-hover shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_18px_rgba(0,0,0,0.24)]",
  selectedSurface:
    "bg-surface-active shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_3px_10px_rgba(0,0,0,0.2)]",
  textAccent: "text-accent-text",
  accentAction: "bg-primary text-white hover:bg-primary-hover active:scale-95",
  accentActionDisabled: "cursor-not-allowed bg-primary/40 text-white/45",
  surfaceHover: "hover:bg-surface-hover",
  surfaceActive: "bg-surface-active",
  mentionActiveSurface: "bg-primary/35",
  border: "border-line",
  divider: "bg-line",
  borderFocus: "focus-visible:outline-primary",
  // A 2px inset ring that stays visible on filled rows
  focusOutline:
    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
  focusRing: "focus-visible:ring-primary",
  focusWithinBorder: "focus-within:border-primary",
  focusWithinRing: "focus-within:ring-primary/35",
  focusWithinDepth:
    "focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_20px_52px_rgba(0,0,0,0.5)]",
  textPrimary: "text-fg",
  textSecondary: "text-fg-secondary",
  textMuted: "text-fg-muted",
  textDisabled: "text-fg-disabled",
  hoverTextPrimary: "hover:text-fg",
  textWarning: "text-warning",
  hoverTextWarning: "hover:text-warning-hover",
  dataOpenTextWarning: "data-[state=open]:text-warning",
  focusVisibleSurfaceHover: "focus-visible:bg-surface-hover",
  focusVisibleTextPrimary: "focus-visible:text-fg",
  dataOpenSurfaceHover: "data-[state=open]:bg-surface-hover",
  placeholder: "placeholder:text-fg-disabled",
  menuItemFocus: "focus:bg-surface-hover focus:text-fg",
  shimmer:
    "[--color-background:var(--color-fg)] [--color-muted-foreground:var(--color-fg-disabled)]",
  primaryAction:
    "bg-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_5px_14px_rgba(0,0,0,0.35)] hover:bg-primary-hover active:translate-y-px active:shadow-[inset_0_1px_0_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.3)]",
  primaryActionDisabled: "cursor-not-allowed bg-primary/40 text-white/45 shadow-none",
  stopAction:
    "bg-danger text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_5px_14px_rgba(0,0,0,0.35)] hover:bg-danger-hover active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.3)]",
} as const;
