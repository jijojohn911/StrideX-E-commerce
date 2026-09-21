import Navbar from "@/component/layout/Navbar";
import ProductListing from "@/component/products/ProductListing";
import Footer from "@/component/layout/Footer";



export default function WomenPage() {
  return (
    <>
     <Navbar cartCount={0} />
    <ProductListing
      gender="women"
      eyebrow="For Her"
      title="Women's Collection"
      description="Refined footwear designed for how you move."
    />
    <Footer/>
    </>
  );
}