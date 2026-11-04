import { AnimatePresence, motion, type MotionProps } from "motion/react";
import { forwardRef } from "react";
import { ALL_ITEMS } from "@/data/products";
import { cn } from "@/lib/utils";

interface BakeryBoxProps extends MotionProps {
  contents: { uid: string; productId: string }[];
  highlighted: boolean;
  dragActive: boolean;
}

const CONTENT_SLOTS = [
  { x: 27, y: 46, r: -10, s: 70 },
  { x: 50, y: 40, r: 7, s: 72 },
  { x: 73, y: 47, r: 9, s: 70 },
  { x: 35, y: 68, r: 12, s: 68 },
  { x: 58, y: 64, r: -7, s: 70 },
  { x: 72, y: 76, r: -14, s: 66 },
];

/**
 * The branded open bakery box — the drop target for dragged pastries.
 */
export const BakeryBox = forwardRef<HTMLDivElement, BakeryBoxProps>(function BakeryBox(
  { contents, highlighted, dragActive, ...motionProps },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className="relative h-[190px] w-[min(78vw,280px)] cursor-pointer select-none"
      animate={{ scale: highlighted ? 1.045 : 1, y: highlighted ? -3 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      {...motionProps}
    >
      {/* Open lid standing behind */}
      <div className="absolute -top-12 left-1/2 h-[88px] w-[84%] origin-bottom -translate-x-1/2 -rotate-3 rounded-lg border-[3px] border-berry-deep/40 bg-reg-pink-deep shadow-[0_10px_18px_-8px_rgba(93,33,64,0.5)]">
        <div className="flex h-full items-center justify-center">
          <span className="font-display text-lg italic text-cream/85">Butter &amp; Days</span>
        </div>
        <div className="absolute inset-1 rounded bg-gradient-to-b from-white/15 to-transparent" />
      </div>

      {/* Box body */}
      <div className="absolute inset-x-0 bottom-0 top-5 overflow-hidden rounded-b-2xl rounded-t-md border-[3px] border-berry-deep/35 bg-reg-pink shadow-[0_22px_36px_-14px_rgba(93,33,64,0.5)]">
        {/* Cream tissue with the logo pattern */}
        <div className="tissue-pattern absolute inset-1 rounded-b-xl rounded-t-sm shadow-[inset_0_4px_10px_rgba(93,33,64,0.18)]" />
        {/* Embossed logo on the front */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-display text-[13px] font-semibold italic text-berry/35">
          Butter &amp; Days
        </div>
      </div>

      {/* Contents resting on the tissue */}
      <AnimatePresence>
        {contents.map((c, i) => {
          const item = ALL_ITEMS[c.productId];
          const slot = CONTENT_SLOTS[Math.min(i, CONTENT_SLOTS.length - 1)];
          if (!item) return null;
          return (
            <motion.img
              key={c.uid}
              src={item.image}
              alt={item.name}
              width={1024}
              height={1024}
              className="pointer-events-none absolute z-[3] object-contain drop-shadow-[0_5px_6px_rgba(93,33,64,0.3)]"
              style={{ width: slot.s, left: `${slot.x}%`, top: `${slot.y}%` }}
              initial={{ opacity: 0, y: -58, x: "-50%", rotate: slot.r - 22, scale: 0.8 }}
              animate={{ opacity: 1, y: "-50%", x: "-50%", rotate: slot.r, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, y: "-70%" }}
              transition={{ type: "spring", stiffness: 260, damping: 17 }}
            />
          );
        })}
      </AnimatePresence>

      {/* Drop-target highlight */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-3 rounded-[1.6rem] border-[3px] border-dashed border-berry/60 transition-opacity duration-200",
          highlighted ? "opacity-100" : "opacity-0",
        )}
      />
      {dragActive && !highlighted && (
        <div className="pointer-events-none absolute -top-[3.4rem] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-berry px-3 py-1 font-display text-[12px] font-semibold text-cream shadow-md">
          Drop it here!
        </div>
      )}
    </motion.div>
  );
});
