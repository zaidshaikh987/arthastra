import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini directly (Bypassing Genkit path issues on Windows)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Define Persona Prompts
        const optimistPrompt = "You are 'The Optimist', a sales-driven loan officer. Your goal is to APPROVE this loan. Find every possible reason to say YES. Focus on: Potential income growth, stability, asset creation. Ignore the risks or downplay them. User Data: " + JSON.stringify(body) + ". Write a short, punchy argument (2-3 sentences) supporting this user. Output purely the argument text.";

        const pessimistPrompt = "You are 'The Pessimist', a strict risk underwriter. Your goal is to REJECT this loan to protect the bank. Focus on: High DTI, credit score gaps, economic downturns. Be skeptical and harsh. User Data: " + JSON.stringify(body) + ". Write a short, punchy argument (2-3 sentences) rejecting this user. Output purely the argument text.";

        // 2. Parallel Execution (Real-time Multi-Agent)
        const [optRes, pessRes] = await Promise.all([
            model.generateContent(optimistPrompt),
            model.generateContent(pessimistPrompt)
        ]);

        const optimistArg = optRes.response.text();
        const pessimistArg = pessRes.response.text();

        // 3. The Judge (Sequential Execution)
        const judgePrompt = "You are 'The Judge', an impartial compliance officer. The Optimist said: " + JSON.stringify(optimistArg) + ". The Pessimist said: " + JSON.stringify(pessimistArg) + ". User Financials: Income: " + body.monthlyIncome + ", Loan: " + body.loanAmount + ", Score: " + (body.creditScore || 'N/A') + ". Make a final binding decision. Return ONLY a JSON object in this format (no markdown): { \"verdict\": \"string explaining decision\", \"approved\": boolean }";

        const judgeRes = await model.generateContent(judgePrompt);

        // Fix: Use simple string replacement without regex literals to avoid build tool parsing issues
        let judgeText = judgeRes.response.text();
        judgeText = judgeText.replace("```json", "").replace("```", "").trim();

        // Safety Clean up
        if (judgeText.startsWith("```")) {
            judgeText = judgeText.slice(3);
        }
        if (judgeText.endsWith("```")) {
            judgeText = judgeText.slice(0, -3);
        }

        const judgment = JSON.parse(judgeText);

        return NextResponse.json({
            optimistArgument: optimistArg,
            pessimistArgument: pessimistArg,
            judgeVerdict: judgment.verdict,
            approved: judgment.approved,
        });

    } catch (error: any) {
        console.error("Council Flow Error:", error);
        return NextResponse.json(
            { error: "The Council refused to meet.", details: error.message },
            { status: 500 }
        );
    }
}
