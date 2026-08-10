"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "MEN", href: "/men" },
  { label: "WOMEN", href: "/women" },
  { label: "NEW ARRIVALS", href: "/new-arrivals" },
  { label: "COLLECTIONS", href: "/collections" },
];

const SCROLL_THRESHOLD = 80;

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
          isScrolled
            ? "border-(--color-stone-light) bg-(--color-ivory)/95 backdrop-blur-sm"
            : "border-transparent bg-(--color-ivory)"
        }`}
      >
        <div className="container-stridex flex h-16 items-center justify-between md:h-20">
          <Link
            href="/"
            className="font-sans text-lg font-bold tracking-[0.2em] text-(--color-ink) md:text-xl"
          >
            STRIDE
            <span className="text-(--color-champagne)">X</span>
          </Link>

          {/* Desktop nav links — lg and up only */}
          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="eyebrow text-(--color-ink) transition-colors duration-300 hover:text-(--color-champagne)"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icon cluster */}
          <div className="flex items-center gap-5 md:gap-6">
            <button
              type="button"
              aria-label="Search"
              className="text-(--color-ink) transition-colors duration-300 hover:text-(--color-champagne)"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              aria-label="Wishlist"
              className="hidden text-(--color-ink) transition-colors duration-300 hover:text-(--color-champagne) md:inline-flex"
            >
              <Heart size={19} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              aria-label="Account"
              className="hidden text-(--color-ink) transition-colors duration-300 hover:text-(--color-champagne) lg:inline-flex"
            >
              <User size={19} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              aria-label={`Bag, ${cartCount} items`}
              className="relative text-(--color-ink) transition-colors duration-300 hover:text-(--color-champagne)"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-champagne) text-[10px] font-semibold text-(--color-ink)">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setIsDrawerOpen(true)}
              className="text-(--color-ink) transition-colors duration-300 hover:text-(--color-champagne) lg:hidden"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}

function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col bg-(--color-ink)"
        >
          <div className="container-stridex flex h-16 items-center justify-between md:h-20">
            <span className="font-sans text-lg font-bold tracking-[0.2em] text-(--color-ivory)">
              STRIDEX
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="text-(--color-ivory) transition-colors duration-300 hover:text-(--color-champagne)"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <motion.nav
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
              closed: {},
            }}
            className="container-stridex flex flex-1 flex-col justify-center gap-2"
          >
            {NAV_LINKS.map((link) => (
              <motion.div
                key={link.href}
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 16 },
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="display-headline block py-3 text-4xl text-(--color-ivory) transition-colors duration-300 hover:text-(--color-champagne)"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          <div className="container-stridex flex items-center gap-6 border-t border-[rgb(255_255_255/0.12)] py-6">
            <Link
              href="/account"
              onClick={onClose}
              className="eyebrow text-(--color-stone) transition-colors duration-300 hover:text-(--color-champagne)"
            >
              Account
            </Link>
            <Link
              href="/wishlist"
              onClick={onClose}
              className="eyebrow text-(--color-stone) transition-colors duration-300 hover:text-(--color-champagne)"
            >
              Wishlist
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}