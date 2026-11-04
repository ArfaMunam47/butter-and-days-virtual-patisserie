import { motion } from "motion/react";
import { fmt, type BakeryItem } from "@/data/products";

interface DraggablePastryProps {
  item: BakeryItem;
  size?: number;
  onGrab?: (item: BakeryItem, e: React.PointerEvent) => void;
}

/**
 * A pastry sitting in the glass case. Press-and-hold to drag it to your box;
 * a quick tap adds it straight to the box (touch friendly).
 */
export function DraggablePastry({ item, size = 84, onGrab }: DraggablePastryProps) {
  return (
    <div
      role="button"
      aria-label={`${item.name}, ${fmt(item.price)} — drag to your box or tap to add`}
      className="group relative cursor-grab touch-none select-none active:cursor-grabbing"
      style={{ width: size, height: size }}
      onPointerDown={(e) => {
        e.preventDefault();
        onGrab?.(item, e);
      }}
    >
      <motion.img
        src={item.image}
        alt={item.name}
        width={1024}
        height={1024}
        loading="lazy"
        draggable={false}
        className="relative z-[2] h-full w-full object-contain drop-shadow-[0_7px_8px_rgba(93,33,64,0.28)]"
        whileHover={{ scale: 1.12, y: -5 }}
        whileTap={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
      />
      {/* Hover label: name, price, and a little encouragement */}
      <div className="pointer-events-none absolute bottom-[calc(100%-6px)] left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded-2xl bg-cream/95 px-3 py-1.5 text-center opacity-0 shadow-lg ring-1 ring-blush/70 backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-2 group-hover:opacity-100">
        <div className="whitespace-nowrap font-display text-[13px] font-semibold leading-tight text-berry">
          {item.name} · {fmt(item.price)}
        </div>
        <div className="whitespace-nowrap text-[10px] leading-tight text-cocoa/80">
          Drag me to your bag
        </div>
      </div>
    </div>
  );
}
