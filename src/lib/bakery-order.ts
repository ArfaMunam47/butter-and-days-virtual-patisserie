import { ALL_ITEMS, BOX_TREAT_CAPACITY, type BakeryItem } from "@/data/products";

export interface BoxTreat {
  uid: string;
  productId: string;
  toppingId: string | null;
}

export interface OrderLine {
  id: string;
  item: BakeryItem;
  topping: BakeryItem | null;
  qty: number;
  unitPrice: number;
}

export function getTreatPrice(treat: BoxTreat): number {
  return (ALL_ITEMS[treat.productId]?.price ?? 0) + (treat.toppingId ? ALL_ITEMS[treat.toppingId]?.price ?? 0 : 0);
}

export function getBoxTotal(treats: BoxTreat[]): number {
  return treats.reduce((total, treat) => total + getTreatPrice(treat), 0);
}

export function groupBoxLines(treats: BoxTreat[]): OrderLine[] {
  const grouped = new Map<string, OrderLine>();
  for (const treat of treats) {
    const item = ALL_ITEMS[treat.productId];
    if (!item) continue;
    const topping = treat.toppingId ? ALL_ITEMS[treat.toppingId] ?? null : null;
    const id = `${treat.productId}:${treat.toppingId ?? "none"}`;
    const line = grouped.get(id);
    if (line) line.qty += 1;
    else grouped.set(id, { id, item, topping, qty: 1, unitPrice: item.price + (topping?.price ?? 0) });
  }
  return [...grouped.values()];
}

export function canAddTreat(treats: BoxTreat[]): boolean {
  return treats.length < BOX_TREAT_CAPACITY;
}