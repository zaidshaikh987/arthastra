/**
 * Google ADK Implementation - Financial Council
 * 
 * Multi-Agent Debate Pattern using Google Agent Development Kit
 * Demonstrates autonomous tool selection and parallel agent execution
 */

import { Agent } from "@google/adk";

// ===============================================
// ADK AGENTS FOR FINANCIAL COUNCIL
// ===============================================

/**
 * The Optimist Agent
 * Role: Find reasons to APPROVE the loan
 */
export const optimistAgent = new Agent({
    name: "Optimist",
    model: "gemini-2.5-flash",
    description: `You are a sales-driven loan officer. Your goal is to APPROVE loans.
    Find every possible reason to say YES:
    - Potential income growth
    - Asset creation opportunities
    - Credit history strengths
    
    Be persuasive and focus on the positive. Output a punchy 2-3 sentence argument.`,
    tools: [], // Pure reasoning, no tools
});

/**
 * The Pessimist Agent
 * Role: Find reasons to REJECT the loan
 */
export const pessimistAgent = new Agent({
    name: "Pessimist",
    model: "gemini-2.5-flash",
    description: `You are a strict risk underwriter. Your goal is to PROTECT the bank.
    Identify every risk:
    - High DTI concerns
    - Economic downturn impacts
    - Credit score gaps
    
    Be skeptical and harsh. Output a critical 2-3 sentence argument.`,
    tools: [], // Pure reasoning, no tools
});

/**
 * The Judge Agent
 * Role: Make final binding decision based on debate
 */
export const judgeAgent = new Agent({
    name: "Judge",
    model: "gemini-2.5-flash",
    description: `You are an impartial compliance officer. Listen to both arguments and decide.
    Consider:
    - Optimist's strengths
    - Pessimist's risks
    - Regulatory compliance
    
    Return ONLY JSON: {"verdict": "explanation", "approved": true/false}`,
    tools: [], // Pure reasoning, no tools
});

// ===============================================
// MULTI-AGENT ORCHESTRATION (DEBATE PATTERN)
// ===============================================

/**
 * Execute Financial Council Debate
 * Pattern: Parallel debate + Sequential judgment
 */
export async function runFinancialCouncil(userData: any) {
    console.log("🏛️ ADK Council: Initiating multi-agent debate...");

    const userContext = JSON.stringify(userData);

    // Parallel Execution: Optimist and Pessimist debate simultaneously
    const [optimistArg, pessimistArg] = await Promise.all([
        optimistAgent.run(`Argue FOR approving this loan: ${userContext}`),
        pessimistAgent.run(`Argue AGAINST approving this loan: ${userContext}`),
    ]);

    console.log("✓ Debate complete (Optimist vs Pessimist)");

    // Sequential Execution: Judge makes final decision
    const judgePrompt = `
    Optimist argues: ${optimistArg}
    Pessimist warns: ${pessimistArg}
    
    User data: ${userContext}
    
    Make your final decision.
    `;

    const judgment = await judgeAgent.run(judgePrompt);

    console.log("✓ Verdict delivered");
    console.log("✅ ADK Council complete\n");

    return {
        optimist: optimistArg,
        pessimist: pessimistArg,
        judge: judgment,
    };
}
