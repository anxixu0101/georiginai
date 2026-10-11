import { useEffect } from "react";
import { useLocation } from "react-router";
import Hero from "@/components/home/Hero";
import ProductIdea from "@/components/home/ProductIdea";
import GameplayVideo from "@/components/home/GameplayVideo";
import PrototypeRoadmap from "@/components/home/PrototypeRoadmap";
import DevLogTeaser from "@/components/home/DevLogTeaser";
import { scrollToAnchor } from "@/lib/lenis";

export default function Home() {
  const { hash } = useLocation();

  // Deep links like /#console scroll to the section once mounted.
  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => scrollToAnchor(hash), 400);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <div className="ep-landing">
      <Hero />
      <ProductIdea />
      <GameplayVideo />
      <PrototypeRoadmap />
      <DevLogTeaser />
    </div>
  );
}
