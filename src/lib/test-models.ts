import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found in .env.local");
        return;
    }

    // Use fetch to hit the API directly since listing in SDK is sometimes version-dependent
    try {
        console.log("Listing models via direct API call...");
        const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available models (v1):");
            data.models.forEach((m: any) => console.log(`- ${m.name}`));
        } else {
            console.log("No models found in v1 response:", data);
        }

        const urlBeta = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const responseBeta = await fetch(urlBeta);
        const dataBeta = await responseBeta.json();

        if (dataBeta.models) {
            console.log("\nAvailable models (v1beta):");
            dataBeta.models.forEach((m: any) => console.log(`- ${m.name}`));
        } else {
            console.log("No models found in v1beta response:", dataBeta);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
