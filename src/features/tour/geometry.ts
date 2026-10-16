export type Spot = { x: number; y: number; w: number; h: number };

export type TourGeometry = {
  hasSpot: boolean;
  clip: string;
  dimClass: string;
  cardClass: string;
  cardX: number;
  cardY: number;
  cardW: number;
  ring: { x: number; y: number; w: number; h: number };
};

/** Space the card needs below/above the highlighted element (prototype constant). */
const CARD_NEED = 250;
const MARGIN = 16;

/**
 * Where to draw the spotlight, the ring and the card for a highlighted rectangle (ported from the
 * prototype's `tourVals`). With no spot the card is centered over a fully dimmed screen.
 */
export function tourGeometry(spot: Spot | null, vw: number, vh: number): TourGeometry {
  const cardW = Math.min(340, vw - 2 * MARGIN);
  if (!spot)
    return {
      hasSpot: false,
      clip: "none",
      dimClass: "full",
      cardClass: "center",
      cardX: 0,
      cardY: 0,
      cardW,
      ring: { x: 0, y: 0, w: 0, h: 0 },
    };
  const sx = Math.max(2, spot.x);
  const sy = Math.max(2, spot.y);
  const sw = Math.min(spot.w, vw - sx - 2);
  const sh = Math.min(spot.h, vh - sy - 2);
  const clip = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${sx}px ${sy}px, ${sx}px ${sy + sh}px, ${sx + sw}px ${sy + sh}px, ${sx + sw}px ${sy}px, ${sx}px ${sy}px)`;
  let cardX = Math.max(MARGIN, Math.min(sx + sw / 2 - cardW / 2, vw - cardW - MARGIN));
  let cardY: number;
  let cardClass: string;
  if (sy + sh + 14 + CARD_NEED < vh) {
    cardY = sy + sh + 14;
    cardClass = "";
  } else if (sy - 14 - CARD_NEED > 0) {
    cardY = sy - 14;
    cardClass = "above";
  } else {
    cardY = sy + sh - 16;
    cardClass = "above";
    cardX = Math.max(MARGIN, Math.min(sx + sw - cardW - MARGIN, vw - cardW - MARGIN));
  }
  return {
    hasSpot: true,
    clip,
    dimClass: "",
    cardClass,
    cardX: Math.round(cardX),
    cardY: Math.round(cardY),
    cardW,
    ring: { x: sx, y: sy, w: sw, h: sh },
  };
}

/** Padded rectangle of an element, or null when it is missing or has no size. */
export function measure(selector: string | null): Spot | null {
  if (!selector) return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return null;
  const pad = 6;
  return {
    x: Math.round(r.left) - pad,
    y: Math.round(r.top) - pad,
    w: Math.round(r.width) + pad * 2,
    h: Math.round(r.height) + pad * 2,
  };
}
