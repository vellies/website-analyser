import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScrapedData } from "./scraper";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeWithGemini(data: ScrapedData, url: string) {
  // Using gemini-1.5-flash-latest as it is more stable across API versions
  let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const prompt = `
    Analyze the following website data for a product/commerce website:
    URL: ${url}
    Title: ${data.title}
    Description: ${data.description}
    H1s: ${data.h1.join(", ")}
    H2s: ${data.h2.join(", ")}
    Meta Tags: ${JSON.stringify(data.metaTags)}
    
    Provide a detailed report in JSON format with the following structure:
    {
      "score": number (0-100),
      "label": string (e.g., "Excellent", "Good", "Fair", "Poor"),
      "summary": string (high-level assessment),
      "categories": [
        {
          "name": "E-Commerce Fundamentals" | "Performance & Speed" | "SEO Visibility" | "Conversion Optimization",
          "score": number,
          "details": string,
          "items": [
            { "label": string, "status": "pass" | "fail" | "warning", "message": string }
          ]
        }
      ],
      "benchmark": {
        "overallScore": number (0-100 score against AI-first commerce standards),
        "verdict": string (a blunt, honest assessment of how this site compares to elite "AI-ready" storefronts),
        "metrics": [
          {
            "title": "AI Discovery & Visibility" | "Semantic Structure" | "Conversational Readiness" | "AI Technical Hygiene",
            "score": string (e.g., "75/100"),
            "status": string (e.g., "Competitive", "Laggard", "Elite"),
            "implementedItems": [string],
            "missingItems": [
              { "label": string, "description": string, "fix": string }
            ]
          }
        ]
      },
      "recommendations": [string]
    }
    
    IMPORTANT CONSTRAINTS:
    1. You MUST return exactly 4 categories with the exact names: "E-Commerce Fundamentals", "Performance & Speed", "SEO Visibility", "Conversion Optimization".
    2. You MUST return exactly 4 benchmark metrics with the exact titles: "AI Discovery & Visibility", "Semantic Structure", "Conversational Readiness", "AI Technical Hygiene".
    
    SCORING GUIDELINES:
    - Assess the site against modern "AI-ready" commerce standards (e.g., structured data, semantic clarity, bot accessibility).
    - Be critical but constructive.
    - The "benchmark" section should move beyond basic SEO to evaluate if the site is ready for future shopper agents and LLM discovery.

    Return ONLY the JSON.
  `;

  try {
    let result;
    const fallbackModels = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-2.0-flash-lite", "gemini-pro-latest"];

    let lastError = null;
    for (const modelName of fallbackModels) {
      try {
        console.log(`Attempting analysis with ${modelName}...`);
        model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        if (result) {
          console.log(`✅ Analysis successful with ${modelName}`);
          break;
        }
      } catch (e: any) {
        console.warn(`${modelName} failed:`, e.message);
        lastError = e;
      }
    }

    if (!result) {
      throw lastError || new Error("All Gemini models failed to respond.");
    }

    const response = await result.response;
    const text = response.text();

    // Extract JSON if AI includes markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
}
