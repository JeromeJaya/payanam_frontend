import { useState, useEffect, useRef } from "react";
import Scene3D from "./components/3d/Scene3D";
import LandingHeader from "./components/landing/LandingHeader";
import HeroSection from "./components/landing/HeroSection";
import MarqueeTicker from "./components/landing/MarqueeTicker";
import ServicesMatrix from "./components/landing/ServicesMatrix";
import PipelineSection from "./components/landing/PipelineSection";
import EcosystemStats from "./components/landing/EcosystemStats";
import WhyChooseUs from "./components/landing/WhyChooseUs";
import PopularDestinations from "./components/landing/PopularDestinations";
import TestimonialsSection from "./components/landing/TestimonialsSection";
import LandingFooter from "./components/landing/LandingFooter";
import VendorModal from "./components/landing/VendorModal";

function useScrollReveal(thresholdValue = 0.1) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: thresholdValue, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [thresholdValue]);

  return [ref, isRevealed];
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("flight");
  const [vendorModal, setVendorModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    setIsClient(true);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollProgress = scrollY;

  const [heroHeaderRef, heroHeaderRevealed] = useScrollReveal(0.05);
  const [matrixRef, matrixRevealed] = useScrollReveal(0.1);
  const [perksGridRef, perksGridRevealed] = useScrollReveal(0.15);
  const [pipelineRef, pipelineRevealed] = useScrollReveal(0.1);
  const [metricsRef, metricsRevealed] = useScrollReveal(0.15);
  const [whyChooseRef, whyChooseRevealed] = useScrollReveal(0.1);
  const [destinationsRef, destinationsRevealed] = useScrollReveal(0.1);
  const [testimonialsRef, testimonialsRevealed] = useScrollReveal(0.1);

  const servicesConfig = {
    flight: {
      title: "Domestic & International Flight Booking",
      tagline: "Compare and lock real-time pricing across 500+ global air carriers.",
      usp: ["Real-time Fare Lock Guarantee", "Instant automated seat upgrades", "Zero-convenience fee windows", "Multi-routing tier split pricing"],
      metrics: { primary: "500+", label: "Airlines Integrated" },
      color: "from-lime-600 to-emerald-500",
      accent: "text-lime-600",
      bgGradient: "from-lime-500/5 to-emerald-500/5"
    },
    bus: {
      title: "Intercity Smart Bus Network",
      tagline: "Reserve verified fleet seats with onboard live tracking & predictive ETA.",
      usp: ["Live vehicle GPS coordinates tracking", "Premium multi-axle sleeper options", "Gender-segregated row configuration", "Predictive dynamic arrival alerts"],
      metrics: { primary: "25K+", label: "Routes Active Daily" },
      color: "from-lime-600 to-lime-700",
      accent: "text-lime-600",
      bgGradient: "from-lime-600/5 to-lime-700/5"
    },
    hotel: {
      title: "Curated Luxury Stay Accommodations",
      tagline: "Direct connection infrastructure ensuring the lowest prices with zero middleman markup.",
      usp: ["100% direct property sourcing model", "Flexible check-in/check-out options", "Complimentary hyper-local meals", "Instant tier loyalty credit updates"],
      metrics: { primary: "1.2M+", label: "Rooms Monitored" },
      color: "from-lime-600 to-yellow-500",
      accent: "text-lime-600",
      bgGradient: "from-lime-500/5 to-yellow-500/5"
    },
    train: {
      title: "Authorized Rail Ticketing Pipeline",
      tagline: "Direct server-to-server reservation links for maximum success rates.",
      usp: ["CNF predictive seat forecasting algorithm", "One-tap instant cancellation refund processing", "Alternative route auto-discovery system", "High-priority quota sync access"],
      metrics: { primary: "99.4%", label: "Platform API Success Rate" },
      color: "from-lime-600 to-teal-500",
      accent: "text-lime-600",
      bgGradient: "from-lime-500/5 to-teal-500/5"
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans selection:bg-lime-500 selection:text-white antialiased overflow-x-hidden relative">

      {isClient && <Scene3D scrollProgress={scrollProgress} mousePosition={mousePosition} />}

      <LandingHeader />

      <main className="w-full relative z-10">
        <HeroSection
          heroHeaderRef={heroHeaderRef}
          heroHeaderRevealed={heroHeaderRevealed}
          scrollY={scrollY}
          mousePosition={mousePosition}
          setVendorModal={setVendorModal}
        />

        <MarqueeTicker />

        <ServicesMatrix
          matrixRef={matrixRef}
          matrixRevealed={matrixRevealed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          perksGridRef={perksGridRef}
          perksGridRevealed={perksGridRevealed}
          servicesConfig={servicesConfig}
        />

        <PipelineSection
          pipelineRef={pipelineRef}
          pipelineRevealed={pipelineRevealed}
        />

        <EcosystemStats
          metricsRef={metricsRef}
          metricsRevealed={metricsRevealed}
        />

        <WhyChooseUs
          whyChooseRef={whyChooseRef}
          whyChooseRevealed={whyChooseRevealed}
        />

        <PopularDestinations
          destinationsRef={destinationsRef}
          destinationsRevealed={destinationsRevealed}
        />

        <TestimonialsSection
          testimonialsRef={testimonialsRef}
          testimonialsRevealed={testimonialsRevealed}
        />
      </main>

      <LandingFooter />

      <VendorModal isOpen={vendorModal} onClose={() => setVendorModal(false)} />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 3ms linear infinite;
        }
      `}</style>
    </div>
  );
}
