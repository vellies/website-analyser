"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    BarChart3,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ArrowLeft,
    Download,
    ExternalLink,
    Loader2,
    ChevronDown,
    ChevronUp,
    Globe,
    Zap,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { ReportPDF } from "@/components/ReportPDF";

// Manual dynamic import inside handleDownload for better compatibility with Next.js/Turbopack

interface AnalysisItem {
    label: string;
    status: "pass" | "fail" | "warning";
    message: string;
}

interface AnalysisCategory {
    name: string;
    score: number;
    details: string;
    items: AnalysisItem[];
}

interface AnalysisResult {
    score: number;
    label: string;
    summary: string;
    categories: AnalysisCategory[];
    recommendations: string[];
}

export default function ReportClient() {
    const params = useParams();
    const router = useRouter();
    const decodedUrl = decodeURIComponent(params.url as string);

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
    const [expandedReferenceCategory, setExpandedReferenceCategory] = useState<number | null>(null);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const loadingSteps = [
        "Initializing secure connection...",
        "Scraping live content and metadata...",
        "Identifying e-commerce patterns...",
        "Evaluating semantic clarity...",
        "Running AI Commerce Benchmark audit...",
        "Analyzing technical SEO structure...",
        "Generating growth roadmap...",
        "Finalizing comprehensive report..."
    ];

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setAnalysisStep((prev) => (prev + 1) % loadingSteps.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [loading]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: decodedUrl }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to analyze website");
                }

                const result = await res.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [decodedUrl]);

    const handleDownload = async () => {
        if (!data || isGeneratingPdf) return;

        try {
            setIsGeneratingPdf(true);
            const { pdf: pdfFn } = await import("@react-pdf/renderer");
            const blob = await pdfFn(<ReportPDF data={data} decodedUrl={decodedUrl} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `audit-report-${decodedUrl.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF generation error:", err);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[100svh] px-4 py-8 sm:p-6 bg-[#09090b]">
                <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl">

                    {/* Scanner Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        {/* <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-[9px] sm:text-[10px] font-bold text-indigo-400 border border-indigo-500/20 mb-5 uppercase tracking-widest animate-pulse">
                            System Active: Analyzing {decodedUrl}
                        </div> */}

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tight">
                            AI Commerce <span className="text-indigo-400">Scanner</span>
                        </h2>

                        <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-xs sm:max-w-md mx-auto leading-relaxed">
                            Our AI is currently performing a deep-dive audit of your digital storefront against industry-leading benchmarks.
                        </p>
                    </div>

                    <p className="text-center mt-8 sm:mt-10 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        Estimated time remaining:
                        <span className="text-indigo-400/60 ml-1">
                            ~{Math.max(0, (loadingSteps.length - analysisStep) * 2)}s
                        </span>
                    </p>

                    {/* Scanner Console */}
                    <div className="relative p-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                        <div className="relative p-5 sm:p-6 md:p-8 rounded-[calc(1.25rem-1px)] bg-[#0d0d12]/90 backdrop-blur-xl border border-white/5 overflow-hidden">

                            {/* Scanning Line */}
                            <motion.div
                                initial={{ top: "0%" }}
                                animate={{ top: "100%" }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent z-10 opacity-50"
                            />

                            <div className="space-y-4 sm:space-y-6 relative z-0">
                                {loadingSteps.map((step, idx) => {
                                    const isCurrent = idx === analysisStep;
                                    const isPast = idx < analysisStep;

                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "flex items-start gap-3 sm:gap-4 transition-all duration-500",
                                                isCurrent
                                                    ? "opacity-100 scale-100"
                                                    : isPast
                                                        ? "opacity-40"
                                                        : "opacity-10 scale-95"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 border transition-all duration-500",
                                                    isCurrent
                                                        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-400"
                                                        : isPast
                                                            ? "bg-green-500/10 border-green-500/20 text-green-500"
                                                            : "bg-white/5 border-white/10 text-white/20"
                                                )}
                                            >
                                                {isPast ? (
                                                    <CheckCircle2 className="w-3 h-3" />
                                                ) : isCurrent ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <p
                                                    className={cn(
                                                        "text-xs sm:text-sm font-bold tracking-tight",
                                                        isCurrent
                                                            ? "text-zinc-100"
                                                            : isPast
                                                                ? "text-zinc-400"
                                                                : "text-zinc-600"
                                                    )}
                                                >
                                                    {step}
                                                </p>

                                                {isCurrent && (
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 2.5, ease: "linear" }}
                                                        className="h-1 bg-indigo-500/30 rounded-full mt-2 overflow-hidden"
                                                    >
                                                        <div className="h-full bg-indigo-500 w-full" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Glow */}
                            <div className="absolute -bottom-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-indigo-500/10 blur-[80px] pointer-events-none" />
                        </div>
                    </div>

                    {/* Footer */}

                </div>
            </div>

        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
                    <XCircle className="w-20 h-20 text-destructive relative" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Analysis Failed</h2>
                <p className="text-muted-foreground mb-8 max-w-md text-lg">{error}</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-8 py-2 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Return Home
                </button>
            </div>
        );
    }

    const { analysis, scrapedData } = data;

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100">
            {/* Sticky Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-3 py-2 flex items-center justify-between">
                    <button
                        onClick={() => router.push("/")}
                        className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-indigo-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="hidden md:flex items-center gap-6">
                        <a href="#summary" className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors">Summary</a>
                        <a href="#benchmark" className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors">Benchmark</a>
                        <a href="#audit" className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors">Live Audit</a>
                        <a href="#recommendations" className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors">Fixes</a>
                    </div>

                    <div className="flex gap-3">
                        {isMounted && (
                            <button
                                onClick={handleDownload}
                                disabled={isGeneratingPdf}
                                className={cn(
                                    "px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                                    isGeneratingPdf && "animate-pulse"
                                )}
                            >
                                {isGeneratingPdf ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {isGeneratingPdf ? "Preparing..." : "PDF"}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto p-4 md:p-6 pt-8 md:pt-12 pb-16 md:pb-24">
                {/* Header */}
                <header id="summary" className="mb-12 md:mb-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-10 mb-8 md:mb-12">
                        <div className="flex-1">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-[10px] font-bold text-cyan-400 border border-cyan-500/20 mb-3 md:mb-4 uppercase tracking-wider">
                                AI Commerce Benchmark
                            </div>
                            <h1 className="text-xl md:text-3xl font-black mb-3 md:mb-4 tracking-tight leading-tight">
                                {scrapedData.title || decodedUrl}
                            </h1>
                            <div className="flex items-center gap-3 text-muted-foreground text-xs md:text-sm font-medium">
                                <Globe className="w-4 h-4 text-cyan-400" />
                                <a href={data.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors truncate max-w-[180px] md:max-w-md">
                                    {data.url}
                                </a>
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end group">
                            <div className="relative w-32 h-32 md:w-40 md:h-40">
                                {/* Glow Effect */}
                                <div className={cn(
                                    "absolute inset-0 rounded-full blur-2xl opacity-20 transition-all duration-500 group-hover:opacity-40",
                                    (data.overallReferenceScore || 0) > 80 ? "bg-green-500" : (data.overallReferenceScore || 0) > 50 ? "bg-yellow-500" : "bg-destructive"
                                )} />
                                <svg className="w-full h-full relative" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        className="text-white/5"
                                    />
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        strokeDasharray="283"
                                        initial={{ strokeDashoffset: 283 }}
                                        animate={{ strokeDashoffset: 283 - (283 * (data.overallReferenceScore || 0)) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={cn(
                                            (data.overallReferenceScore || 0) > 80 ? "text-green-500" : (data.overallReferenceScore || 0) > 50 ? "text-yellow-500" : "text-destructive"
                                        )}
                                        strokeLinecap="round"
                                        style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)" }}
                                    />
                                    <text
                                        x="50"
                                        y="55"
                                        textAnchor="middle"
                                        className="text-2xl md:text-3xl font-black fill-white"
                                    >
                                        {data.overallReferenceScore}%
                                    </text>
                                </svg>
                            </div>
                            <div className={cn(
                                "text-[10px] md:text-sm font-black mt-3 md:mt-4 uppercase tracking-[0.2em]",
                                (data.overallReferenceScore || 0) > 80 ? "text-green-500" : (data.overallReferenceScore || 0) > 50 ? "text-yellow-500" : "text-destructive"
                            )}>
                                AI COMMERCE READINESS
                            </div>
                        </div>
                    </div>

                    {/* Primary Verdict: The Blunt Truth */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-3xl blur opacity-5 group-hover:opacity-10 transition duration-500" />
                        <div className="relative p-6 md:p-10 rounded-3xl bg-[#0d0d12] border border-white/5">
                            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                                <Zap className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                                The Blunt Truth
                            </h2>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium italic">
                                "{data.referenceVerdict}"
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="space-y-16 md:space-y-24">
                    {/* AI Commerce Audit Section */}
                    {data.parsedReferenceMetrics && (
                        <section id="benchmark" className="relative">
                            <div className="flex items-center gap-4 mb-8 md:mb-10">
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight">AI Commerce <span className="text-cyan-400">Benchmark</span></h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                            </div>

                            {(data.overallReferenceScore !== null || data.referenceVerdict) && (
                                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#0d0d12] border border-white/5 mb-8 md:mb-12 flex flex-col md:flex-row items-center gap-8 md:gap-10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />

                                    {data.overallReferenceScore !== null && (
                                        <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="5"
                                                    className="text-white/[0.03]"
                                                />
                                                <motion.circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="5"
                                                    strokeDasharray="283"
                                                    initial={{ strokeDashoffset: 283 }}
                                                    animate={{ strokeDashoffset: 283 - (283 * data.overallReferenceScore) / 100 }}
                                                    transition={{ duration: 2, ease: "easeOut" }}
                                                    className={cn(
                                                        data.overallReferenceScore > 80 ? "text-green-500" : data.overallReferenceScore > 50 ? "text-yellow-500" : "text-destructive"
                                                    )}
                                                    strokeLinecap="round"
                                                    style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)" }}
                                                />
                                                <text
                                                    x="50"
                                                    y="58"
                                                    textAnchor="middle"
                                                    className="text-2xl md:text-3xl font-black fill-white"
                                                >
                                                    {data.overallReferenceScore}%
                                                </text>
                                            </svg>
                                        </div>
                                    )}
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2 md:mb-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                            <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">Industry Benchmark</h3>
                                        </div>
                                        <p className="text-xl md:text-2xl font-bold text-zinc-100 leading-tight mb-3 md:mb-4">
                                            The Blunt Truth
                                        </p>
                                        <p className="text-base md:text-lg text-muted-foreground/90 italic leading-relaxed max-w-2xl font-medium">
                                            "{data.referenceVerdict || "Reference audit data analyzed."}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Parsed Metrics List (Toggleable) */}
                            <div className="space-y-3 md:space-y-4">
                                {data.parsedReferenceMetrics.map((metric: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "rounded-2xl border transition-all duration-300 overflow-hidden",
                                            expandedReferenceCategory === idx ? "bg-[#0d0d12] border-white/10" : "bg-[#09090b] border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <button
                                            onClick={() => setExpandedReferenceCategory(expandedReferenceCategory === idx ? null : idx)}
                                            className="w-full flex items-center justify-between p-4 md:p-6 text-left group"
                                        >
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className={cn(
                                                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-[10px] md:text-xs font-black shrink-0 border",
                                                    metric.score && parseInt(metric.score) > 80 ? "bg-green-500/5 text-green-500 border-green-500/10" : (metric.score && parseInt(metric.score) > 50 ? "bg-yellow-500/5 text-yellow-500 border-yellow-500/10" : "bg-destructive/5 text-destructive border-destructive/10")
                                                )}>
                                                    {metric.score ? metric.score.split('/')[0].trim() + '%' : "N/A"}
                                                </div>
                                                <div>
                                                    <h3 className="text-base md:text-lg font-bold group-hover:text-cyan-400 transition-colors">{metric.title}</h3>
                                                    {metric.status && (
                                                        <p className="text-[9px] md:text-[10px] font-black text-cyan-400/70 uppercase tracking-[0.15em] mt-1">{metric.status}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform",
                                                expandedReferenceCategory === idx && "rotate-180 bg-white/5"
                                            )}>
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {expandedReferenceCategory === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 md:px-8 pb-8 md:pb-10 pt-2 space-y-8 md:space-y-10">
                                                        {metric.implementedItems && metric.implementedItems.length > 0 && (
                                                            <div>
                                                                <h4 className="text-[9px] md:text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-4 md:mb-5 flex items-center gap-2">
                                                                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500" /> Detected Strengths
                                                                </h4>
                                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                                    {metric.implementedItems.map((item: string, iIdx: number) => (
                                                                        <li key={iIdx} className="text-xs md:text-sm text-zinc-400 p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                                                                            <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500/40 mt-0.5 shrink-0" />
                                                                            {item}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {metric.missingItems && metric.missingItems.length > 0 && (
                                                            <div>
                                                                <h4 className="text-[9px] md:text-[10px] font-black text-destructive uppercase tracking-[0.2em] mb-4 md:mb-5 flex items-center gap-2">
                                                                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-destructive" /> Improvement Gaps
                                                                </h4>
                                                                <div className="space-y-3 md:space-y-4">
                                                                    {metric.missingItems.map((item: any, mIdx: number) => (
                                                                        <div key={mIdx} className="p-4 md:p-6 rounded-2xl bg-[#121216] border border-white/5 relative overflow-hidden active:scale-[0.99] transition-transform">
                                                                            <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                                                                                <div className="w-6 h-6 rounded-lg bg-destructive/10 flex items-center justify-center mt-0.5 shrink-0">
                                                                                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm md:text-base font-bold text-zinc-100">{item.label}</p>
                                                                                    {item.description && (
                                                                                        <p className="text-xs md:text-sm text-muted-foreground/70 mt-1.5 leading-relaxed">{item.description}</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            {item.fix && (
                                                                                <div className="mt-4 md:mt-6 p-4 md:p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 relative">
                                                                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                                                                        <Zap className="w-10 h-10 md:w-12 md:h-12 text-indigo-400" />
                                                                                    </div>
                                                                                    <h5 className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 md:mb-3">
                                                                                        Actionable Solution
                                                                                    </h5>
                                                                                    <p className="text-xs md:text-sm text-indigo-300/90 leading-relaxed font-bold">
                                                                                        {item.fix}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Live Audit Section */}
                    <section id="audit">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tight tracking-tight">Technical <span className="text-indigo-400">Live Audit</span></h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                </div>
                                <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {analysis.summary}
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end shrink-0">
                                <div className="relative w-20 h-20 md:w-24 md:h-24">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                                        <motion.circle
                                            cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283"
                                            initial={{ strokeDashoffset: 283 }}
                                            animate={{ strokeDashoffset: 283 - (283 * analysis.score) / 100 }}
                                            className={cn(analysis.score > 80 ? "text-green-500" : analysis.score > 50 ? "text-yellow-500" : "text-destructive")}
                                            strokeLinecap="round"
                                            style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)" }}
                                        />
                                        <text x="50" y="58" textAnchor="middle" className="text-2xl font-black fill-white">{analysis.score}%</text>
                                    </svg>
                                </div>
                                <div className="text-[10px] font-black mt-2 text-muted-foreground uppercase tracking-widest">
                                    Tech Score
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            {analysis.categories.map((category: AnalysisCategory, idx: number) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "rounded-2xl border transition-all duration-300 overflow-hidden",
                                        expandedCategory === idx ? "bg-[#0d0d12] border-white/10 shadow-2xl" : "bg-[#09090b] border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-4 md:p-6 text-left group"
                                    >
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className={cn(
                                                "w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-sm font-black transition-colors shadow-inner",
                                                category.score > 80 ? "bg-green-500/5 text-green-500 border border-green-500/10" : category.score > 50 ? "bg-yellow-500/5 text-yellow-500 border border-yellow-500/10" : "bg-destructive/5 text-destructive border border-destructive/10"
                                            )}>
                                                {category.score}%
                                            </div>
                                            <div>
                                                <h3 className="text-base md:text-lg font-bold group-hover:text-indigo-400 transition-colors">{category.name}</h3>
                                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">{category.items.length} Points Inspected</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform",
                                            expandedCategory === idx && "rotate-180 bg-white/5"
                                        )}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {expandedCategory === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 md:px-8 pb-6 md:pb-8 pt-2">
                                                    <div className="p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/5 mb-6 md:mb-8 text-xs md:text-sm text-muted-foreground leading-relaxed italic">
                                                        "{category.details}"
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                        {category.items.map((item, itemIdx) => (
                                                            <div key={itemIdx} className="flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group/item">
                                                                <div className="mt-1">
                                                                    {item.status === "pass" ? (
                                                                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                                                                    ) : item.status === "warning" ? (
                                                                        <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                                                                    ) : (
                                                                        <XCircle className="w-4 h-4 md:w-5 md:h-5 text-destructive" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-xs md:text-sm tracking-tight">{item.label}</h4>
                                                                    <p className="text-[10px] md:text-xs text-muted-foreground/80 mt-1.5 leading-relaxed">{item.message}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recommendations Section */}
                    <section id="recommendations">
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                                <Zap className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
                                Growth <span className="text-indigo-400">Roadmap</span>
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {analysis.recommendations.map((rec: string, idx: number) => (
                                <div key={idx} className="p-6 md:p-8 rounded-3xl border border-indigo-500/10 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors flex items-start gap-4 md:gap-6 relative group">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 text-xs md:text-sm font-black shadow-lg shadow-indigo-600/20">
                                        {idx + 1}
                                    </div>
                                    <p className="text-base md:text-lg leading-snug font-bold text-zinc-100/90">{rec}</p>
                                    <div className="absolute top-4 right-4 text-indigo-400/10 group-hover:text-indigo-400/30 transition-colors">
                                        <ArrowRight className="w-8 h-8 md:w-12 md:h-12 -rotate-45" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer CTA */}
            <footer className="mt-20 md:mt-32 p-8 md:p-16 bg-[#0d0d12] border-t border-white/5 overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                <div className="max-w-2xl mx-auto text-center relative z-10">
                    <h2 className="text-2xl md:text-4xl font-black mb-4 md:mb-6 tracking-tight leading-tight">Ready to Domininate AI-First Search?</h2>
                    <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-12 leading-relaxed">
                        Don't let your storefront get left behind. Implement these fixes today and capture the next wave of commerce visibility.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button className="w-full md:w-auto px-8 md:px-10 py-2 md:py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-base md:text-lg transition-all shadow-xl shadow-indigo-600/25 active:scale-95">
                            Book Strategy Session
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
