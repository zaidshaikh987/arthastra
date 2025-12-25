import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize using working SDK (same as chatbot)
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
    let body: any = {};

    try {
        body = await req.json();

        // Optimist Agent
        const optimistPrompt = `You are 'The Optimist', a sales-driven loan officer. Find every reason to APPROVE this loan.
User Data: ${JSON.stringify(body)}
Write a punchy 2-3 sentence argument. Output purely the argument text.`;

        // Pessimist Agent  
        const pessimistPrompt = `You are 'The Pessimist', a strict risk underwriter. Find every reason to REJECT this loan.
User Data: ${JSON.stringify(body)}
Write a harsh 2-3 sentence argument. Output purely the argument text.`;

        // Parallel Execution
        const [optRes, pessRes] = await Promise.all([
            ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: optimistPrompt }] }],
            }),
            ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: pessimistPrompt }] }],
            })
        ]);

        const optimistArg = optRes.text || "Optimist pending...";
        const pessimistArg = pessRes.text || "Pessimist pending...";

        // Judge Agent (Sequential)
        const judgePrompt = `You are 'The Judge'. Listen to both sides and decide.
OPTIMIST: ${optimistArg}
PESSIMIST: ${pessimistArg}
User: Income: ₹${body.monthlyIncome}, Loan: ₹${body.loanAmount}, Credit: ${body.creditScore || 'N/A'}

Return ONLY JSON: {"verdict": "decision explanation", "approved": true/false}`;

        const judgeRes = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: judgePrompt }] }],
        });

        let judgeText = (judgeRes.text || "{}").replace(/```json/g, "").replace(/```/g, "").trim();

        // Parse judgment
        let judgment: any = {};
        try {
            const jsonMatch = judgeText.match(/\{[\s\S]*\}/);
            judgment = jsonMatch ? JSON.parse(jsonMatch[0]) : { verdict: judgeText, approved: false };
        } catch {
            judgment = { verdict: judgeText, approved: false };
        }

        return NextResponse.json({
            optimistArgument: optimistArg,
            pessimistArgument: pessimistArg,
            judgeVerdict: judgment.verdict,
            approved: judgment.approved,
        });

    } catch (error: any) {
        console.error("Council Error:", error);

        // Fallback
        const isGoodProfile = (body?.monthlyIncome || 0) > 40000 && (body?.creditScore || 0) > 700;

        return NextResponse.json({
            optimistArgument: isGoodProfile
                ? "Prime candidate! Strong income and excellent credit."
                : "Despite challenges, shows massive potential.",
            pessimistArgument: isGoodProfile
                ? "Market volatility is a risk. Check hidden liabilities."
                : "High risk! Borderline DTI and thin credit history.",
            judgeVerdict: isGoodProfile
                ? "Financial health is robust. Risk minimal. Approved."
                : "Risks outweigh potential. Cannot approve.",
            approved: isGoodProfile
        });
    }
}
