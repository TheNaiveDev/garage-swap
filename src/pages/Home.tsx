import Navbar from "../components/Navbar";
import Hero from "../components/Herosection";
import FeaturedCards from "../components/featuredcards";
import HowItWorks from "../components/HowItWorks";
import Ctasection from "../components/Ctasection";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div className="font-[Poppins]">
      <Navbar />
      <main>
        <Hero />
        <FeaturedCards />
        <HowItWorks />
        <Ctasection />
        <Footer />
      </main>
    </div>
  );
}
