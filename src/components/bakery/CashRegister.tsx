import { motion } from "motion/react";
import { fmt } from "@/data/products";

/** Vintage pink register whose display follows the actual box contents. */
export function CashRegister({ total, count }: { total: number; count: number }) {
  return (
    <div className="relative w-[200px] max-w-full select-none sm:w-[220px]">
      <div className="register-display relative z-[2] mx-auto w-[88%] rounded-t-xl border-[3px] border-berry-deep/50 px-3 pb-2.5 pt-1.5">
        <div className="flex items-center justify-between text-[8px] font-medium uppercase text-cream/65"><span>Butter &amp; Days</span><span>{count} {count === 1 ? "treat" : "treats"}</span></div>
        <motion.div key={total.toFixed(2)} initial={{ y: 6, opacity: 0.35 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 320, damping: 20 }} className="mt-1 text-right font-mono text-[28px] font-semibold tabular-nums leading-none text-cream">{fmt(total)}</motion.div>
      </div>
      <div className="relative z-[1] -mt-1 rounded-2xl bg-reg-pink p-3 pt-4 shadow-[0_18px_30px_-10px_oklch(0.348_0.095_351.1_/_0.4)] ring-1 ring-berry/15" aria-label="Vintage cash register">
        <div className="grid grid-cols-4 gap-1.5" aria-hidden>
          {[
            ["1", "2", "3", "+"], ["4", "5", "6", "−"], ["7", "8", "9", "×"], ["C", "0", ".", "="],
          ].flat().map((key, index) => <div key={`${key}-${index}`} className={`register-key ${key === "=" ? "bg-butter/90" : ""}`}>{key}</div>)}
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-reg-pink-deep/40" aria-hidden />
      </div>
      <div className="relative mx-auto h-4 w-[94%] rounded-b-xl bg-reg-pink-deep shadow-[0_10px_16px_-8px_oklch(0.348_0.095_351.1_/_0.5)]"><div className="absolute left-1/2 top-1/2 h-2.5 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-butter shadow-sm" /></div>
    </div>
  );
}