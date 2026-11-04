import cinnamonSwirl from "@/assets/cinnamon-swirl.png";
import chocCookie from "@/assets/choc-cookie.png";
import butterCroissant from "@/assets/butter-croissant.png";
import chocKnot from "@/assets/choc-knot.png";
import cinnamonKnot from "@/assets/cinnamon-knot.png";
import strawberryDanish from "@/assets/strawberry-danish.png";
import creamCruller from "@/assets/cream-cruller.png";
import miniBerryCake from "@/assets/mini-berry-cake.png";
import teapotCream from "@/assets/teapot-cream.png";
import teapotChoc from "@/assets/teapot-choc.png";
import teapotPistachio from "@/assets/teapot-pistachio.png";
import pinkBag from "@/assets/pink-bag.png";

export interface BakeryItem {
  id: string;
  name: string;
  price: number;
  image: string;
  blurb: string;
  kind: "pastry" | "topping";
}

export const PASTRIES: BakeryItem[] = [
  { id: "cinnamon-swirl", name: "Cinnamon Swirl", price: 5.5, image: cinnamonSwirl, blurb: "Hand-rolled, glazed while warm.", kind: "pastry" },
  { id: "choc-cookie", name: "Chocolate Chip Cookie", price: 3.5, image: chocCookie, blurb: "Crisp edge, soft center.", kind: "pastry" },
  { id: "butter-croissant", name: "Butter Croissant", price: 4.5, image: butterCroissant, blurb: "72 layers of butter. Yes, 72.", kind: "pastry" },
  { id: "cinnamon-knot", name: "Cinnamon Knot", price: 5.5, image: cinnamonKnot, blurb: "Knotted the old-fashioned way.", kind: "pastry" },
  { id: "strawberry-danish", name: "Strawberry Danish", price: 6.0, image: strawberryDanish, blurb: "Glazed berries on vanilla cream.", kind: "pastry" },
  { id: "choc-knot", name: "Chocolate Knot", price: 5.0, image: chocKnot, blurb: "Twisted with dark cocoa ribbons.", kind: "pastry" },
  { id: "cream-cruller", name: "Cream Cruller", price: 5.0, image: creamCruller, blurb: "Airy choux, vanilla glaze.", kind: "pastry" },
  { id: "mini-berry-cake", name: "Mini Berry Cake", price: 7.0, image: miniBerryCake, blurb: "Strawberry buttercream, one candle.", kind: "pastry" },
];

export const TOPPINGS: BakeryItem[] = [
  { id: "cloud-cream", name: "Cloud Cream", price: 1.25, image: teapotCream, blurb: "A soft cloud of whipped cream.", kind: "topping" },
  { id: "chocolate-silk", name: "Chocolate Silk", price: 2.5, image: teapotChoc, blurb: "Warm, glossy pouring chocolate.", kind: "topping" },
  { id: "pistachio-cream", name: "Pistachio Cream", price: 2.5, image: teapotPistachio, blurb: "Roasted pistachio, silky smooth.", kind: "topping" },
];

export const ALL_ITEMS: Record<string, BakeryItem> = Object.fromEntries(
  [...PASTRIES, ...TOPPINGS].map((item) => [item.id, item]),
);

export const PINK_BAG = pinkBag;

export const fmt = (n: number) => `$${n.toFixed(2)}`;
