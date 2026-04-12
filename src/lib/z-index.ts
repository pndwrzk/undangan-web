/**
 * Z-Index Configuration
 * Centralized z-index values to maintain proper layering hierarchy
 * 
 * Layer Structure (from bottom to top):
 * 0-9: Background elements
 * 10-19: Base content layers
 * 20-29: Overlays and decorative elements
 * 30-39: Section content
 * 40-49: Interactive sections
 * 50-59: Modals and overlays
 * 60-69: Floating elements (petals, decorations)
 * 70-79: Navigation elements
 * 80-89: Footer and closing elements
 * 90-99: Bottom navigation
 * 100-109: Music player and controls
 * 110-119: Admin controls and language switcher
 * 120+: Splash screen and full-screen overlays
 */

export const Z_INDEX = {
  // Background layers (0-9)
  BACKGROUND: 0,
  BACKGROUND_OVERLAY: 1,
  BACKGROUND_GRADIENT: 2,
  
  // Base content (10-19)
  BASE_CONTENT: 10,
  TEXT_OVERLAY: 15,
  
  // Decorative elements (20-29)
  TORN_EDGE: 20,
  DECORATIVE_OVERLAY: 25,
  
  // Section content (30-39)
  SECTION_BASE: 30,
  SECTION_CONTENT: 31,
  COUPLE_SECTION: 32,
  
  // Interactive sections (40-59)
  GIFT_SECTION: 40,
  RSVP_SECTION: 50,
  GUESTBOOK_SECTION: 55,
  
  // Floating decorations (60-69)
  PETALS_OVERLAY: 60,
  
  // Footer (80-89)
  FOOTER: 80,
  
  // Navigation (90-99)
  BOTTOM_NAV: 90,
  
  // Controls (100-119)
  MUSIC_PLAYER: 100,
  ADMIN_BUTTON: 110,
  LANGUAGE_SWITCHER: 110,
  
  // Full screen overlays (120+)
  SPLASH_SCREEN: 120,
  MODAL_OVERLAY: 130,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;
