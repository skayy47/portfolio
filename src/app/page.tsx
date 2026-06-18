import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Approach } from "@/components/sections/Approach";
import { Projects } from "@/components/sections/Projects";
import { MoreProjects } from "@/components/sections/MoreProjects";
import { Journey } from "@/components/sections/Journey";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Cursor } from "@/components/ui/Cursor";
import { PaletteSwitcher } from "@/components/ui/PaletteSwitcher";

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <PaletteSwitcher />
      <main>
        <Hero />
        <Approach />
        <Projects />
        <MoreProjects />
        <Journey />
        <Capabilities />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
