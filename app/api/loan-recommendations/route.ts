import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const userData = await req.json()

    const prompt = `You are an expert Indian loan advisor. Based on the user's profile, recommend the top 3 most suitable personal loan offers from Indian banks.

User Profile:
- Monthly Income: ₹${userData.monthlyIncome}
- Existing EMI: ₹${userData.existingEMI}
- Credit Score: ${userData.creditScore || "Not available"}
- Employment: ${userData.employmentType}
- Loan Amount Needed: ₹${userData.loanAmount}
- Tenure: ${userData.tenure} years

Consider major Indian banks: HDFC, ICICI, Axis, Kotak, SBI, IndusInd, Yes Bank.

For each recommendation:
1. Match interest rates realistically (10-14% range for good profiles)
2. Calculate accurate monthly EMI using the formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
3. Assess approval probability based on DTI ratio, credit score, and income stability
4. Provide specific reasons why this loan suits their profile
5. List 2-3 key benefits

Also provide overall advice on:
- Best time to apply
- Documents to prepare
- How to improve approval chances

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "bankName": "string",
      "productName": "string",
      "interestRate": number,
      "processingTime": number,
      "approvalProbability": number,
      "monthlyEMI": number,
      "reasonForRecommendation": "string",
      "keyBenefits": ["string", "string", "string"]
    }
  ],
  "overallAdvice": "string"
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
    // Parse the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response")
    }
    const parsed = JSON.parse(jsonMatch[0])

    return Response.json(parsed)
  } catch (error: any) {
    console.error("[v0] Loan recommendations API error:", error)

    if (error?.message?.includes("quota") || error?.message?.includes("429")) {
      return Response.json({ error: "API quota exceeded. Please try again in a few moments." }, { status: 429 })
    }

    return Response.json({ error: "Failed to generate recommendations. Please try again later." }, { status: 500 })
  }
}
