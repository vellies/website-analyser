"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Globe, Shield, Zap, ArrowRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);

    // Clean URL
    let cleanUrl = url.trim().replace(/^https?:\/\//, "");
    cleanUrl = encodeURIComponent(cleanUrl);

    router.push(`/report/${cleanUrl}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto z-10"
      >
        <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-semibold border rounded-full glass border-white/10 text-indigo-300 shadow-xl shadow-indigo-500/10 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-ping" />
          Production-Ready AI Website Auditor
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-tight">
          Unlock Your <span className="text-gradient drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">AI Visibility</span>
        </h1>

        <p className="text-lg md:text-2xl text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          The only auditor that measures how AI agents, search crawlers, and future shoppers see your digital storefront.
        </p>

        {/* Input Form with Glow */}
        <form
          onSubmit={handleAnalyze}
          className="relative max-w-2xl mx-auto mb-16 group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col md:flex-row items-center p-2 rounded-2xl bg-[#09090b] border border-white/10 focus-within:border-indigo-500/50 shadow-2xl transition-all duration-300">
            <div className="flex-1 flex items-center w-full">
              <div className="pl-6 pr-2 text-muted-foreground">
                <Globe className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="e.g. example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-xl py-4 md:py-5 outline-none placeholder:text-muted-foreground/50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full md:w-auto px-10 py-4 md:py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-600/20",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Running Scan..." : "Analyze Now"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left mb-16">
          <FeatureCard
            icon={<Search className="w-6 h-6 text-indigo-400" />}
            title="SEO Visibility"
            description="Deep analysis of meta tags, semantic headers, and internal link equity."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-cyan-400" />}
            title="AI Bot Access"
            description="Robots.txt audit and llms.txt readiness for LLM discovery and indexing."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-orange-400" />}
            title="Commerce Insights"
            description="Actionable fixes for product schema, sitemaps, and feed optimization."
          />
        </div>

        {/* Score Explanations - Redesigned */}
        <div className="p-px w-full rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent">
          <div className="p-6 md:p-12 rounded-[calc(2.5rem-1px)] bg-[#09090b]/90 backdrop-blur-2xl text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Comparison-Driven <span className="text-indigo-400">Audits</span>
              </h2>
              <div className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-fit">
                How we score
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="relative group">
                <div className="absolute -left-4 top-0 w-1 h-8 bg-indigo-500 rounded-full opacity-50 group-hover:h-full transition-all duration-500" />
                <h3 className="font-bold text-xl mb-3 flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Optimisation Score
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  Real-time analysis powered by Gemini AI. We scrape your site live to detect technical SEO gaps, content quality, and visual structure.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute -left-4 top-0 w-1 h-8 bg-cyan-500 rounded-full opacity-50 group-hover:h-full transition-all duration-500" />
                <h3 className="font-bold text-xl mb-3 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Visibility Benchmark
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  Measured against elite industry standards. We compare your readiness against a perfect "AI-first" state for modern commerce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl glass border-white/5 glass-hover">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
