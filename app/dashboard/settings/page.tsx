import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SettingsPage from "@/components/dashboard/settings"

export const metadata = {
  title: "Settings - LoanSaathi",
  description: "Manage your account settings",
}

export default function Settings() {
  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  )
}
