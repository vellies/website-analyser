import { NextRequest, NextResponse } from 'next/server';
import { scrapeWebsite } from '@/lib/scraper';
import { analyzeWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Basic URL validation
        let targetUrl = url;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = `https://${targetUrl}`;
        }

        console.log(`Analyzing: ${targetUrl}`);

        const scrapedData = await scrapeWebsite(targetUrl);
        const analysis = await analyzeWithGemini(scrapedData, targetUrl);

        // Extract benchmark data from AI response
        const benchmark = analysis.benchmark || {};
        const parsedReferenceMetrics = benchmark.metrics || [];
        const referenceVerdict = benchmark.verdict || "";
        const overallReferenceScore = benchmark.overallScore ?? null;

        return NextResponse.json({
            url: targetUrl,
            scrapedData,
            analysis,
            parsedReferenceMetrics,
            overallReferenceScore,
            referenceVerdict
        });
    } catch (error: any) {
        console.error('Analysis API error:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred during analysis' },
            { status: 500 }
        );
    }
}
