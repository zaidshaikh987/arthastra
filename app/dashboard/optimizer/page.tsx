import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CreditPathOptimizer from "@/components/dashboard/credit-path-optimizer"

export const metadata = {
  title: "Credit Path Optimizer - LoanSaathi",
  description: "Optimize your credit path with AI-powered simulations",
}

export default function OptimizerPage() {
  return (
    <DashboardLayout>
      <CreditPathOptimizer />
    </DashboardLayout>
  )
}
