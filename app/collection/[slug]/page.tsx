"use client";

import { use } from "react";
import ProductListing from "@/component/products/ProductListing";
import Navbar from "@/component/layout/Navbar";
import Footer from "@/component/layout/Footer";


const COLLECTION_INFO: Record<
  string,
  { eyebrow: string; title: string; description: string }
> = {
  lifestyle: {
    eyebrow: "Life Style",
    title: "Lifestyle Collection",
    description: "Everyday style. Maximum comfort.",
  },
  performance: {
    eyebrow: "Performance",
    title: "Performance Collection",
    description: "Built for speed. Made for intensity.",
  },
  premium: {
    eyebrow: "Signature",
    title: "Signature Collection",
    description: "Premium design. Timeless appeal.",
  },
};

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const info = COLLECTION_INFO[slug] ?? {
    eyebrow: "Collection",
    title: "Collection",
    description: "Explore this collection.",
  };

return (
  <>
   <Navbar cartCount={0} />
  <ProductListing
    category={slug}
    eyebrow={info.eyebrow}
    title={info.title}
    description={info.description}
  />
  <Footer/>
  </>
);
}