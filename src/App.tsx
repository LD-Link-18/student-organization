import { About } from "./components/About";
import { Areas } from "./components/Areas";
import { Events } from "./components/Events";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { JoinSection } from "./components/JoinSection";
import { Navbar } from "./components/Navbar";
import { Projects } from "./components/Projects";
import { Sponsors } from "./components/Sponsors";
import { Team } from "./components/Team";
import { Spark } from "./components/ui/Glyph";
import { Marquee } from "./components/ui/Marquee";
import { useContent } from "./content/i18n";

export default function App() {
  const t = useContent();
  const tapeItems = [...t.areas.items.map((a) => a.title), ...t.tapeExtras].map((label) => ({
    key: label,
    node: (
      <>
        <span className="whitespace-nowrap">{label}</span>
        <Spark className="size-5 shrink-0 md:size-7" />
      </>
    ),
  }));

  return (
    <>
      <a
        href="#main"
        className="btn btn-lime fixed top-3 left-3 z-[60] -translate-y-24 focus-visible:translate-y-0"
      >
        {t.common.skipToContent}
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        {/* zero-height layer so the tape sits centered on the seam without shifting either section */}
        <div className="relative z-20 h-0 overflow-x-clip">
          <div className="absolute -inset-x-4 top-0 -translate-y-1/2 -rotate-2">
            <Marquee
              items={tapeItems}
              itemClassName="flex items-center gap-6 pr-6 md:gap-10 md:pr-10"
              className="border-y-[3px] border-ink bg-lime py-4 font-display text-3xl font-bold tracking-tight text-ink md:py-5 md:text-5xl"
            />
          </div>
        </div>
        <About />
        <Areas />
        <Projects />
        <Events />
        <Team />
        <Sponsors />
        <JoinSection />
      </main>
      <Footer />
    </>
  );
}
