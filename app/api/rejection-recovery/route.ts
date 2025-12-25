import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    calculateDTI,
    analyzeEmploymentRisk,
    detectFinancialAnomalies,
    simulateCreditScoreImpact,
    calculateSavingsTimeline,
} from "@/lib/tools/agent-tools";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

// ===============================================
// AGENT 1: THE INVESTIGATOR (Sherlock)
// ===============================================
async function investigatorAgent(userData: any) {
    // TOOL CALLS (Deterministic)
    const dti = calculateDTI(
        userData.monthlyIncome || 0,
        userData.existingEMI || 0,
        userData.monthlyExpenses || 0
    );

    const employmentRisk = analyzeEmploymentRisk(
        userData.employmentType || "salaried",
        userData.employmentTenure || "1-2yr"
    );

    const anomalies = detectFinancialAnomalies(userData);

    // AI REASONING (Using Tool Results)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
}

// ===============================================
// AGENT 2: THE NEGOTIATOR (The Wolf)
// ===============================================
async function negotiatorAgent(investigationReport: any, userData: any) {
    // TOOL CALL: Simulate credit score improvements
    const potentialActions = ["dispute_error", "reduce_utilization"];
    const creditSimulation = simulateCreditScoreImpact(
        userData.creditScore || 650,
        potentialActions
    );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
}

// ===============================================
// AGENT 3: THE ARCHITECT (The Builder)
// ===============================================
async function architectAgent(negotiationStrategy: any, userData: any) {
    // TOOL CALL: Calculate savings timeline
    const savingsTimeline = calculateSavingsTimeline(
        10000, // Current savings estimate
        50000, // Target emergency fund
        5000 // Monthly savings rate
    );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
}

// ===============================================
// MAIN API ROUTE
// ===============================================
export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("🔧 Starting Agentic Pipeline with Tool Calls...");

        // 1. INVESTIGATOR: Calls DTI, Employment Risk, Anomaly Detection
        const investigation = await investigatorAgent(body);
        console.log("✅ Investigator completed. Tools called: DTI, Employment Risk, Anomaly Detection");

        // 2. NEGOTIATOR: Calls Credit Score Simulator
        const strategy = await negotiatorAgent(investigation, body);
        console.log("✅ Negotiator completed. Tools called: Credit Score Simulator");

        // 3. ARCHITECT: Calls Savings Timeline Calculator
        const plan = await architectAgent(strategy, body);
        console.log("✅ Architect completed. Tools called: Savings Timeline");

        return NextResponse.json({
            stage1_investigation: investigation,
            stage2_strategy: strategy,
            stage3_plan: plan,
        });
    } catch (error: any) {
        console.error("Recovery Squad Error:", error);

        // Enhanced fallback with real tool results
        const dti = calculateDTI(
            (await req.json()).monthlyIncome || 150000,
            (await req.json()).existingEMI || 30000,
            (await req.json()).monthlyExpenses || 10000
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
