/**
 * Zone.js configuration flags
 * These flags must be set before zone.js is loaded
 */

// Unpatch wheel and mousewheel events to allow passive listeners
// This prevents zone.js from wrapping these events, allowing libraries
// (like Angular Material) to add them as passive listeners for better performance
(window as any).__zone_symbol__UNPATCHED_EVENTS = ['wheel', 'mousewheel'];

