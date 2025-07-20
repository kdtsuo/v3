import QuickLinks from "@/components/QuickLinks";
import Discover from "@/components/Discover";
import Footer from "@/components/Footer";
import { useTheme } from "@/contexts/ThemeContext";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { theme } = useTheme();
  return (
    <>
      <div
        id="top"
        className="animate-fade-in mx-auto h-auto pt-34 md:pt-46 overflow-x-none"
        style={{
          background: `var(--bg-dotted-${theme === "dark" ? "dark" : "light"})`,
        }}
      >
        <div className="text-center text-xl md:text-4xl">
          <h1>all things kpop at ubco!</h1>
          <h1>dance classes, events, performances</h1>
          <h1>and meetups for all kpop fans ♥</h1>
        </div>
        <div className="w-full flex justify-center">
          <QuickLinks />
        </div>
        <Separator className="my-6" />
        <Discover />
      </div>

      <Footer />
    </>
  );
}
