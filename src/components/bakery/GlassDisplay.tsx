import { useEffect } from "react";
import { motion, useAnimationControls } from "motion/react";
import { ALL_ITEMS, fmt, type BakeryItem } from "@/data/products";
import { DraggablePastry } from "./DraggablePastry";

interface GlassDisplayProps {
  onGrab: (item: BakeryItem, e: React.PointerEvent) => void;
  pulse: number;
  className?: string;
}

interface Slot {
  id: string;
  x: number; // % from left
  y: number; // % from top — the surface the pastry sits on
  size: number;
  labeled?: boolean;
}

const SLOTS: Slot[] = [
  { id: "cinnamon-swirl", x: 21, y: 37, size: 82, labeled: true },
  { id: "choc-cookie", x: 50, y: 37, size: 82, labeled: true },
  { id: "butter-croissant", x: 79, y: 37, size: 90, labeled: true },
  { id: "cinnamon-knot", x: 21, y: 69, size: 82, labeled: true },
  { id: "strawberry-danish", x: 50, y: 69, size: 84, labeled: true },
  { id: "choc-knot", x: 79, y: 69, size: 82, labeled: true },
  { id: "cream-cruller", x: 10, y: 92, size: 58 },
  { id: "mini-berry-cake", x: 90, y: 92, size: 58 },
];

function ProductLabel({ name, price }: { name: string; price: number }) {
  return (
    <div className="pointer-events-none absolute left-1/2 z-[3] -translate-x-1/2 rounded-md border border-blush/70 bg-white/95 px-2.5 py-1 text-center shadow-[0_2px_5px_rgba(93,33,64,0.18)]">
      <div className="whitespace-nowrap font-display text-[12px] font-semibold leading-none text-berry">
        {name}
      </div>
      <div className="mt-0.5 text-[10px] leading-none text-cocoa">{fmt(price)}</div>
    </div>
  );
}

/**
 * The arched glass bakery display case: berry metal frame, two shelves,
 * white plates, small name + price labels.
 */
export function GlassDisplay({ onGrab, pulse, className }: GlassDisplayProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (pulse > 0) {
      controls.start({
        scale: [1, 1.015, 1],
        transition: { duration: 0.55, ease: "easeInOut" },
      });
    }
  }, [pulse, controls]);

  return (
    <div className={className}>
      <motion.div
        animate={controls}
        className="relative h-full w-full"
        style={{
          borderRadius: "46% 46% 1.4rem 1.4rem / 26% 26% 1.4rem 1.4rem",
          border: "10px solid var(--berry)",
          boxShadow:
            "0 26px 44px -18px rgba(93,33,64,0.45), inset 0 0 0 2px rgba(255,255,255,0.35)",
        }}
      >
        {/* Glass */}
        <div
          className="case-glass absolute inset-0 overflow-hidden"
          style={{ borderRadius: "44% 44% 1rem 1rem / 25% 25% 0.9rem 0.9rem" }}
        >
          {/* Shelves */}
          <div className="case-shelf absolute inset-x-2 top-[37%] h-[7px] rounded-full" />
          <div className="case-shelf absolute inset-x-2 top-[69%] h-[7px] rounded-full" />
          {/* Under-shelf glow */}
          <div className="absolute inset-x-6 top-[38%] h-4 rounded-full bg-white/40 blur-md" />
          <div className="absolute inset-x-6 top-[70%] h-4 rounded-full bg-white/40 blur-md" />
        </div>

        {/* Pastries on their plates */}
        {SLOTS.map((slot) => {
          const item = ALL_ITEMS[slot.id];
          if (!item) return null;
          return (
            <div key={slot.id}>
              <div
                className="case-plate absolute z-[1] h-[14px] w-[112px] rounded-[50%]"
                style={{ left: `${slot.x}%`, top: `calc(${slot.y}% - 5px)`, transform: "translate(-50%,-50%)" }}
              />
              <div
                className="absolute z-[2]"
                style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: "translate(-50%,-97%)" }}
              >
                <DraggablePastry item={item} size={slot.size} onGrab={onGrab} />
              </div>
              {slot.labeled && (
                <div
                  className="absolute z-[3]"
                  style={{ left: `${slot.x}%`, top: `calc(${slot.y}% + 9px)`, transform: "translateX(-50%)" }}
                >
                  <ProductLabel name={item.name} price={item.price} />
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Door handle on the frame */}
      <div className="absolute right-[-18px] top-1/2 hidden h-16 w-2.5 -translate-y-1/2 rounded-full bg-berry-deep shadow-md lg:block" />
    </div>
  );
}
