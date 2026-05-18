import { describe, it, expect } from "vitest";
import { formatTimeAgo, getGlucoseColor, DIRECTION_ARROWS, type GlucoseRanges } from "./utils.js";

const DEFAULT_RANGES: GlucoseRanges = {
  urgent_low: 70,
  urgent_high: 200,
  low: 85,
  high: 170,
  color_urgent: "#e74c3c",
  color_warning: "#f39c12",
  color_ok: "#2ecc71",
};

describe("formatTimeAgo", () => {
  const base = new Date("2026-05-16T22:00:00Z").getTime();

  it("returns 'just now' for future timestamps", () => {
    expect(formatTimeAgo("2026-05-16T22:01:00Z", base)).toBe("just now");
  });

  it("returns 'just now' for less than a minute", () => {
    expect(formatTimeAgo("2026-05-16T21:59:30Z", base)).toBe("just now");
  });

  it("returns '1 min ago' for exactly 1 minute", () => {
    expect(formatTimeAgo("2026-05-16T21:59:00Z", base)).toBe("1 min ago");
  });

  it("returns minutes for < 60 minutes", () => {
    expect(formatTimeAgo("2026-05-16T21:45:00Z", base)).toBe("15 min ago");
  });

  it("returns '1 hour ago' for 60-119 minutes", () => {
    expect(formatTimeAgo("2026-05-16T21:00:00Z", base)).toBe("1 hour ago");
  });

  it("returns hours for >= 2 hours", () => {
    expect(formatTimeAgo("2026-05-16T19:00:00Z", base)).toBe("3 hours ago");
  });
});

describe("getGlucoseColor", () => {
  it("returns urgent color below urgent_low", () => {
    expect(getGlucoseColor(55, DEFAULT_RANGES)).toBe("#e74c3c");
  });

  it("returns urgent color above urgent_high", () => {
    expect(getGlucoseColor(250, DEFAULT_RANGES)).toBe("#e74c3c");
  });

  it("returns warning color below low", () => {
    expect(getGlucoseColor(75, DEFAULT_RANGES)).toBe("#f39c12");
  });

  it("returns warning color above high", () => {
    expect(getGlucoseColor(185, DEFAULT_RANGES)).toBe("#f39c12");
  });

  it("returns ok color in normal range", () => {
    expect(getGlucoseColor(120, DEFAULT_RANGES)).toBe("#2ecc71");
  });

  it("returns ok color at exact low boundary", () => {
    expect(getGlucoseColor(85, DEFAULT_RANGES)).toBe("#2ecc71");
  });

  it("returns ok color at exact high boundary", () => {
    expect(getGlucoseColor(170, DEFAULT_RANGES)).toBe("#2ecc71");
  });

  it("returns urgent at exact urgent_low boundary", () => {
    expect(getGlucoseColor(70, DEFAULT_RANGES)).toBe("#f39c12");
  });

  it("returns urgent at exact urgent_high boundary", () => {
    expect(getGlucoseColor(200, DEFAULT_RANGES)).toBe("#f39c12");
  });

  it("works with custom ranges", () => {
    const custom: GlucoseRanges = {
      ...DEFAULT_RANGES,
      low: 90,
      high: 150,
      color_ok: "#00ff00",
    };
    expect(getGlucoseColor(100, custom)).toBe("#00ff00");
    expect(getGlucoseColor(88, custom)).toBe("#f39c12");
  });
});

describe("DIRECTION_ARROWS", () => {
  it("maps all standard Nightscout directions", () => {
    expect(DIRECTION_ARROWS["Flat"]).toBe("→");
    expect(DIRECTION_ARROWS["SingleUp"]).toBe("↑");
    expect(DIRECTION_ARROWS["SingleDown"]).toBe("↓");
    expect(DIRECTION_ARROWS["DoubleUp"]).toBe("⇈");
    expect(DIRECTION_ARROWS["DoubleDown"]).toBe("⇊");
    expect(DIRECTION_ARROWS["FortyFiveUp"]).toBe("↗");
    expect(DIRECTION_ARROWS["FortyFiveDown"]).toBe("↘");
  });
});
