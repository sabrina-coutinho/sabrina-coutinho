import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Coupons } from "@/components/Coupons";
import { Feed } from "@/components/Feed";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Marquee, Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Coupons />
        <About />
        <Feed />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
