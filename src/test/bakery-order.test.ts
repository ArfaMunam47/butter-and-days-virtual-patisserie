import { describe, expect, it } from "vitest";
import { ALL_ITEMS, BOX_TREAT_CAPACITY, PASTRIES } from "@/data/products";
import { canAddTreat, getBoxTotal, groupBoxLines, type BoxTreat } from "@/lib/bakery-order";

describe("Butter & Days menu and box totals", () => {
  it("offers the requested 19 named bakery treats alongside the original menu", () => {
    expect(PASTRIES.length).toBeGreaterThanOrEqual(19);
    expect(new Set(PASTRIES.map((item) => item.id)).size).toBe(PASTRIES.length);
  });

  it("adds the chosen Cloud Cream price to a pastry total", () => {
    const treat: BoxTreat = { uid: "one", productId: "butter-croissant", toppingId: "cloud-cream" };
    expect(getBoxTotal([treat])).toBe(5.75);
  });

  it("groups identical treats and toppings at their combined unit price", () => {
    const treats: BoxTreat[] = [
      { uid: "one", productId: "choc-cookie", toppingId: "chocolate-silk" },
      { uid: "two", productId: "choc-cookie", toppingId: "chocolate-silk" },
    ];
    expect(groupBoxLines(treats)).toEqual([
      expect.objectContaining({ qty: 2, unitPrice: 6, topping: ALL_ITEMS["chocolate-silk"] }),
    ]);
  });

  it("stops accepting treats at the configured box capacity", () => {
    const fullBox = Array.from({ length: BOX_TREAT_CAPACITY }, (_, index) => ({
      uid: String(index),
      productId: "butter-croissant",
      toppingId: null,
    }));
    expect(canAddTreat(fullBox)).toBe(false);
  });
});