import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ALL_ITEMS,
  TOPPINGS,
  fmt,
  type BakeryItem,
} from "@/data/products";
import { BakeryHeader } from "@/components/bakery/BakeryHeader";
import { GlassDisplay } from "@/components/bakery/GlassDisplay";
import { CashRegister } from "@/components/bakery/CashRegister";
import { BakeryBox } from "@/components/bakery/BakeryBox";
import { TeapotCollection } from "@/components/bakery/TeapotCollection";
import { CheckoutModal, type CartLine } from "@/components/bakery/CheckoutModal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Butter & Days — A Pink Little Patisserie" },
      {
        name: "description",
        content:
          "Drag pastries from a vintage glass case into your pink box, pour a little extra on top, and check out in style.",
      },
      { property: "og:title", content: "Butter & Days — A Pink Little Patisserie" },
      {
        property: "og:description",
        content:
          "Drag pastries from a vintage glass case into your pink box, pour a little extra on top, and check out in style.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

interface DragState {
  item: BakeryItem;
  originX: number;
  originY: number;
  moved: boolean;
  over: boolean;
  returning: boolean;
}

interface Flight {
  uid: string;
  item: BakeryItem;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

let uidCounter = 0;
const nextUid = () => `u${++uidCounter}`;

function pickupTime(): string {
  const d = new Date(Date.now() + 45 * 60000);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function Index() {
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [boxContents, setBoxContents] = useState<{ uid: string; productId: string }[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [pouringId, setPouringId] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);
  const [email, setEmail] = useState("");
  const [preorderSent, setPreorderSent] = useState(false);

  const dragRef = useRef<DragState | null>(null);
  const ghostX = useMotionValue(0);
  const ghostY = useMotionValue(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const completedFlights = useRef<Set<string>>(new Set());

  const lines: CartLine[] = useMemo(
    () => cart.map((c) => ({ item: ALL_ITEMS[c.id], qty: c.qty })),
    [cart],
  );
  const count = useMemo(() => cart.reduce((a, c) => a + c.qty, 0), [cart]);
  const total = useMemo(
    () => lines.reduce((a, l) => a + l.item.price * l.qty, 0),
    [lines],
  );

  const addToCart = useCallback((id: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) {
        return prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { id, qty: 1 }];
    });
  }, []);

  const appendToBox = useCallback((productId: string) => {
    setBoxContents((prev) => [...prev, { uid: nextUid(), productId }].slice(-6));
  }, []);

  const startFlight = useCallback(
    (item: BakeryItem, from: { x: number; y: number }) => {
      const rect = boxRef.current?.getBoundingClientRect();
      const to = rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.55 }
        : { x: window.innerWidth / 2, y: window.innerHeight * 0.7 };
      setFlights((prev) => [...prev, { uid: nextUid(), item, from, to }]);
    },
    [],
  );

  const completeFlight = useCallback(
    (uid: string) => {
      if (completedFlights.current.has(uid)) return;
      completedFlights.current.add(uid);
      setFlights((prev) => {
        const f = prev.find((fl) => fl.uid === uid);
        if (f) {
          addToCart(f.item.id);
          appendToBox(f.item.id);
        }
        return prev.filter((fl) => fl.uid !== uid);
      });
    },
    [addToCart, appendToBox],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setDrag(null);
  }, []);

  const handleGrab = useCallback(
    (item: BakeryItem, e: React.PointerEvent) => {
      if (dragRef.current) return;
      const st: DragState = {
        item,
        originX: e.clientX,
        originY: e.clientY,
        moved: false,
        over: false,
        returning: false,
      };
      dragRef.current = st;
      setDrag(st);
      ghostX.set(e.clientX);
      ghostY.set(e.clientY);
    },
    [ghostX, ghostY],
  );

  const dragActive = drag !== null;
  useEffect(() => {
    if (!dragActive) return;

    const insideBox = (x: number, y: number) => {
      const rect = boxRef.current?.getBoundingClientRect();
      if (!rect) return false;
      return (
        x >= rect.left - 24 &&
        x <= rect.right + 24 &&
        y >= rect.top - 28 &&
        y <= rect.bottom + 14
      );
    };

    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || d.returning) return;
      ghostX.set(e.clientX);
      ghostY.set(e.clientY);
      const moved = d.moved || Math.hypot(e.clientX - d.originX, e.clientY - d.originY) > 10;
      const over = moved && insideBox(e.clientX, e.clientY);
      if (moved !== d.moved || over !== d.over) {
        const next = { ...d, moved, over };
        dragRef.current = next;
        setDrag(next);
      }
    };

    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || d.returning) return;
      if (d.moved && insideBox(e.clientX, e.clientY)) {
        startFlight(d.item, { x: e.clientX, y: e.clientY });
        endDrag();
      } else if (!d.moved) {
        // A quick tap adds the pastry straight to the box (mobile friendly).
        startFlight(d.item, { x: d.originX, y: d.originY });
        endDrag();
      } else {
        // Missed the box: spring the pastry back home.
        const back: DragState = { ...d, returning: true, over: false };
        dragRef.current = back;
        setDrag(back);
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    document.body.style.cursor = "grabbing";
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.body.style.cursor = "";
    };
  }, [dragActive, ghostX, ghostY, startFlight, endDrag]);

  const handlePour = useCallback(
    (topping: BakeryItem, e: React.MouseEvent<HTMLButtonElement>) => {
      if (pouringId) return;
      setPouringId(topping.id);
      const rect = e.currentTarget.getBoundingClientRect();
      startFlight(topping, { x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.3 });
      window.setTimeout(() => setPouringId(null), 950);
    },
    [pouringId, startFlight],
  );

  const changeQty = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0),
    );
  }, []);

  const removeLine = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const pulseCase = useCallback(() => setPulse((p) => p + 1), []);

  const focusContact = useCallback(() => {
    contactRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    contactRef.current?.focus({ preventScroll: true });
  }, []);

  const submitPreorder = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setPreorderSent(true);
    setEmail("");
    window.setTimeout(() => setPreorderSent(false), 4000);
  }, [email]);

  const pickup = useMemo(pickupTime, []);

  return (
    <div className="scene-wall relative flex min-h-[100dvh] w-full flex-col select-none">
      {/* Backdrop layers */}
      <div className="scene-floor absolute inset-x-0 bottom-0 top-[64%] hidden lg:block" aria-hidden />
      <div className="wainscot absolute bottom-0 right-0 top-0 hidden w-[6.5%] lg:block" aria-hidden />

      <BakeryHeader
        count={count}
        onOpenBag={() => setModalOpen(true)}
        onPastries={pulseCase}
        onStory={() => setStoryOpen(true)}
        onContact={focusContact}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-5 px-4 pb-8 pt-[84px] lg:flex-row lg:items-stretch lg:gap-2 lg:px-8">
        {/* Left column: vintage cash register */}
        <aside className="order-3 flex items-end justify-center lg:order-1 lg:w-[17%] lg:flex-col lg:justify-end lg:pb-12">
          <CashRegister total={total} count={count} />
        </aside>

        {/* Center column: the case, your box, checkout, preorder */}
        <section className="order-1 flex min-w-0 flex-1 flex-col items-center">
          <GlassDisplay
            onGrab={handleGrab}
            pulse={pulse}
            className="h-[52vh] min-h-[360px] w-full max-w-[720px] lg:h-[46vh] lg:min-h-[400px]"
          />

          <div className="mt-5 flex flex-col items-center gap-2.5 lg:mt-6">
            <BakeryBox
              ref={boxRef}
              contents={boxContents}
              highlighted={drag?.over ?? false}
              dragActive={!!drag && drag.moved}
            />
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-blush bg-cream/90 px-4 py-1.5 font-display text-base font-semibold text-berry shadow-sm">
                {count} / {fmt(total)}
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-berry px-5 py-2 font-display text-base font-semibold text-cream shadow-md transition hover:bg-berry-deep active:scale-95"
              >
                Checkout ↗
              </button>
            </div>
          </div>

          {/* Preorder / contact strip */}
          <form
            onSubmit={submitPreorder}
            className="mt-5 flex w-[min(100%,470px)] items-center gap-2 rounded-full border border-blush/70 bg-cream/90 py-1.5 pl-5 pr-1.5 shadow-md lg:mb-4 lg:mt-auto"
          >
            <input
              ref={contactRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ask about our first bake…"
              aria-label="Your email for preorders"
              className="min-w-0 flex-1 bg-transparent text-sm text-berry placeholder:text-cocoa/50 focus:outline-none"
            />
            <button
              type="submit"
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold shadow transition active:scale-95",
                preorderSent ? "bg-berry-deep text-cream" : "bg-berry text-cream hover:bg-berry-deep",
              )}
            >
              {preorderSent ? "Sent ♥" : "Preorder ↗"}
            </button>
          </form>
        </section>

        {/* Right column: the topping jugs */}
        <aside className="order-2 flex flex-col items-center justify-center gap-3 lg:order-3 lg:w-[17%] lg:justify-end lg:pb-12">
          <p className="hidden font-display text-sm italic text-berry/70 lg:block">
            Pour a little extra…
          </p>
          <TeapotCollection onPour={handlePour} pouringId={pouringId} />
        </aside>
      </main>

      {/* Dragged pastry ghost following the cursor */}
      {drag && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[80]"
          style={{ x: ghostX, y: ghostY }}
          animate={drag.returning ? { x: drag.originX, y: drag.originY } : undefined}
          transition={drag.returning ? { type: "spring", stiffness: 300, damping: 25 } : undefined}
          onAnimationComplete={() => {
            if (drag.returning) endDrag();
          }}
        >
          <img
            src={drag.item.image}
            alt=""
            draggable={false}
            className={cn(
              "w-28 -translate-x-1/2 -translate-y-[78%] object-contain drop-shadow-[0_18px_18px_rgba(93,33,64,0.38)]",
              drag.returning ? "opacity-90" : "rotate-6 scale-110",
            )}
          />
        </motion.div>
      )}

      {/* Pastries flying into the box / toppings being poured */}
      {flights.map((f) => (
        <motion.div
          key={f.uid}
          className="pointer-events-none fixed left-0 top-0 z-[80]"
          initial={{ x: f.from.x, y: f.from.y, scale: 1, rotate: 0 }}
          animate={{ x: f.to.x, y: f.to.y, scale: 0.5, rotate: -12 }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0.35, 1] }}
          onAnimationComplete={() => completeFlight(f.uid)}
        >
          <img
            src={f.item.image}
            alt=""
            draggable={false}
            className="w-24 -translate-x-1/2 -translate-y-[68%] object-contain drop-shadow-[0_14px_14px_rgba(93,33,64,0.32)]"
          />
        </motion.div>
      ))}

      {/* Checkout modal */}
      <CheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        lines={lines}
        count={count}
        total={total}
        onChangeQty={changeQty}
        onRemove={removeLine}
        onOrderDemo={() => {
          setCart([]);
          setBoxContents([]);
        }}
        pickupTime={pickup}
      />

      {/* Story modal */}
      <AnimatePresence>
        {storyOpen && (
          <motion.div
            className="fixed inset-0 z-[65] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-blush/50 backdrop-blur-sm"
              onClick={() => setStoryOpen(false)}
              aria-hidden
            />
            <motion.div
              className="relative w-full max-w-md rounded-[2rem] bg-cream p-7 shadow-2xl sm:p-8"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <button
                type="button"
                aria-label="Close our story"
                onClick={() => setStoryOpen(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-blush-light text-berry shadow-sm transition hover:bg-blush"
              >
                ×
              </button>
              <p className="font-display text-3xl font-semibold italic text-berry">Our Story</p>
              <p className="mt-4 text-sm leading-relaxed text-cocoa">
                Butter &amp; Days began in a very pink kitchen with one oven and a stubborn belief:
                a good morning starts with something warm and knotted by hand.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cocoa">
                Every pastry is folded, glazed and boxed the same day it is baked — and every box is
                tied like it matters. Because it does.
              </p>
              <button
                type="button"
                onClick={() => setStoryOpen(false)}
                className="mt-6 rounded-full bg-berry px-5 py-2.5 font-display text-base font-semibold text-cream shadow-md transition hover:bg-berry-deep active:scale-95"
              >
                Back to the case ↗
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const ToppingsForTest = TOPPINGS;
