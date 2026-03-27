/**
 * @file Configuration constants for portfolio app
 * Includes metadata, animation configs, and feature flags
 */

/**
 * Portfolio metadata for SEO and display
 */
export const PORTFOLIO_META = {
  title: "Portfolio 2025 - Nocturnal Artist",
  description:
    "Creative portfolio showcasing graphic design, videography, and photography work",
  author: "Jomel",
  year: new Date().getFullYear(),
  tagline: "Joml The Mind Behind",
  caseFileNumber: "#107",
} as const;

/**
 * Animation timing constants (in milliseconds)
 */
export const ANIMATION_TIMINGS = {
  // Initial entrance delays
  bannerDelay: 0.2,
  caseFileDelay: 0.4,
  cardEntryDelay: 0.5,
  cardStaggerDelay: 0.1,

  // Transition durations
  modalEnter: 0.3,
  cardEnter: 0.5,
  fadeTransition: 0.3,

  // Physics timings
  dragStartScale: 0.05,
  pinUpdateInterval: 16, // 60fps
  layoutUpdateWindow: 3000, // 3 seconds for initial layout

  // Debounce timings
  resizeDebounce: 100,
} as const;

/**
 * Drag physics configuration
 */
export const DRAG_CONFIG = {
  // Minimum distance to register as a drag (in pixels)
  dragThreshold: 5,

  // Velocity multiplier for rotation tilt
  velocityMultiplier: 2,

  // Rotation limits (in degrees)
  maxTilt: 15,
  minTilt: -15,

  // Spring configurations
  springTension: 200,
  springFriction: 20,
  snapBackTension: 300,
  snapBackFriction: 15,

  // Scale during drag
  dragScale: 1.05,
} as const;

/**
 * String physics configuration
 */
export const STRING_CONFIG = {
  // Sag multiplier (how much the string bows)
  sagMultiplier: 0.4,

  // String width/thickness
  strokeWidth: 1.5,

  // Spring tensions for different states
  springTension: {
    idle: 200,
    pulled: 500,
    release: 300,
  },

  // Spring friction
  springFriction: {
    idle: 8,
    pulled: 30,
    release: 6,
  },

  // String mass for momentum
  springMass: {
    idle: 1,
    release: 1.5,
  },

  // Drag threshold for playing sound
  dragSoundThreshold: 10,

  // Pull state configuration
  pullDragThreshold: 10,
  pullVelocityFactor: 0.3,
} as const;

/**
 * Bulb interaction configuration
 */
export const BULB_CONFIG = {
  // Pull threshold to toggle light (in pixels)
  toggleThreshold: 60,

  // Resistance factor when pulling
  pullResistance: 0.4,

  // Spring animation config
  springTension: 350,
  springFriction: 25,

  // Cord max extension
  maxExtension: 80,
} as const;

/**
 * Sound effect configuration
 */
export const SOUND_CONFIG = {
  // Audio context sample rate
  sampleRate: 44100,

  // String twang frequencies
  twang: {
    baseLow: 80,
    baseHigh: 300,
    intensityFactor: 300,
    duration: 0.3,
  },

  // Oscillator type
  oscillatorType: "triangle" as const,

  // Filter configuration
  filter: {
    type: "lowpass" as const,
    initialFreq: 800,
    finalFreq: 200,
    duration: 0.2,
  },

  // Gain envelope
  gain: {
    initial: 0.15,
    intensityFactor: 1,
    duration: 0.25,
  },
} as const;

/**
 * Feature flags for experimental features
 */
export const FEATURE_FLAGS = {
  // Enable sound effects (can be toggled by user preference)
  soundEnabled: true,

  // Enable drag functionality
  dragEnabled: true,

  // Enable light interaction
  lightToggleEnabled: true,

  // Enable string physics
  stringPhysicsEnabled: true,

  // Enable lazy loading for media
  lazyLoadMedia: true,

  // Enable performance monitoring
  performanceMonitoring: false,
} as const;

/**
 * Viewport configuration
 */
export const VIEWPORT_CONFIG = {
  // Board update frequency
  updateFrequency: 60, // fps

  // Resize observer debounce
  resizeDebounce: 100, // ms

  // Animation frame loop duration
  loopDuration: 3000, // ms

  // Intersection observer threshold for lazy loading
  lazyLoadThreshold: 0.1,
} as const;

/**
 * Modal configuration
 */
export const MODAL_CONFIG = {
  // Maximum modal width
  maxWidth: "56rem", // 896px

  // Padding inside modal
  padding: "1.5rem", // 24px

  // Min height for scrollable content
  minHeight: "420px",

  // Max height relative to viewport
  maxHeight: "85vh",

  // Backdrop blur amount
  backdropBlur: "blur(4px)",

  // Backdrop opacity
  backdropOpacity: 0.6,
} as const;

/**
 * SEO and accessibility configuration
 */
export const SEO_CONFIG = {
  // Heading levels for semantic HTML
  headingLevels: {
    main: "h1",
    section: "h2",
    subsection: "h3",
  },

  // ARIA labels
  ariaLabels: {
    modalClose: "Close case file",
    bulbToggle: "Toggle ambient light",
    cardDraggable: "Draggable case file card",
  },

  // Color contrast ratios (WCAG AA)
  contrast: {
    normal: "4.5:1",
    large: "3:1",
  },

  // Focus outline width
  focusOutlineWidth: "2px",
} as const;

/**
 * Performance configuration
 */
export const PERFORMANCE_CONFIG = {
  // Enable request animation frame batching
  batchRAF: true,

  // Lazy load images after delay
  lazyLoadDelay: 1000, // ms

  // Preload critical images
  preloadImages: true,

  // Cache DOM queries
  cacheDOM: true,

  // Debounce resize events
  debounceResize: true,
} as const;
