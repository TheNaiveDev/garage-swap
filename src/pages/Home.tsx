import Navbar from "../components/Navbar";
import Hero from "../components/Herosection";
import FeaturedCards from "../components/featuredcards";
import HowItWorks from "../components/hwosection";
import Ctasection from "../components/Ctasection";
import Footer from "../components/footer";
export default function Home() {
  return(
    <>
    <Navbar />
    <main>
        <Hero/>
        <FeaturedCards/>
        <HowItWorks/>
        <Ctasection/>
        <Footer/>
    </main>
    </>
  )
}
