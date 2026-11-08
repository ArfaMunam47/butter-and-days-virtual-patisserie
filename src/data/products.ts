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
import chocolateCroissant from "@/assets/chocolate-croissant.png";
import cinnamonDanish from "@/assets/cinnamon-danish.png";
import almondCroissant from "@/assets/almond-croissant.png";
import doubleChocolateCookie from "@/assets/double-chocolate-cookie.png";
import redVelvetCookie from "@/assets/red-velvet-cookie.png";
import whiteChocolateCookie from "@/assets/white-chocolate-cookie.png";
import oreoCookie from "@/assets/oreo-cookie.png";
import chocolateCake from "@/assets/chocolate-cake-slice.png";
import vanillaCupcake from "@/assets/vanilla-cupcake.png";
import redVelvetCupcake from "@/assets/red-velvet-cupcake.png";
import cheesecake from "@/assets/strawberry-cheesecake.png";
import butterBiscuit from "@/assets/butter-biscuit.png";
import shortbread from "@/assets/shortbread-cookie.png";
import chocolateBiscuit from "@/assets/chocolate-biscuit.png";
import cinnamonBiscuit from "@/assets/cinnamon-biscuit.png";

export type BakeryCategory = "Croissants & Pastries" | "Cookies" | "Cakes & Desserts" | "Biscuits & Small Treats";
export type BakerySize = "small" | "medium" | "large";

export interface BakeryItem {
  id: string;
  name: string;
  price: number;
  image: string;
  blurb: string;
  kind: "pastry" | "topping";
  category?: BakeryCategory;
  size?: BakerySize;
}

export const CATEGORIES: BakeryCategory[] = ["Croissants & Pastries", "Cookies", "Cakes & Desserts", "Biscuits & Small Treats"];

