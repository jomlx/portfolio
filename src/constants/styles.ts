/**
 * @file Styling constants for cards and components
 * Centralizes all hardcoded styles for easier theme customization
 */

/**
 * Card shadow styles based on dragging state
 */
export const CARD_SHADOWS = {
  default: "4px 6px 12px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.05)",
  dragging: "6px 12px 24px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.05)",
} as const;

/**
 * Card width classes for responsive design
 */
export const CARD_WIDTHS = {
  default: "w-[110px] md:w-[155px]",
  silhouette: "w-[160px] md:w-[220px]",
  "taped-polaroid": "w-[110px] md:w-[145px]",
  "torn-paper-brown": "w-[130px] md:w-[165px]",
  "torn-paper-grey": "w-[125px] md:w-[200px]",
  "cork-text": "w-[160px] md:w-[210px]",
  "clue-circle": "w-[125px] md:w-[160px]",
} as const;

/**
 * Color palette for the application
 */
export const COLORS = {
  // Card backgrounds
  card: {
    silhouette: "#F0EAD6",
    silhouetteBg: "#E8E2D2",
    tornGreyBg: "#D1CEC4",
    tornBrownBg: "#D4B8A3",
    tapeColor: "#E6DCB8",
    paperBg: "#FAF6F0",
  },
  // Text colors
  text: {
    primary: "#2c1810",
    secondary: "#3d2b1f",
    accent: "#BD3525",
    darkAccent: "#A02B2B",
    red: "#C0392B",
    darkRed: "#7B241C",
  },
  // UI elements
  ui: {
    redStamp: "rgba(192, 57, 43, 0.7)",
    redText: "#C0392B",
    thumbtackBright: "#F1948A",
    thumbtackMain: "#C0392B",
    thumbtackDark: "#7B241C",
    stringRed: "#E8453C",
  },
  // Effects
  effects: {
    lightWarm: "rgba(255,230,160,0.22)",
    lightWhite: "rgba(255,255,255,0.15)",
    darkOverlay: "rgba(5, 4, 3, 0.85)",
    vignette: "rgba(85,65,45,0.15)",
    vignetteEdge: "rgba(65,45,25,0.25)",
  },
} as const;

/**
 * Typography family mappings
 */
export const FONTS = {
  special: '"Special Elite", cursive',
  architectsDaughter: '"Architects Daughter", cursive',
  marker: '"Permanent Marker", cursive',
} as const;

/**
 * Z-index values for layering components
 */
export const Z_INDEX = {
  background: 0,
  paper: 0,
  grain: 0,
  vignette: 10,
  strings: 20,
  cards: 30,
  bulb: 40,
  darkOverlay: 35,
  modal: {
    backdrop: 200,
    content: 201,
  },
  pin: 20,
  thumbtack: 20,
} as const;

/**
 * Transition durations
 */
export const TRANSITIONS = {
  default: "all 150ms ease-in-out",
  slow: "all 300ms ease-in-out",
  fast: "all 100ms ease-in-out",
} as const;

/**
 * Opacity values
 */
export const OPACITIES = {
  full: 1,
  almostFull: 0.95,
  high: 0.85,
  medium: 0.7,
  low: 0.5,
  veryLow: 0.25,
  minimal: 0.08,
  stamp: 0.06,
} as const;

/**
 * Modal styling
 */
export const MODAL_STYLES = {
  background: "linear-gradient(135deg, #f2e6c9 0%, #e6d5ac 50%, #d4c49a 100%)",
  tabBackground: "linear-gradient(135deg, #f2e6c9, #e6d5ac)",
  paperBg: "linear-gradient(180deg, #faf8f0 0%, #f5f0e0 100%)",
  borderColor: "#5a3e28",
} as const;

/**
 * Animation configurations
 */
export const ANIMATIONS = {
  card: {
    entrance: {
      initial: { opacity: 0, y: -80, scale: 0.8 },
      animate: { opacity: 1, y: 0, scale: 1 },
    },
  },
  modal: {
    initial: { opacity: 0, scale: 0.8, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  },
  listItem: {
    staggerDelay: 0.08,
  },
} as const;

/**
 * Bulb effect styling
 */
export const BULB_STYLES = {
  lightPool: `
    radial-gradient(circle 500px at 90% 10%, rgba(255,230,160,0.22) 0%, transparent 100%),
    radial-gradient(circle 200px at 90% 10%, rgba(255,255,255,0.15) 0%, transparent 100%)
  `,
  glassGradientOn:
    "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 100%)",
  glassGradientOff:
    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 100%)",
  glassGlow: `
    inset 0 0 10px rgba(255,255,255,0.5),
    0 0 15px 8px rgba(255,210,80,0.7),
    0 0 60px 30px rgba(255,180,40,0.25)
  `,
  glassGlowOff: "inset 0 0 10px rgba(255,255,255,0.1)",
} as const;

/**
 * Spacing values (in pixels)
 */
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
} as const;

/**
 * Border radius values
 */
export const BORDER_RADIUS = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  full: "50%",
} as const;

/**
 * Visual effects and overlays
 */
export const EFFECTS = {
  grain: {
    baseFrequency: 0.9,
    numOctaves: 4,
    opacity: 0.03,
    color: "rgba(0,0,0,0.02)",
  },
  vignette:
    "radial-gradient(ellipse at center, transparent 0%, rgba(85,65,45,0.15) 100%)",
  lightPool: `
    radial-gradient(circle 500px at 90% 10%, rgba(255,230,160,0.22) 0%, transparent 100%),
    radial-gradient(circle 200px at 90% 10%, rgba(255,255,255,0.15) 0%, transparent 100%)
  `,
  darkOverlay: "rgba(5, 4, 3, 0.85)",
} as const;
