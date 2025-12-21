"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, TrendingDown, Target, Award, Percent } from "lucide-react"

export default function PeerInsights() {
  const [userData, setUserData] = useState<any>(null)
  const [peerData, setPeerData] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("onboardingData")
    if (data) {
      const parsed = JSON.parse(data)
      setUserData(parsed)
      setPeerData(generatePeerComparison(parsed))
    }
  }, [])

  if (!userData || !peerData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Peer Insights</h1>
        <p className="text-gray-600">See how your profile compares with similar applicants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Your Percentile</span>
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-4xl font-bold text-emerald-600 mb-2">{peerData.percentile}th</div>
          <p className="text-sm text-gray-600">Better than {peerData.percentile}% of applicants</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Avg Approval Rate</span>
            <Percent className="w-6 h-6 text-teal-600" />
          </div>
          <div className="text-4xl font-bold text-teal-600 mb-2">{peerData.avgApprovalRate}%</div>
          <p className="text-sm text-gray-600">For your income bracket</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Similar Profiles</span>
            <Users className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="text-4xl font-bold text-cyan-600 mb-2">{peerData.similarProfiles}</div>
          <p className="text-sm text-gray-600">Applicants analyzed</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Comparison</h3>
          <div className="space-y-6">
            {peerData.comparisons.map((comp: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{comp.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{comp.yourValue}</span>
                    <span className="text-xs text-gray-500">vs</span>
                    <span className="text-sm text-gray-600">{comp.peerAvg}</span>
                    {comp.better ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Progress value={comp.yourPercentage} className="h-2 mb-1" />
                    <p className="text-xs text-gray-600">You</p>
                  </div>
                  <div>
                    <Progress value={comp.peerPercentage} className="h-2 mb-1 opacity-50" />
                    <p className="text-xs text-gray-600">Peers</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Success Stories</h3>
          <div className="space-y-4">
            {peerData.successStories.map((story: any, index: number) => (
              <div key={index} className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {story.initial}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{story.profile}</span>
                      <span className="text-xs text-gray-600">• {story.timeAgo}</span>
                    </div>
                    <p className="text-sm text-gray-700">{story.story}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-emerald-700 font-medium">Loan: ₹{story.amount.toLocaleString("en-IN")}</span>
                  <span className="text-gray-600">Rate: {story.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Actions by Similar Applicants</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {peerData.popularActions.map((action: any, index: number) => (
            <div
              key={index}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <Target className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600">{action.percentage}%</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{action.action}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function generatePeerComparison(userData: any) {
  const income = userData.monthlyIncome || 30000
  const creditScore = userData.creditScore || 650
  const dti = ((userData.existingEMI || 0) / income) * 100

  const percentile = Math.min(95, Math.max(50, 50 + income / 1000 + (creditScore - 650) / 10 - dti))

  return {
    percentile: Math.round(percentile),
    avgApprovalRate: 78,
    similarProfiles: 1247,
    comparisons: [
      {
        metric: "Monthly Income",
        yourValue: `₹${income.toLocaleString("en-IN")}`,
        peerAvg: "₹45,000",
        yourPercentage: Math.min(100, (income / 50000) * 100),
        peerPercentage: 90,
        better: income >= 45000,
      },
      {
        metric: "Credit Score",
        yourValue: creditScore,
        peerAvg: "720",
        yourPercentage: (creditScore / 850) * 100,
        peerPercentage: 85,
        better: creditScore >= 720,
      },
      {
        metric: "DTI Ratio",
        yourValue: `${dti.toFixed(0)}%`,
        peerAvg: "35%",
        yourPercentage: 100 - dti,
        peerPercentage: 65,
        better: dti <= 35,
      },
      {
        metric: "Employment Stability",
        yourValue: userData.employmentTenure || "2-5yr",
        peerAvg: "2-5yr",
        yourPercentage: 80,
        peerPercentage: 75,
        better: true,
      },
    ],
    successStories: [
      {
        initial: "R",
        profile: "Similar to you",
        timeAgo: "2 weeks ago",
        story: "Got approved by reducing DTI from 45% to 35% over 3 months",
        amount: 800000,
        rate: 10.5,
      },
      {
        initial: "A",
        profile: "Same income bracket",
        timeAgo: "1 month ago",
        story: "Improved credit score from 650 to 720 and got better rates",
        amount: 600000,
        rate: 10.25,
      },
      {
        initial: "M",
        profile: "First-time borrower",
        timeAgo: "3 weeks ago",
        story: "Applied with joint application and increased eligibility by 40%",
        amount: 1200000,
        rate: 10.75,
      },
    ],
    popularActions: [
      {
        action: "Pay off credit card debt",
        percentage: 68,
        description: "Most successful applicants cleared high-interest debt first",
      },
      {
        action: "Wait 3-6 months",
        percentage: 54,
        description: "Built credit history and improved score before applying",
      },
      {
        action: "Add co-borrower",
        percentage: 42,
        description: "Increased household income for better eligibility",
      },
    ],
  }
}