// Prices for newly introduced treats are suggested demo prices; existing prices remain unchanged.
export const PASTRIES: BakeryItem[] = [
  { id: "butter-croissant", name: "Butter Croissant", price: 4.5, image: butterCroissant, blurb: "72 layers of butter. Yes, 72.", kind: "pastry", category: CATEGORIES[0], size: "large" },
  { id: "chocolate-croissant", name: "Chocolate Croissant", price: 5, image: chocolateCroissant, blurb: "Buttery folds with a dark chocolate heart.", kind: "pastry", category: CATEGORIES[0], size: "large" },
  { id: "strawberry-danish", name: "Strawberry Danish", price: 6, image: strawberryDanish, blurb: "Glazed berries on vanilla cream.", kind: "pastry", category: CATEGORIES[0], size: "large" },
  { id: "cinnamon-danish", name: "Cinnamon Danish", price: 5.5, image: cinnamonDanish, blurb: "Flaky layers wrapped around cinnamon sugar.", kind: "pastry", category: CATEGORIES[0], size: "large" },
  { id: "almond-croissant", name: "Almond Croissant", price: 5.5, image: almondCroissant, blurb: "Toasted almonds, tucked into buttery pastry.", kind: "pastry", category: CATEGORIES[0], size: "large" },
  { id: "cinnamon-swirl", name: "Cinnamon Swirl", price: 5.5, image: cinnamonSwirl, blurb: "Hand-rolled, glazed while warm.", kind: "pastry", category: CATEGORIES[0], size: "medium" },
  { id: "cinnamon-knot", name: "Cinnamon Knot", price: 5.5, image: cinnamonKnot, blurb: "Knotted the old-fashioned way.", kind: "pastry", category: CATEGORIES[0], size: "medium" },
  { id: "choc-knot", name: "Chocolate Knot", price: 5, image: chocKnot, blurb: "Twisted with dark cocoa ribbons.", kind: "pastry", category: CATEGORIES[0], size: "medium" },
  { id: "cream-cruller", name: "Cream Cruller", price: 5, image: creamCruller, blurb: "Airy choux, vanilla glaze.", kind: "pastry", category: CATEGORIES[0], size: "medium" },
  { id: "choc-cookie", name: "Chocolate Chip Cookie", price: 3.5, image: chocCookie, blurb: "Crisp edge, soft center.", kind: "pastry", category: CATEGORIES[1], size: "medium" },
  { id: "double-chocolate-cookie", name: "Double Chocolate Cookie", price: 4, image: doubleChocolateCookie, blurb: "Deep cocoa with chocolate chunks.", kind: "pastry", category: CATEGORIES[1], size: "medium" },
  { id: "red-velvet-cookie", name: "Red Velvet Cookie", price: 4, image: redVelvetCookie, blurb: "Velvety cocoa with white chocolate.", kind: "pastry", category: CATEGORIES[1], size: "medium" },
  { id: "white-chocolate-cookie", name: "White Chocolate Cookie", price: 4.25, image: whiteChocolateCookie, blurb: "Golden, buttery and dotted with white chocolate.", kind: "pastry", category: CATEGORIES[1], size: "medium" },
  { id: "oreo-cookie", name: "Oreo Cookie", price: 4.25, image: oreoCookie, blurb: "Cocoa cookie with crunchy chocolate pieces.", kind: "pastry", category: CATEGORIES[1], size: "medium" },
  { id: "mini-berry-cake", name: "Strawberry Mini Cake", price: 7, image: miniBerryCake, blurb: "Strawberry buttercream, one candle.", kind: "pastry", category: CATEGORIES[2], size: "large" },
  { id: "chocolate-cake-slice", name: "Chocolate Cake Slice", price: 7.5, image: chocolateCake, blurb: "Dark chocolate layers, softly whipped.", kind: "pastry", category: CATEGORIES[2], size: "large" },
  { id: "vanilla-cupcake", name: "Vanilla Cupcake", price: 5.5, image: vanillaCupcake, blurb: "Vanilla sponge with a cloud of buttercream.", kind: "pastry", category: CATEGORIES[2], size: "medium" },
  { id: "red-velvet-cupcake", name: "Red Velvet Cupcake", price: 5.75, image: redVelvetCupcake, blurb: "Red cocoa sponge with cream cheese frosting.", kind: "pastry", category: CATEGORIES[2], size: "medium" },
  { id: "strawberry-cheesecake", name: "Strawberry Cheesecake", price: 7.5, image: cheesecake, blurb: "Creamy cheesecake, bright strawberry glaze.", kind: "pastry", category: CATEGORIES[2], size: "large" },
  { id: "butter-biscuits", name: "Butter Biscuits", price: 2.5, image: butterBiscuit, blurb: "Crumbly, buttery little classics.", kind: "pastry", category: CATEGORIES[3], size: "small" },
  { id: "shortbread-cookies", name: "Shortbread Cookies", price: 2.75, image: shortbread, blurb: "Tender Scottish-style shortbread.", kind: "pastry", category: CATEGORIES[3], size: "small" },
  { id: "chocolate-biscuits", name: "Chocolate Biscuits", price: 3, image: chocolateBiscuit, blurb: "A crisp little cocoa treat.", kind: "pastry", category: CATEGORIES[3], size: "small" },
  { id: "cinnamon-biscuits", name: "Cinnamon Biscuits", price: 2.75, image: cinnamonBiscuit, blurb: "Warm spice in every buttery bite.", kind: "pastry", category: CATEGORIES[3], size: "small" },
];

export const TOPPINGS: BakeryItem[] = [
  { id: "cloud-cream", name: "Cloud Cream", price: 1.25, image: teapotCream, blurb: "A soft cloud of whipped cream.", kind: "topping" },
  { id: "chocolate-silk", name: "Chocolate Silk", price: 2.5, image: teapotChoc, blurb: "Warm, glossy pouring chocolate.", kind: "topping" },
  { id: "pistachio-cream", name: "Pistachio Cream", price: 2.5, image: teapotPistachio, blurb: "Roasted pistachio, silky smooth.", kind: "topping" },
];

export const ALL_ITEMS: Record<string, BakeryItem> = Object.fromEntries([...PASTRIES, ...TOPPINGS].map((item) => [item.id, item]));
export const BOX_TREAT_CAPACITY = 8;
export const PINK_BAG = pinkBag;
export const fmt = (n: number) => `$${n.toFixed(2)}`;