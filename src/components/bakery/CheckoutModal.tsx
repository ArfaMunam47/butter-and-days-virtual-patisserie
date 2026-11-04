import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Clock } from "lucide-react";
import { fmt, PINK_BAG, type BakeryItem } from "@/data/products";

export interface CartLine {
  item: BakeryItem;
  qty: number;
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  count: number;
  total: number;
  onChangeQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  /** Called once when the demo order is placed — clears the bag for real. */
  onOrderDemo: () => void;
  pickupTime: string;
}

export function CheckoutModal({
  open,
  onClose,
  lines,
  count,
  total,
  onChangeQty,
  onRemove,
  onOrderDemo,
  pickupTime,
}: CheckoutModalProps) {
  const [placed, setPlaced] = useState(false);
  const [snapshot, setSnapshot] = useState<{ lines: CartLine[]; count: number; total: number } | null>(null);

  useEffect(() => {
    if (open) {
      setPlaced(false);
      setSnapshot(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Pink blurred backdrop */}
          <div
            className="absolute inset-0 bg-blush/55 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Your bag checkout"
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-cream p-6 shadow-[0_40px_80px_-24px_rgba(93,33,64,0.5)] sm:p-8"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <button
              type="button"
              aria-label="Close checkout"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-blush-light text-berry shadow-sm transition hover:bg-blush"
            >
              ×
            </button>

            <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-6">
              {/* Left: the pink bag */}
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                  className="relative w-[190px] sm:w-[230px]"
                >
                  <img
                    src={PINK_BAG}
                    alt="Pink Butter & Days paper bag tied with a red ribbon"
                    width={1024}
                    height={1024}
                    className="w-full object-contain drop-shadow-[0_20px_26px_rgba(93,33,64,0.3)]"
                  />
                  <div className="absolute -right-5 top-[48%] rotate-6 rounded-lg bg-butter px-3 py-2 shadow-md ring-1 ring-cocoa/15">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cocoa/80">
                      Pickup
                    </div>
                    <div className="font-display text-[15px] font-semibold leading-tight text-berry">
                      {pickupTime}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right: the bag's contents */}
              <div>
                <h2 className="font-display text-3xl font-semibold leading-[1.05] text-berry sm:text-4xl">
                  Good things
                  <br />
                  <em className="font-medium italic">come in pink.</em>
                </h2>

                {placed && snapshot ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-2xl border border-blush bg-blush-light/60 p-5 text-center"
                  >
                    <div className="font-display text-2xl font-semibold text-berry">
                      Order wrapped in pink!
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-cocoa">
                      {snapshot.count} {snapshot.count === 1 ? "treat" : "treats"} ·{" "}
                      {fmt(snapshot.total)} — ready {pickupTime.toLowerCase()}.
                    </p>
                    <p className="mt-2 rounded-lg bg-butter/70 px-3 py-2 text-[12px] font-medium text-cocoa">
                      This is a demo boutique — nothing was charged and no real order was placed.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-4 rounded-full bg-berry px-5 py-2.5 font-display text-base font-semibold text-cream shadow-md transition hover:bg-berry-deep active:scale-95"
                    >
                      Back to the case ↗
                    </button>
                  </motion.div>
                ) : lines.length === 0 ? (
                  <div className="mt-6">
                    <p className="font-display text-2xl italic text-berry">A little bag. A lovely day.</p>
                    <p className="mt-2 text-sm text-cocoa">All wrapped up and waiting for you.</p>
                    <p className="mt-1 text-sm text-cocoa/80">Pick up today at {pickupTime}</p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-6 rounded-full bg-berry px-5 py-2.5 font-display text-base font-semibold text-cream shadow-md transition hover:bg-berry-deep active:scale-95"
                    >
                      Back to the case ↗
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-5 max-h-[236px] space-y-2.5 overflow-y-auto pr-1">
                      {lines.map(({ item, qty }) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-2xl bg-blush-light/70 p-2"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            width={1024}
                            height={1024}
                            loading="lazy"
                            className="h-12 w-12 shrink-0 rounded-xl bg-white/70 object-contain p-1"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-display text-[15px] font-semibold leading-tight text-berry">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-cocoa">{fmt(item.price)} each</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              aria-label={`One less ${item.name}`}
                              onClick={() => onChangeQty(item.id, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-cream text-berry shadow-sm transition hover:bg-blush"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-sm font-semibold text-berry">{qty}</span>
                            <button
                              type="button"
                              aria-label={`One more ${item.name}`}
                              onClick={() => onChangeQty(item.id, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-cream text-berry shadow-sm transition hover:bg-blush"
                            >
                              +
                            </button>
                          </div>
                          <div className="w-14 shrink-0 text-right font-display text-[15px] font-semibold text-berry">
                            {fmt(item.price * qty)}
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${item.name} from your bag`}
                            onClick={() => onRemove(item.id)}
                            className="w-4 shrink-0 text-lg leading-none text-cocoa/50 transition hover:text-berry"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-blush pt-3">
                      <span className="font-display text-lg text-berry">Your total</span>
                      <motion.span
                        key={total.toFixed(2)}
                        initial={{ scale: 0.9, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-display text-2xl font-bold text-berry"
                      >
                        {fmt(total)}
                      </motion.span>
                    </div>

                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-butter/60 p-3">
                      <Clock className="h-5 w-5 shrink-0 text-berry" />
                      <div>
                        <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cocoa/70">
                          Pick up today at
                        </div>
                        <div className="font-display text-lg font-semibold leading-tight text-berry">
                          {pickupTime}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSnapshot({ lines, count, total });
                        onOrderDemo();
                        setPlaced(true);
                      }}
                      className="mt-4 w-full rounded-full bg-berry py-3.5 font-display text-lg font-semibold text-cream shadow-lg transition hover:bg-berry-deep active:scale-[0.98]"
                    >
                      Whip up my order ↗
                    </button>
                    <p className="mt-2 text-center text-[11px] text-cocoa/60">
                      Demo checkout — no payment is processed.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
