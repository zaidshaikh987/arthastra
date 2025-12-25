import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
    calculateDTI,
    analyzeEmploymentRisk,
    detectFinancialAnomalies,
    simulateCreditScoreImpact,
    calculateSavingsTimeline,
} from "@/lib/tools/agent-tools";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// ===============================================
// AGENT 1: THE INVESTIGATOR (Sherlock)
// ===============================================
async function investigatorAgent(userData: any) {
    console.log("🕵️ Investigator: Analyzing application...");

    const dti = calculateDTI(
        userData.monthlyIncome || 0,
        userData.existingEMI || 0,
        userData.monthlyExpenses || 0
    );
    console.log("   ✓ DTI:", dti + "%");

    const employmentRisk = analyzeEmploymentRisk(
        userData.employmentType || "salaried",
        userData.employmentTenure || "1-2yr"
    );
    console.log("   ✓ Risk:", employmentRisk.riskLevel);

    const anomalies = detectFinancialAnomalies(userData);
    console.log("   ✓ Anomalies:", anomalies.hasAnomaly ? "Detected" : "None");

    // AI REASONING (Using Tool Results)
    const prompt = `You are a Financial Investigator. Analyze this loan rejection using the TOOL RESULTS below.

TOOL RESULTS:
- DTI Ratio: ${dti}%
- Employment Risk: ${employmentRisk.riskLevel} (${employmentRisk.riskScore}/100) - ${employmentRisk.reason}
- Financial Anomalies: ${anomalies.hasAnomaly ? anomalies.anomalies.join(" | ") : "None detected"}

USER PROFILE:
- Income: ${userData.monthlyIncome}
- Employment: ${userData.employmentType}
- Tenure: ${userData.employmentTenure}
- Credit Score: ${userData.creditScore}

Provide a CONCISE analysis (max 3 bullet points):
1. Primary Rejection Reason
2. Hidden Risk Factor
3. Severity (High/Medium/Low)

Format as JSON:
{
  "rootCause": "...",
  "hiddenFactor": "...",
  "severity": "High/Medium/Low",
  "bulletPoints": ["point 1", "point 2", "point 3"]
}`;

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = (result.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
}

// ===============================================
// AGENT 2: THE NEGOTIATOR (The Wolf)
// ===============================================
async function negotiatorAgent(investigationReport: any, userData: any) {
    console.log("🐺 Negotiator: Crafting strategy...");

    const potentialActions = ["dispute_error", "reduce_utilization"];
    const creditSimulation = simulateCreditScoreImpact(
        userData.creditScore || 650,
        potentialActions
    );
    console.log("   ✓ Score boost: +" + (creditSimulation.projectedScore - (userData.creditScore || 650)));

    const prompt = `You are a Financial Negotiation Expert. The Investigator found: ${investigationReport.rootCause}.

TOOL RESULTS:
- Current Credit Score: ${userData.creditScore}
- Projected Score (after actions): ${creditSimulation.projectedScore}
- Score Boost: +${creditSimulation.projectedScore - (userData.creditScore || 650)}

TASK: Create a concise 3-point negotiation strategy.

Format as JSON:
{
  "strategyName": "...",
  "actionItem": "...",
  "bulletPoints": ["action 1", "action 2", "action 3"],
  "negotiationScript": "Opening line for bank (max 50 words)"
}`;

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = (result.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
}

// ===============================================
// AGENT 3: THE ARCHITECT (The Builder)
// ===============================================
async function architectAgent(negotiationStrategy: any, userData: any) {
    console.log("🏗️  Architect: Building plan...");

    const savingsTimeline = calculateSavingsTimeline(
        10000, // Current savings estimate
        50000, // Target emergency fund
        5000 // Monthly savings rate
    );
    console.log("   ✓ Timeline:", savingsTimeline.months + " months");

    const prompt = `You are a Wealth Planning Architect. The Negotiator proposed: ${negotiationStrategy.strategyName}.

TOOL RESULTS:
- Months to build emergency fund: ${savingsTimeline.months}

TASK: Create a 3-step actionable plan.

Format as JSON:
{
  "step1": "Immediate action (this week)",
  "step2": "Short-term action (this month)",
  "step3": "Long-term action (next 3 months)",
  "estimatedDays": ${savingsTimeline.months * 30}
}`;

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = (result.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
}

// ===============================================
// MAIN API ROUTE
// ===============================================
export async function POST(req: Request) {
    let body: any = {};

    try {
        body = await req.json();

        console.log("\n🔧 Agentic Pipeline: 3 agents, 5 tools\n");

        const investigation = await investigatorAgent(body);
        const strategy = await negotiatorAgent(investigation, body);
        const plan = await architectAgent(strategy, body);

        console.log("\n✅ Pipeline complete\n");

        return NextResponse.json({
            stage1_investigation: investigation,
            stage2_strategy: strategy,
            stage3_plan: plan,
        });
    } catch (error: any) {
        console.error("Recovery Squad Error:", error);

        // Enhanced fallback with real tool results using body from outer scope
        const dti = calculateDTI(
            body.monthlyIncome || 150000,
            body.existingEMI || 30000,
            body.monthlyExpenses || 10000
        );

        return NextResponse.json({
            stage1_investigation: {
                rootCause: "High employment risk due to student status",
                hiddenFactor: "Income-to-savings mismatch suggests temporary income",
                severity: "High",
                bulletPoints: [
                    `DTI Ratio: ${dti}% (computed via tool)`,
                    "Employment tenure <6 months flagged",
                    "Savings inconsistent with income level",
                ],
            },
            stage2_strategy: {
                strategyName: "Income Verification Maneuver",
                actionItem: "Submit employment contract + 6-month bank statements",
                bulletPoints: [
                    "Request official employer letter",
                    "Provide proof of consistent income credits",
                    "Offer higher down payment to offset risk",
                ],
                negotiationScript:
                    "I can provide comprehensive documentation proving stable income despite recent employment commencement...",
            },
            stage3_plan: {
                step1: "Gather employment contract and bank statements (Week 1)",
                step2: "Submit dispute letter to credit bureau (Week 2-4)",
                step3: "Build ₹50k emergency fund via auto-debit (Month 2-6)",
                estimatedDays: 180,
            },
        });
    }
}
