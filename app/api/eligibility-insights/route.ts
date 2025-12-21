import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const userData = await req.json()

    const prompt = `You are an expert Indian loan eligibility analyst. Analyze the user's profile and provide detailed insights.

User Profile:
- Monthly Income: ₹${userData.monthlyIncome}
- Existing EMI: ₹${userData.existingEMI}
- Credit Score: ${userData.creditScore || "Not provided"}
- Employment Type: ${userData.employmentType}
- Years with Employer: ${userData.yearsWithEmployer}
- Debt-to-Income Ratio: ${userData.dti}%

Provide:
1. Overall assessment of their loan eligibility (2-3 sentences)
2. 3-4 key strengths in their profile
3. 2-3 areas that could be improved
4. A detailed improvement plan with 3-5 actionable steps, each with:
   - Specific action to take
   - Expected impact on eligibility
   - Realistic timeframe
5. Approval odds percentage (0-100) based on Indian lending standards

Return ONLY valid JSON in this exact format:
{
  "overallAssessment": "string",
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string"],
  "improvementPlan": [
    {
      "action": "string",
      "impact": "string",
      "timeframe": "string"
    }
  ],
  "approvalOdds": number
}`

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    })

    const text = response.text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response")
    }
    const parsed = JSON.parse(jsonMatch[0])

    return Response.json(parsed)
  } catch (error: any) {
    console.error("[v0] Eligibility insights API error:", error)

    if (error?.message?.includes("quota") || error?.message?.includes("429")) {
      return Response.json({ error: "API quota exceeded. Please try again in a few moments." }, { status: 429 })
    }

    return Response.json({ error: "Failed to generate insights. Please try again later." }, { status: 500 })
  }
}
