import { MainLayout } from "@/components/layout/main-layout";
import { TransactionsList } from "@/components/transactions/transactions-list";

export default function TransactionsPage() {
  return (
    <MainLayout>
      <TransactionsList />
    </MainLayout>
  );
}
