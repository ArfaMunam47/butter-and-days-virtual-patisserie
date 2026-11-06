import { motion } from "motion/react";
import { fmt, TOPPINGS, type BakeryItem } from "@/data/products";

interface TeapotCollectionProps {
  onPour: (topping: BakeryItem, e: React.MouseEvent<HTMLButtonElement>) => void;
  pouringId: string | null;
}

/**
 * Three pastel pour-jugs — click one and it tips a topping into your box.
 */
export function TeapotCollection({ onPour, pouringId }: TeapotCollectionProps) {
  return (
    <div className="flex items-end justify-center gap-2 lg:gap-3 sm:gap-4">
      {TOPPINGS.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-label={`Pour ${t.name} into your box (+${fmt(t.price)})`}
          onClick={(e) => onPour(t, e)}
          className="group flex w-[72px] flex-col items-center focus:outline-none sm:w-[92px] lg:w-[84px]"
        >
          <motion.img
            src={t.image}
            alt={t.name}
            width={1024}
            height={1024}
            loading="lazy"
            draggable={false}
            animate={pouringId === t.id ? { rotate: [0, -30, 0], y: [0, -8, 0] } : { rotate: 0, y: 0 }}
            transition={
              pouringId === t.id
                ? { duration: 0.9, ease: "easeInOut" }
                : { type: "spring", stiffness: 220, damping: 15 }
            }
            whileHover={{ y: -5, scale: 1.08 }}
            className="h-[74px] w-[74px] cursor-pointer object-contain drop-shadow-[0_6px_10px_rgba(93,33,64,0.28)] sm:h-[92px] sm:w-[92px] lg:h-[84px] lg:w-[84px]"
          />
          <span className="mt-1.5 rounded-full border border-blush/70 bg-cream/95 px-2 py-1 text-center shadow-sm transition-colors group-hover:border-berry/40">
            <span className="block whitespace-nowrap font-display text-[11px] font-semibold leading-tight text-berry sm:text-[12px]">
              {t.name}
            </span>
            <span className="block text-[10px] leading-tight text-cocoa">+{fmt(t.price)}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
