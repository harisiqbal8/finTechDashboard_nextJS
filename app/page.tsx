import { MainLayout } from "@/components/layout/main-layout";
import { AccountDashboard } from "@/components/dashboard/account-dashboard";

export default function Home() {
  return (
    <MainLayout>
      <AccountDashboard />
    </MainLayout>
  );
}
