import { Leaf, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const BenefitsStrip = () => {
  return (
    <section className=" section-y  ">
      <div className="container-stridex">
        {/* Outer bordered container */}
        <div className="overflow-hidden rounded-2xl border border-(--color-stone-light)">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {/* Premium Materials */}
            <div className="flex items-center gap-4 border-b border-r border-(--color-stone-light) px-5 py-7 lg:border-b-0 lg:px-8">
              <Leaf
                size={24}
                strokeWidth={1.5}
                className="shrink-0 text-(--color-ink)"
              />

              <div>
                <p className="eyebrow">Premium Materials</p>

                <span className="mt-2 block text-sm text-(--color-stone)">
                  Finest quality, built to last.
                </span>
              </div>
            </div>

            {/* Free Shipping */}
            <div className="flex items-center gap-4 border-b border-(--color-stone-light) px-5 py-7 lg:border-b-0 lg:border-r lg:px-8">
              <Truck
                size={24}
                strokeWidth={1.5}
                className="shrink-0 text-(--color-ink)"
              />

              <div>
                <p className="eyebrow">Free Shipping</p>

                <span className="mt-2 block text-sm text-(--color-stone)">
                  On orders above ₹1499.
                </span>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-center gap-4 border-r border-(--color-stone-light) px-5 py-7 lg:border-r lg:px-8">
              <RefreshCw
                size={24}
                strokeWidth={1.5}
                className="shrink-0 text-(--color-ink)"
              />

              <div>
                <p className="eyebrow">Easy Returns</p>

                <span className="mt-2 block text-sm text-(--color-stone)">
                  14 days hassle-free returns.
                </span>
              </div>
            </div>

            {/* Secure Checkout */}
            <div className="flex items-center gap-4 px-5 py-7 lg:px-8">
              <ShieldCheck
                size={24}
                strokeWidth={1.5}
                className="shrink-0 text-(--color-ink)"
              />

              <div>
                <p className="eyebrow">Secure Checkout</p>

                <span className="mt-2 block text-sm text-(--color-stone)">
                  Safe & secure payments.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsStrip;