"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Download,
} from "lucide-react"

export default function EligibilityReport() {
  const [report, setReport] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("onboardingData")
    if (data) {
      const parsedData = JSON.parse(data)
      const calculations = calculateDetailedEligibility(parsedData)
      setReport(calculations)
    }
  }, [])

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Eligibility Report</h1>
          <p className="text-gray-600">Comprehensive analysis of your loan application</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Overall Status</h3>
            {report.overallStatus === "approved" ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : report.overallStatus === "review" ? (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div
            className={`text-2xl font-bold mb-2 ${
              report.overallStatus === "approved"
                ? "text-green-600"
                : report.overallStatus === "review"
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {report.overallStatus === "approved"
              ? "Eligible"
              : report.overallStatus === "review"
                ? "Under Review"
                : "Not Eligible"}
          </div>
          <p className="text-sm text-gray-600">{report.statusMessage}</p>
        </Card>

        <Card className="p-6 border-2 border-teal-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Max Loan Amount</h3>
            <DollarSign className="w-6 h-6 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-teal-600 mb-2">₹{report.maxAmount.toLocaleString("en-IN")}</div>
          <p className="text-sm text-gray-600">Based on your income & profile</p>
        </Card>

        <Card className="p-6 border-2 border-cyan-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Approval Odds</h3>
            <Percent className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="text-3xl font-bold text-cyan-600 mb-2">{report.approvalOdds}%</div>
          <Progress value={report.approvalOdds} className="h-2" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Eligibility Factors</h3>
          <div className="space-y-4">
            {report.factors.map((factor: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    factor.status === "pass"
                      ? "bg-green-100"
                      : factor.status === "warning"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                  }`}
                >
                  {factor.status === "pass" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : factor.status === "warning" ? (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                    <span className="text-sm font-medium text-gray-600">{factor.score}/100</span>
                  </div>
                  <Progress value={factor.score} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Summary</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Monthly Income</span>
                <span className="font-bold text-gray-900">
                  ₹{report.financials.monthlyIncome.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Existing EMI</span>
                <span className="font-bold text-gray-900">
                  ₹{report.financials.existingEMI.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Monthly Expenses</span>
                <span className="font-bold text-gray-900">
                  ₹{report.financials.monthlyExpenses.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Available for EMI</span>
                <span className="font-bold text-emerald-600">
                  ₹{report.financials.availableForEMI.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">Debt-to-Income Ratio</span>
                <span
                  className={`font-bold ${report.financials.dti > 50 ? "text-red-600" : report.financials.dti > 40 ? "text-yellow-600" : "text-emerald-600"}`}
                >
                  {report.financials.dti.toFixed(1)}%
                </span>
              </div>
              <Progress value={Math.min(report.financials.dti, 100)} className="h-2 mb-2" />
              <p className="text-xs text-gray-600">
                {report.financials.dti > 50
                  ? "High DTI - Consider reducing existing debt"
                  : report.financials.dti > 40
                    ? "Moderate DTI - Room for improvement"
                    : "Healthy DTI - Good financial position"}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Estimated Monthly EMI</h4>
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                ₹{report.financials.estimatedEMI.toLocaleString("en-IN")}
              </div>
              <p className="text-sm text-gray-600">
                For ₹{report.maxAmount.toLocaleString("en-IN")} at {report.financials.interestRate}% for{" "}
                {report.financials.tenure} years
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recommendations to Improve</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.recommendations.map((rec: any, index: number) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg"
            >
              {rec.impact === "high" ? (
                <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <TrendingDown className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                  {rec.impact === "high" ? "+15-20% approval odds" : "+5-10% approval odds"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function calculateDetailedEligibility(data: any) {
  // Extract user data with proper defaults
  const monthlyIncome = Number(data.monthlyIncome) || 30000
  const existingEMI = Number(data.existingEMI) || 0
  const monthlyExpenses = Number(data.monthlyExpenses) || Math.round(monthlyIncome * 0.3)
  const loanAmount = Number(data.loanAmount) || 500000
  const tenure = Number(data.tenure) || 3
  const creditScore = Number(data.creditScore) || 650
  const hasCreditHistory = data.hasCreditHistory ?? true
  const coborrowerIncome = data.isJointApplication ? Number(data.coborrowerIncome) || 0 : 0
  const employmentType = data.employmentType || "salaried"
  const employmentTenure = data.employmentTenure || "1-2yr"

  const totalIncome = monthlyIncome + coborrowerIncome
  const dti = totalIncome > 0 ? ((existingEMI + monthlyExpenses) / totalIncome) * 100 : 0

  // Banks typically allow 40-50% of net income for EMI
  const maxEMICapacity = totalIncome * 0.5 - existingEMI
  const availableForEMI = Math.max(0, maxEMICapacity)

  let baseRate = 12.0 // Base rate for average credit
  if (creditScore >= 800) baseRate = 9.5
  else if (creditScore >= 750) baseRate = 10.5
  else if (creditScore >= 700) baseRate = 11.5
  else if (creditScore >= 650) baseRate = 12.5
  else baseRate = 14.0

  // Adjust for employment type
  if (employmentType === "self_employed") baseRate += 0.5
  if (employmentType === "freelancer") baseRate += 1.0

  // Using reverse EMI formula: P = EMI * [(1+r)^n - 1] / [r * (1+r)^n]
  const monthlyRate = baseRate / 12 / 100
  const months = tenure * 12
  const factor = Math.pow(1 + monthlyRate, months)

  let maxEligibleAmount = 0
  if (availableForEMI > 0 && monthlyRate > 0) {
    maxEligibleAmount = availableForEMI * ((factor - 1) / (monthlyRate * factor))
  }

  // Apply credit score multiplier
  let creditMultiplier = 1.0
  if (!hasCreditHistory) creditMultiplier = 0.6
  else if (creditScore >= 750) creditMultiplier = 1.2
  else if (creditScore >= 700) creditMultiplier = 1.0
  else if (creditScore >= 650) creditMultiplier = 0.85
  else creditMultiplier = 0.7

  // Apply employment tenure factor
  let tenureMultiplier = 1.0
  if (employmentTenure === "<6_months") tenureMultiplier = 0.7
  else if (employmentTenure === "6m-1yr") tenureMultiplier = 0.85
  else if (employmentTenure === "1-2yr") tenureMultiplier = 0.95
  else if (employmentTenure === "2-5yr") tenureMultiplier = 1.0
  else tenureMultiplier = 1.1

  maxEligibleAmount = Math.floor(maxEligibleAmount * creditMultiplier * tenureMultiplier)

  // Cap at reasonable limits
  maxEligibleAmount = Math.min(maxEligibleAmount, totalIncome * 60) // Max 60x monthly income
  maxEligibleAmount = Math.max(maxEligibleAmount, 50000) // Minimum 50k

  const estimatedEMI = calculateEMI(maxEligibleAmount, baseRate, months)

  // Calculate eligibility factors
  const factors = [
    {
      name: "Income Level",
      score: Math.min(100, Math.round((monthlyIncome / 100000) * 100)),
      status: monthlyIncome >= 25000 ? "pass" : monthlyIncome >= 15000 ? "warning" : "fail",
      description:
        monthlyIncome >= 25000
          ? `₹${monthlyIncome.toLocaleString("en-IN")}/month - Meets requirements`
          : `₹${monthlyIncome.toLocaleString("en-IN")}/month - Below ₹25,000 threshold`,
    },
    {
      name: "Debt-to-Income Ratio",
      score: Math.max(0, Math.round(100 - dti * 1.5)),
      status: dti <= 40 ? "pass" : dti <= 50 ? "warning" : "fail",
      description: `${dti.toFixed(1)}% of income goes to obligations. ${dti <= 40 ? "Healthy ratio" : "Consider reducing debt"}`,
    },
    {
      name: "Credit Score",
      score: hasCreditHistory ? Math.round((creditScore - 300) / 6) : 40,
      status: !hasCreditHistory ? "warning" : creditScore >= 750 ? "pass" : creditScore >= 650 ? "warning" : "fail",
      description: hasCreditHistory
        ? `CIBIL Score: ${creditScore} - ${creditScore >= 750 ? "Excellent" : creditScore >= 700 ? "Good" : creditScore >= 650 ? "Fair" : "Needs improvement"}`
        : "No credit history found - Building credit recommended",
    },
    {
      name: "Employment Stability",
      score:
        employmentType === "salaried"
          ? employmentTenure === "5+yr"
            ? 100
            : employmentTenure === "2-5yr"
              ? 90
              : 75
          : 65,
      status: employmentTenure === "<6_months" ? "warning" : "pass",
      description: `${employmentType === "salaried" ? "Salaried" : employmentType === "self_employed" ? "Self-employed" : "Freelancer"} - ${employmentTenure || "1-2yr"} tenure`,
    },
  ]

  // Calculate overall approval odds
  const avgScore = factors.reduce((sum, f) => sum + f.score, 0) / factors.length
  let approvalOdds = Math.round(avgScore * 0.85)

  // Adjust for specific factors
  if (dti > 50) approvalOdds -= 15
  if (!hasCreditHistory) approvalOdds -= 10
  if (creditScore < 650 && hasCreditHistory) approvalOdds -= 10
  if (coborrowerIncome > 0) approvalOdds += 10

  approvalOdds = Math.min(95, Math.max(15, approvalOdds))

  // Determine overall status
  let overallStatus = "approved"
  if (dti > 60 || monthlyIncome < 15000) overallStatus = "rejected"
  else if (dti > 50 || !hasCreditHistory || creditScore < 650) overallStatus = "review"

  // Generate recommendations
  const recommendations = []

  if (dti > 40) {
    recommendations.push({
      title: "Reduce Existing Debt",
      description: `Your DTI is ${dti.toFixed(1)}%. Paying off ₹${Math.round(existingEMI * 0.3).toLocaleString("en-IN")} in existing loans could increase eligibility by 20%.`,
      impact: "high",
    })
  }

  if (!hasCreditHistory || creditScore < 750) {
    recommendations.push({
      title: "Improve Credit Score",
      description:
        creditScore < 700
          ? "A score above 750 can reduce your interest rate by 2-3% and increase loan amount."
          : "Your score is good. Maintaining it above 750 ensures best rates.",
      impact: "high",
    })
  }

  if (!data.isJointApplication && totalIncome < 50000) {
    recommendations.push({
      title: "Consider Joint Application",
      description: "Adding a co-applicant can increase your eligible amount by 40-60% and improve approval chances.",
      impact: "high",
    })
  }

  if (tenure < 5) {
    recommendations.push({
      title: "Extend Loan Tenure",
      description: `Increasing tenure from ${tenure} to ${Math.min(tenure + 2, 7)} years reduces EMI by ~${Math.round(((tenure + 2) / tenure - 1) * 30)}% making larger loans affordable.`,
      impact: "medium",
    })
  }

  recommendations.push({
    title: "Maintain Stable Employment",
    description: "2+ years in current job and consistent income deposits strengthen your application significantly.",
    impact: "medium",
  })

  return {
    overallStatus,
    statusMessage:
      overallStatus === "approved"
        ? "You meet all eligibility criteria for the requested loan"
        : overallStatus === "review"
          ? "Your application needs additional review. Consider the recommendations below."
          : "Current profile doesn't meet minimum requirements. Follow recommendations to improve.",
    maxAmount: maxEligibleAmount,
    requestedAmount: loanAmount,
    approvalOdds,
    factors,
    financials: {
      monthlyIncome,
      existingEMI,
      monthlyExpenses,
      availableForEMI: Math.round(availableForEMI),
      dti,
      estimatedEMI: Math.round(estimatedEMI),
      interestRate: baseRate,
      tenure,
    },
    recommendations,
  }
}

function calculateEMI(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0
  const monthlyRate = annualRate / 12 / 100
  if (monthlyRate === 0) return principal / months
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(emi)
}
