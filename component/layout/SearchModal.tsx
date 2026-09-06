"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Search as SearchIcon } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface SearchResult {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
images: string[];
  slug: string;
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query)}&limit=6`
        );
        const data = await res.json();
        setResults(data.products ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 350); 

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  function handleSelect(slug: string) {
    onClose();
    router.push(`/products/${slug}`);
  }
  return (
       <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-70 bg-ink/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-24 w-full max-w-2xl rounded-lg bg-ivory p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-stone-light pb-4">
              <SearchIcon size={20} strokeWidth={1.5} className="text-stone" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for shoes, brands..."
                className="flex-1 bg-transparent text-body text-ink placeholder:text-stone focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="text-ink hover:text-champagne transition-colors duration-300"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-4 max-h-96 overflow-y-auto">
              {loading && (
                <p className="py-8 text-center text-caption text-stone">
                  Searching...
                </p>
              )}

              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className="py-8 text-center text-caption text-stone">
                  No products found for &quot;{query}&quot;
                </p>
              )}

              {!loading &&
                results.map((product) => {
                  const price = product.discountPrice ?? product.price;
                  return (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleSelect(product.slug)}
                      className="flex w-full items-center gap-4 rounded-md p-3 text-left hover:bg-stone-light transition-colors duration-300"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-stone-light">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          sizes="56px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="text-body text-ink">{product.title}</p>
                        <p className="text-caption text-stone">
                          ₹{price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}