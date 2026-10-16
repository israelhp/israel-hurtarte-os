import { describe, expect, it } from "vitest";
import { tourGeometry } from "./geometry";

const VW = 1440;
const VH = 900;

describe("tourGeometry", () => {
  it("centers the card over a fully dimmed screen when there is no target", () => {
    const g = tourGeometry(null, VW, VH);
    expect(g).toMatchObject({
      hasSpot: false,
      clip: "none",
      dimClass: "full",
      cardClass: "center",
    });
  });

  it("puts the card below a target near the top and cuts a hole around the target", () => {
    const g = tourGeometry({ x: 100, y: 50, w: 200, h: 40 }, VW, VH);
    expect(g.hasSpot).toBe(true);
    expect(g.cardClass).toBe("");
    expect(g.cardY).toBe(50 + 40 + 14);
    expect(g.clip).toContain("polygon(evenodd");
    expect(g.clip).toContain("100px 50px");
    expect(g.clip).toContain("300px 90px");
  });

  it("puts the card above a target near the bottom (the Dock)", () => {
    const g = tourGeometry({ x: 500, y: 810, w: 440, h: 80 }, VW, VH);
    expect(g.cardClass).toBe("above");
    expect(g.cardY).toBe(810 - 14);
  });

  it("keeps the card inside the viewport horizontally", () => {
    const left = tourGeometry({ x: 0, y: 50, w: 40, h: 40 }, VW, VH);
    expect(left.cardX).toBeGreaterThanOrEqual(16);
    const right = tourGeometry({ x: VW - 40, y: 50, w: 40, h: 40 }, VW, VH);
    expect(right.cardX + right.cardW).toBeLessThanOrEqual(VW - 16);
  });

  it("shrinks the card on narrow screens", () => {
    expect(tourGeometry(null, 320, 600).cardW).toBe(320 - 32);
    expect(tourGeometry(null, 1440, 900).cardW).toBe(340);
  });

  it("clamps a spotlight that sticks out of the viewport", () => {
    const g = tourGeometry({ x: -30, y: -30, w: 5000, h: 5000 }, VW, VH);
    expect(g.ring.x).toBeGreaterThanOrEqual(2);
    expect(g.ring.x + g.ring.w).toBeLessThanOrEqual(VW);
    expect(g.ring.y + g.ring.h).toBeLessThanOrEqual(VH);
  });
});
