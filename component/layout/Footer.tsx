import Link from "next/link";

const shopLinks = [
  { label: "New Arrivals", href: "/products" },
  { label: "Collections", href: "/collections" },
  { label: "Men", href: "product?gender=men" },
  { label: "Women", href: "product?gender=women" },
];
const companyLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export default function Footer() {
  return (
    <footer className="bg-(--color-ink) text-(--color-ivory)">
      <div className="container-stridex">

        {/* Main footer */}
        <div className="grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-display text-3xl tracking-tight"
            >
              STRIDEX
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-(--color-stone-light)">
              Premium footwear designed for everyday movement.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="eyebrow mb-5 text-(--color-champagne)">
              Shop
            </p>

            <nav className="flex flex-col gap-3">
              {shopLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm text-(--color-stone-light) transition-colors duration-300 hover:text-(--color-ivory)"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <p className="eyebrow mb-5 text-(--color-champagne)">
              Company
            </p>

            <nav className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm text-(--color-stone-light) transition-colors duration-300 hover:text-(--color-ivory)"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <p className="eyebrow mb-5 text-(--color-champagne)">
              Follow
            </p>

            <nav className="flex flex-col gap-3">
              <Link
                href="#"
                className="w-fit text-sm text-(--color-stone-light) transition-colors duration-300 hover:text-(--color-ivory)"
              >
                Instagram
              </Link>

              <Link
                href="#"
                className="w-fit text-sm text-(--color-stone-light) transition-colors duration-300 hover:text-(--color-ivory)"
              >
                Facebook
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 py-6 text-xs text-(--color-stone) sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 StrideX. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-(--color-ivory)"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-(--color-ivory)"
            >
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}