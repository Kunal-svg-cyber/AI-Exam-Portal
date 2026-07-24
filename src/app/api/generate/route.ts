import { NextRequest, NextResponse } from "next/server";
import { AiService } from "@/lib/services/ai";

export const maxDuration = 60; // Max execution duration for Vercel Serverless

export async function POST(req: NextRequest) {
  try {
    // 1. Get the Grok API Key from Authorization Header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization header. Please connect your Grok API key." },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace("Bearer ", "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Unauthorized: API key is empty." },
        { status: 401 }
      );
    }

    // 2. Parse request parameters
    const body = await req.json();

    // 3. Delegate execution directly to the reusable AI Service Layer
    const assessment = await AiService.generateAssessment(apiKey, body);

    // 4. Return outcome assessment
    return NextResponse.json(assessment);
  } catch (error: any) {
    console.error("Error generating assessment:", error);
    
    // Check if it's an API error mapped by our error handler (usually holds 'Grok API Error' in text)
    const isApiError = error.message && error.message.includes("Grok API Error");
    const status = isApiError ? 502 : 500;
    
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during generation." },
      { status }
    );
  }
}
