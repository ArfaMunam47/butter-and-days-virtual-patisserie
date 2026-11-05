import { ShoppingBag } from "lucide-react";

interface BakeryHeaderProps {
  count: number;
  onOpenBag: () => void;
  onPastries: () => void;
  onStory: () => void;
  onContact: () => void;
}

export function BakeryHeader({ count, onOpenBag, onPastries, onStory, onContact }: BakeryHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 lg:px-8 lg:py-4">
      {/* Logo */}
      <button type="button" onClick={onPastries} className="shrink-0 text-left focus:outline-none">
        <span className="block font-display text-[24px] font-semibold italic leading-none text-berry sm:text-[28px]">
          Butter <span className="not-italic">&amp;</span> Days
        </span>
        <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.35em] text-cocoa/70 sm:text-[9px]">
          Pink pastry boutique
        </span>
      </button>

      {/* Nav */}
      <nav className="hidden items-center gap-7 text-sm font-medium text-berry md:flex">
        <button type="button" onClick={onPastries} className="nav-link">
          Home
        </button>
        <button type="button" onClick={onPastries} className="nav-link">
          Our Pastries
        </button>
        <button type="button" onClick={onStory} className="nav-link">
          Our Story
        </button>
        <button type="button" onClick={onContact} className="nav-link">
          Contact
        </button>
      </nav>

      {/* Box indicator */}
      <button
        type="button"
        onClick={onOpenBag}
        className="flex shrink-0 items-center gap-2 rounded-full border border-blush bg-cream/90 px-3.5 py-2 shadow-sm transition hover:border-berry/30 hover:shadow-md sm:px-4"
      >
        <ShoppingBag className="h-4 w-4 text-berry" />
        <span className="whitespace-nowrap font-display text-[13px] font-semibold text-berry sm:text-sm">
          Your box · {count}
        </span>
      </button>
    </header>
  );
}
