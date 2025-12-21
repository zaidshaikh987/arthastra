import { GoogleGenAI } from "@google/genai"

export const maxDuration = 30

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages, language = "en" } = await req.json()
    const lastMessage = messages[messages.length - 1]
    const context = lastMessage.context

    const systemPrompt = `You are ArthAstra Assistant, an expert Indian loan advisor. You provide personalized guidance for loan seekers in India.

LANGUAGE PREFERENCE: ${language === "hi" ? "Respond in Hindi (Devanagari script). Use simple, conversational Hindi." : "Respond in English with occasional Hindi terms where helpful."}

CORE EXPERTISE:
- Loan eligibility assessment (income, DTI, credit scores, CIBIL)
- EMI calculations and loan structuring
- Credit improvement strategies for Indian consumers
- Joint application benefits and co-borrower analysis
- Lender comparison (HDFC, ICICI, Axis, SBI, Kotak, etc.)
- Document preparation for Indian loan applications
- Interest rate negotiation tactics
- Indian banking regulations and RBI guidelines
- Rejection recovery strategies
- Multi-goal loan planning

CONTEXT AWARENESS:
${context ? `User Profile: ${JSON.stringify(context)}` : "No user profile available yet."}

RESPONSE GUIDELINES:
1. Always use Indian Rupees (₹) for amounts
2. Reference Indian banks and financial institutions
3. Consider Indian credit scoring (CIBIL, Experian, Equifax, CRIF)
4. Provide specific, actionable recommendations
5. Calculate EMIs accurately using standard formulas
6. Consider Indian tax benefits (Section 80C, 24B) when relevant
7. Reference current RBI repo rates and lending policies
8. Keep responses concise and helpful (max 3-4 paragraphs)

TONE:
- Friendly and supportive, like a trusted financial advisor
- Clear and jargon-free explanations
- Empowering and confidence-building
- Patient with first-time borrowers`

    const conversationHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...conversationHistory,
        { role: "user", parts: [{ text: lastMessage.content }] },
      ],
    })

    const text = response.text

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Chat API error:", error)

    if (error?.message?.includes("quota") || error?.message?.includes("429")) {
      return new Response(
        JSON.stringify({
          error: "API quota exceeded. Please try again in a few moments.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      )
    }

    return new Response(
      JSON.stringify({
        error: error?.message || "Failed to get response. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
