// page.tsx
import Navbar from "@/component/layout/Navbar";
import Hero from "@/component/home/Hero";
import BenifitStrip from "@/component/home/BenifitStrip"

export default function Home() {
  return (
    <>
      <Navbar cartCount={0} />
      <Hero />
      <BenifitStrip/>
      {/* rest of homepage sections */}
    </>
  );
}