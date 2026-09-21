import Footer from "@/component/layout/Footer";
import Navbar from "@/component/layout/Navbar";
import ProductListing from "@/component/products/ProductListing";

export default function MenPage() {
  return (
    <>
     <Navbar cartCount={0} />
    <ProductListing
      gender="men"
      eyebrow="For Him"
      title="Men's Collection"
      description="Performance and style, engineered for everyday movement."
    />
    <Footer/>
    </>
  );
}