import { useEffect } from "react";
import { motion, useAnimationControls } from "motion/react";
import { CATEGORIES, fmt, PASTRIES, type BakeryCategory, type BakeryItem } from "@/data/products";
import { DraggablePastry } from "./DraggablePastry";

interface GlassDisplayProps {
  onGrab: (item: BakeryItem, e: React.PointerEvent) => void;
  pulse: number;
  className?: string;
  category: BakeryCategory;
  onCategoryChange: (category: BakeryCategory) => void;
}

export function GlassDisplay({ onGrab, pulse, className, category, onCategoryChange }: GlassDisplayProps) {
  const controls = useAnimationControls();
  useEffect(() => {
    if (pulse > 0) controls.start({ scale: [1, 1.012, 1], transition: { duration: 0.5, ease: "easeInOut" } });
  }, [pulse, controls]);
  const items = PASTRIES.filter((item) => item.category === category);

  return (
    <div className={className}>
      <motion.div animate={controls} className="relative h-full w-full overflow-hidden" style={{ borderRadius: "46% 46% 1.4rem 1.4rem / 20% 20% 1.4rem 1.4rem", border: "10px solid var(--berry)", boxShadow: "0 26px 44px -18px oklch(0.348 0.095 351.1 / 0.45), inset 0 0 0 2px oklch(1 0 0 / 0.35)" }}>
        <div className="case-glass absolute inset-0 overflow-hidden" style={{ borderRadius: "44% 44% 1rem 1rem / 19% 19% 0.9rem 0.9rem" }}>
          <div className="case-shelf absolute inset-x-2 top-[34%] h-[7px] rounded-full" />
          <div className="case-shelf absolute inset-x-2 top-[67%] h-[7px] rounded-full" />
          <div className="absolute inset-x-6 top-[35%] h-4 rounded-full bg-white/40 blur-md" />
          <div className="absolute inset-x-6 top-[68%] h-4 rounded-full bg-white/40 blur-md" />
        </div>
        <div className="absolute inset-x-0 top-[9%] z-[4] flex justify-center gap-1.5 px-3 sm:gap-2">
          {CATEGORIES.map((label) => (
            <button key={label} type="button" aria-pressed={category === label} onClick={() => onCategoryChange(label)} className={`rounded-full border px-2.5 py-1 font-display text-[11px] font-semibold leading-tight shadow-sm transition sm:px-3 sm:text-[12px] ${category === label ? "border-berry bg-berry text-cream" : "border-blush bg-cream/95 text-berry hover:border-berry/60"}`}>
              {label === "Croissants & Pastries" ? "Pastries" : label === "Cakes & Desserts" ? "Cakes" : label === "Biscuits & Small Treats" ? "Biscuits" : label}
            </button>
          ))}
        </div>
        <div className="absolute inset-x-4 bottom-[7%] top-[22%] z-[2] grid grid-cols-3 grid-rows-2 gap-x-1 gap-y-2 sm:inset-x-8 sm:gap-x-3">
          {items.map((item, index) => {
            const shelf = index < 3 ? "top-[34%]" : "top-[67%]";
            return (
              <div key={item.id} className={`relative z-[2] flex min-w-0 flex-col items-center justify-end ${index < 3 ? "pb-2" : "pb-1"} ${shelf}`}>
                <DraggablePastry item={item} size={item.size === "large" ? 75 : item.size === "small" ? 56 : 66} onGrab={onGrab} />
                <div className="mt-0.5 max-w-full rounded border border-blush/70 bg-white/95 px-1.5 py-1 text-center shadow-sm">
                  <div className="max-w-[120px] text-balance font-display text-[10px] font-semibold leading-tight text-berry sm:text-[11px]">{item.name}</div>
                  <div className="mt-0.5 text-[9px] leading-none text-cocoa">{fmt(item.price)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      <div className="absolute right-[-18px] top-1/2 hidden h-16 w-2.5 -translate-y-1/2 rounded-full bg-berry-deep shadow-md lg:block" />
    </div>
  );
}