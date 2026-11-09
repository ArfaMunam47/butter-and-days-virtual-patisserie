import { AnimatePresence, motion, type MotionProps } from "motion/react";
import { forwardRef } from "react";
import { X } from "lucide-react";
import { ALL_ITEMS, type BakeryItem } from "@/data/products";
import { cn } from "@/lib/utils";
import type { BoxTreat } from "@/lib/bakery-order";
import { Button } from "@/components/ui/button";

interface BakeryBoxProps extends MotionProps {
  contents: BoxTreat[];
  highlighted: boolean;
  dragActive: boolean;
  onRemove: (uid: string) => void;
  pourTargetUid: string | null;
  pouringItem: BakeryItem | null;
  onTreatDrop?: (uid: string, x: number, y: number) => void;
  selectedUid: string | null;
  onSelectTreat: (uid: string) => void;
}

export const BakeryBox = forwardRef<HTMLDivElement, BakeryBoxProps>(function BakeryBox(
  { contents, highlighted, dragActive, onRemove, pourTargetUid, pouringItem, onTreatDrop, selectedUid, onSelectTreat, ...motionProps }, ref,
) {
  return (
    <motion.div ref={ref} className="relative h-[230px] w-[min(88vw,360px)] select-none sm:h-[250px] sm:w-[380px]" animate={{ scale: highlighted ? 1.035 : 1, y: highlighted ? -3 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} {...motionProps}>
      <div className="absolute -top-12 left-1/2 h-[88px] w-[84%] origin-bottom -translate-x-1/2 -rotate-3 rounded-lg border-[3px] border-berry-deep/40 bg-reg-pink-deep shadow-[0_10px_18px_-8px_oklch(0.348_0.095_351.1_/_0.5)]">
        <div className="flex h-full items-center justify-center"><span className="font-display text-lg italic text-cream/85">Butter &amp; Days</span></div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-5 overflow-hidden rounded-b-2xl rounded-t-md border-[3px] border-berry-deep/35 bg-reg-pink shadow-[0_22px_36px_-14px_oklch(0.348_0.095_351.1_/_0.5)]">
        <div className="tissue-pattern absolute inset-1 rounded-b-xl rounded-t-sm shadow-[inset_0_4px_10px_oklch(0.348_0.095_351.1_/_0.18)]" />
        <div className="absolute inset-3 grid grid-cols-4 grid-rows-2 gap-2">
          <AnimatePresence>
            {contents.map((treat, index) => {
              const item = ALL_ITEMS[treat.productId];
              const topping = treat.toppingId ? ALL_ITEMS[treat.toppingId] : null;
              if (!item) return null;
              const dimensions = item.size === "small" ? "h-[54px] w-[54px]" : item.size === "large" ? "h-[92px] w-[92px]" : "h-[70px] w-[70px]";
              return (
                <motion.div key={treat.uid} data-treat-uid={treat.uid} onClick={() => { onSelectTreat(treat.uid); if (pouringItem) onTreatDrop?.(treat.uid, 0, 0); }} onPointerUp={(e) => { if (pouringItem) onTreatDrop?.(treat.uid, e.clientX, e.clientY); }} className={cn("group relative flex min-w-0 items-center justify-center", (pourTargetUid === treat.uid || selectedUid === treat.uid) && "rounded-md bg-butter/80 ring-2 ring-berry/60")} initial={{ opacity: 0, scale: 0.5, y: -25 }} animate={{ opacity: 1, scale: pourTargetUid === treat.uid ? 1.06 : 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                  <img src={item.image} alt={item.name} width={1024} height={1024} className={cn("pointer-events-none object-contain drop-shadow-[0_5px_6px_oklch(0.348_0.095_351.1_/_0.3)]", dimensions)} />
                  {topping && <div title={topping.name} className={`pointer-events-none absolute right-[18%] top-[14%] z-[4] h-3.5 w-3.5 rounded-full border border-white/80 shadow-sm ${topping.id === "cloud-cream" ? "bg-cream" : topping.id === "chocolate-silk" ? "bg-cocoa" : "bg-emerald-500"}`} />}
                  {topping ? <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${topping.name} from ${item.name}`} onClick={(event) => { event.stopPropagation(); onTreatDrop?.(treat.uid, -1, -1); }} className="absolute left-0 top-0 z-[6] h-6 w-6 rounded-full bg-cream/95 text-berry opacity-0 shadow group-hover:opacity-100 focus-visible:opacity-100"><X className="h-3 w-3" /></Button> : null}
                  <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${item.name} from your box`} onClick={(event) => { event.stopPropagation(); onRemove(treat.uid); }} className="absolute right-0 top-0 z-[6] h-6 w-6 rounded-full bg-cream/95 text-berry opacity-0 shadow group-hover:opacity-100 focus-visible:opacity-100"><X className="h-3 w-3" /></Button>
                  <span className="pointer-events-none absolute bottom-0 left-1/2 max-w-full -translate-x-1/2 truncate rounded bg-cream/90 px-1 text-[8px] leading-tight text-berry">{topping ? `${item.name} + ${topping.name}` : item.name}</span>
                  {pourTargetUid === treat.uid && pouringItem && <motion.span className="pointer-events-none absolute -top-2 z-10 h-5 w-1 rounded-full bg-butter" initial={{ height: 0, opacity: 0 }} animate={{ height: 24, opacity: [0, 1, 0.5] }} transition={{ duration: 0.6 }} />}
                  <span className="sr-only">Treat {index + 1}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-display text-[13px] font-semibold italic text-berry/40">Butter &amp; Days</div>
      </div>
      <div className={cn("pointer-events-none absolute -inset-3 rounded-[1.6rem] border-[3px] border-dashed border-berry/60 transition-opacity duration-200", highlighted ? "opacity-100" : "opacity-0")} />
      {dragActive && !highlighted && <div className="pointer-events-none absolute -top-[3.4rem] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-berry px-3 py-1 font-display text-[12px] font-semibold text-cream shadow-md">Drop it here!</div>}
    </motion.div>
  );
});