
import Navbar from "@/component/layout/Navbar";
import Hero from "@/component/home/Hero";
import BenifitStrip from "@/component/home/BenifitStrip"
import Collections from "@/component/home/Collections"
import MostLoved from "@/component/home/MostLoved";
import NewArrivals from "@/component/home/NewArrivals";
import BrandStory from "@/component/home/BrandStory";
import Footer from "@/component/layout/Footer"

export default  function Home() {
  
  
  return (
    <>
      <Navbar cartCount={0} />
      <Hero />
      <BenifitStrip/>
      <Collections/>
      <MostLoved/>
      <NewArrivals/>
     <BrandStory/>
     <Footer/>  
    </>
  );
}


