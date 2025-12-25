# Google ADK Integration

## Overview

ArthAstra leverages **Google's Agent Development Kit (@google/adk)** for building production-grade agentic AI systems. This integration enables autonomous multi-agent workflows with intelligent tool selection and coordinated reasoning.

## Architecture

### Multi-Agent Systems

**Recovery Squad** (Sequential Pipeline)
```
User Data → Investigator Agent → Negotiator Agent → Architect Agent → Recovery Plan
              ↓ (3 tools)         ↓ (1 tool)         ↓ (1 tool)
```

**Financial Council** (Debate Pattern)
```
User Data → [Optimist Agent ⚡ Pessimist Agent] → Judge Agent → Final Decision
            (Parallel Debate)                      (Sequential Judgment)
```

## Agent Definitions

### Recovery Squad Agents

#### 1. Investigator Agent
- **Role:** Root cause analysis of loan rejection
- **Tools:**
  - `calculateDTI` - Compute debt-to-income ratio
  - `analyzeEmploymentRisk` - Assess job stability
  - `detectFinancialAnomalies` - Flag data inconsistencies
- **Output:** Structured investigation report with severity rating

#### 2. Negotiator Agent  
- **Role:** Strategy development and bank negotiation
- **Tools:**
  - `simulateCreditScoreImpact` - Project CIBIL improvements
- **Output:** 3-point action plan + negotiation script

#### 3. Architect Agent
- **Role:** Build comprehensive recovery timeline
- **Tools:**
  - `calculateSavingsTimeline` - Calculate months to financial goals
- **Output:** Step-by-step plan with estimated days

### Financial Council Agents

#### 1. Optimist Agent
- **Role:** Find reasons to APPROVE the loan
- **Pattern:** Pure reasoning (no tools)
- **Output:** Persuasive 2-3 sentence argument

#### 2. Pessimist Agent
- **Role:** Find reasons to REJECT the loan  
- **Pattern:** Pure reasoning (no tools)
- **Output:** Critical 2-3 sentence risk assessment

#### 3. Judge Agent
- **Role:** Make final binding decision
- **Pattern:** Sequential reasoning after debate
- **Output:** JSON verdict with approval boolean

## Tool Registry

All agent tools are defined in `lib/tools/agent-tools.ts`:

| Tool | Type | Description |
|------|------|-------------|
| `calculateDTI` | Financial | Compute debt-to-income ratio |
| `analyzeEmploymentRisk` | Risk Assessment | Score job stability (0-100) |
| `detectFinancialAnomalies` | Validation | Flag data inconsistencies |
| `simulateCreditScoreImpact` | Simulation | Project CIBIL score changes |
| `calculateSavingsTimeline` | Planning | Compute months to savings goal |

## Agentic Patterns Used

1. **Sequential Handoffs** (Recovery Squad)
   - Agent 1 outputs feed Agent 2 inputs
   - Context passed via structured JSON
   - Tools called autonomously by each agent

2. **Parallel Debate** (Financial Council)
   - Two agents reason simultaneously
   - Third agent judges based on both arguments
   - Mimics real credit committee deliberation

3. **Autonomous Tool Selection**
   - Agents decide which tools to call based on context
   - No hardcoded tool sequences
   - Model-driven decision making

## Implementation Files

- `lib/agents/adk-recovery-squad.ts` - Recovery Squad ADK implementation
- `lib/agents/adk-council.ts` - Financial Council ADK implementation  
- `app/api/rejection-recovery/route.ts` - Production API (hybrid approach)
- `app/api/council-meeting/route.ts` - Production API (hybrid approach)

## Why ADK?

**Traditional Approach:**
- Developer hardcodes tool sequences
- Fixed agent pipelines
- Manual orchestration

**ADK Approach:**
- Agents autonomously select tools
- Dynamic reasoning paths
- Self-coordinating workflows

**Result:** More flexible, intelligent, and production-ready agentic systems.

## Hackathon Compliance

✅ **Google Cloud:** Gemini 2.5 Flash via Vertex AI  
✅ **Agentic AI:** Multi-agent architecture with autonomous tool use  
✅ **Tool Integration:** 5 specialized financial calculators  
✅ **Production Ready:** Deterministic tools + AI reasoning hybrid
