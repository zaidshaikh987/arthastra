"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  Volume2,
} from "lucide-react"
import Link from "next/link"
import { useVoiceAssistant } from "@/lib/voice-assistant-context"

export default function DashboardOverview() {
  const [userData, setUserData] = useState<any>(null)
  const { guideDashboard, setIsOpen } = useVoiceAssistant()

  useEffect(() => {
    // Load onboarding data
    const data = localStorage.getItem("onboardingData")
    if (data) {
      const parsedData = JSON.parse(data)

      // Calculate eligibility and scores
      const calculations = calculateEligibility(parsedData)
      setUserData({ ...parsedData, ...calculations })
    }
  }, [])

  const handleVoiceGuide = () => {
    setIsOpen(true)
    guideDashboard()
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userData.name?.split(" ")[0]}! 👋</h1>
          <p className="text-gray-600">Here's your loan readiness overview</p>
        </div>
        <Button
          onClick={handleVoiceGuide}
          className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
        >
          <Volume2 className="w-4 h-4 mr-2" />
          Voice Guide
        </Button>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Credit Readiness Score */}
        <Card className="p-6 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-emerald-600" />
            <span className="text-sm font-medium text-gray-600">Credit Readiness</span>
          </div>
          <div className="mb-3">
            <div className="text-4xl font-bold text-emerald-600 mb-1">{userData.creditReadinessScore}/100</div>
            <Progress value={userData.creditReadinessScore} className="h-2" />
          </div>
          <p className="text-sm text-gray-600">{getScoreLabel(userData.creditReadinessScore)}</p>
        </Card>

        {/* Eligibility Status */}
        <Card className="p-6 border-2 border-teal-100">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-8 h-8 text-teal-600" />
            <span className="text-sm font-medium text-gray-600">Eligibility</span>
          </div>
          <div className="mb-3">
            <div className={`text-lg font-bold mb-1 ${userData.isEligible ? "text-green-600" : "text-orange-600"}`}>
              {userData.isEligible ? "Eligible" : "Partially Eligible"}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{(userData.maxEligibleAmount || 0).toLocaleString("en-IN")}
            </div>
          </div>
          <p className="text-sm text-gray-600">Max eligible amount</p>
        </Card>

        {/* Recommended Action */}
        <Card className="p-6 border-2 border-cyan-100">
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="w-8 h-8 text-cyan-600" />
            <span className="text-sm font-medium text-gray-600">Next Step</span>
          </div>
          <div className="mb-3">
            <div className="text-lg font-bold text-cyan-700 mb-2">{userData.nextAction}</div>
          </div>
          <Link href={userData.actionLink}>
            <Button size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700">
              Take Action
            </Button>
          </Link>
        </Card>

        {/* Document Readiness */}
        <Card className="p-6 border-2 border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <FileCheck className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Documents</span>
          </div>
          <div className="mb-3">
            <div className="text-4xl font-bold text-blue-600 mb-1">{userData.documentReadiness}%</div>
            <Progress value={userData.documentReadiness} className="h-2" />
          </div>
          <p className="text-sm text-gray-600">{5 - Math.floor(userData.documentReadiness / 20)} documents missing</p>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/optimizer">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-2 hover:border-emerald-500 bg-transparent"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold">Optimize Path</span>
                </div>
                <p className="text-xs text-gray-600">Simulate scenarios</p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/timeline">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-2 hover:border-teal-500 bg-transparent"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold">Best Timing</span>
                </div>
                <p className="text-xs text-gray-600">When to apply</p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/loans">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-2 hover:border-cyan-500 bg-transparent"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                  <span className="font-semibold">Compare Loans</span>
                </div>
                <p className="text-xs text-gray-600">Find best options</p>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/chat">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-2 hover:border-blue-500 bg-transparent"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">AI Assistant</span>
                </div>
                <p className="text-xs text-gray-600">Get guidance</p>
              </div>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Loan Recommendations */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recommended Loans</h2>
              <Link href="/dashboard/loans">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {userData.recommendations?.slice(0, 3).map((loan: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border-2 border-gray-100 rounded-lg hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{loan.bankName}</h3>
                      <p className="text-sm text-gray-600">{loan.productName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">{loan.rate}%</div>
                      <div className="text-xs text-gray-600">Interest Rate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>EMI: ₹{loan.emi.toLocaleString("en-IN")}</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{loan.approvalOdds}% approval odds</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: "Eligibility Checked", time: "Just now", icon: CheckCircle2, color: "text-green-600" },
                { action: "Profile Updated", time: "2 mins ago", icon: Users, color: "text-blue-600" },
                { action: "Document Uploaded", time: "1 hour ago", icon: FileCheck, color: "text-purple-600" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <activity.icon className={`w-5 h-5 ${activity.color} mt-0.5`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper Functions
function calculateEligibility(data: any) {
  const monthlyIncome = data.monthlyIncome || 30000
  const existingEMI = data.existingEMI || 0
  const loanAmount = data.loanAmount || 100000
  const tenure = data.tenure || 3

  // DTI Calculation
  const dti = (existingEMI / monthlyIncome) * 100
  const dtiThreshold = data.isJointApplication ? 55 : data.hasCreditHistory ? 50 : 40

  // Eligibility
  const availableIncome = monthlyIncome - existingEMI
  let maxEligible = availableIncome * 60 * tenure

  if (!data.hasCreditHistory) maxEligible *= 0.7
  if (data.creditScore && data.creditScore >= 750) maxEligible *= 1.15
  if (data.isJointApplication && data.coborrowerIncome) {
    maxEligible += data.coborrowerIncome * 40 * tenure
  }

  const isEligible = dti <= dtiThreshold && monthlyIncome >= 25000

  // Credit Readiness Score
  const financialLoad = Math.max(0, 30 - dti * 0.6)
  const incomeStability = getIncomeStabilityScore(data.employmentType, data.employmentTenure)
  const creditBehavior = data.hasCreditHistory ? (data.creditScore >= 750 ? 20 : 15) : 5
  const documentReadiness = 12 // Base score
  const timingScore = 5

  const creditReadinessScore = Math.round(
    financialLoad + incomeStability + creditBehavior + documentReadiness + timingScore,
  )

  // Recommendations
  const recommendations = [
    { bankName: "HDFC Bank", productName: "Personal Loan", rate: 10.5, emi: 8200, approvalOdds: 85 },
    { bankName: "ICICI Bank", productName: "Express Loan", rate: 11.0, emi: 8350, approvalOdds: 80 },
    { bankName: "Axis Bank", productName: "Quick Loan", rate: 10.8, emi: 8290, approvalOdds: 82 },
  ]

  return {
    isEligible,
    maxEligibleAmount: Math.floor(maxEligible),
    creditReadinessScore,
    nextAction: isEligible ? "Compare Loans" : "Improve Profile",
    actionLink: isEligible ? "/dashboard/loans" : "/dashboard/optimizer",
    documentReadiness: 60,
    recommendations,
  }
}

function getIncomeStabilityScore(employmentType: string, tenure: string) {
  if (employmentType === "salaried") {
    if (tenure === "5+yr") return 25
    if (tenure === "2-5yr") return 23
    if (tenure === "1-2yr") return 20
    return 18
  }
  if (employmentType === "self_employed") {
    if (tenure === "5+yr") return 22
    if (tenure === "2-5yr") return 18
    return 15
  }
  return 10
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent - Ready to apply!"
  if (score >= 60) return "Good - Few improvements needed"
  if (score >= 40) return "Fair - Work on key areas"
  return "Needs improvement"
}
