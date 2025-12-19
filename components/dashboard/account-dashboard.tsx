"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, SendIcon, Download, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, generateAccounts, generateTransactions, getCategoryColor } from "@/lib/data";
import { cn } from "@/lib/utils";

export function AccountDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState("acc_1");
  const [accounts, setAccounts] = useState<ReturnType<typeof generateAccounts>>([]);
  const [transactions, setTransactions] = useState<ReturnType<typeof generateTransactions>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAccounts(generateAccounts());
    setTransactions(generateTransactions(50));
    setIsLoaded(true);
  }, []);

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);
  const recentTransactions = transactions.slice(0, 7);

  if (!isLoaded || !selectedAccount) {
    return <div className="animate-pulse">Loading...</div>;
  }

  // Calculate stats
  const monthlyIncome = transactions
    .filter((t) => t.type === "credit" && t.category === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1);

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Welcome back!
        </h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))]">
          Here's your complete financial overview
        </p>
      </div>

      {/* Balance Card - Hero */}
      <Card className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 border-0 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" style={{marginRight: '-200px', marginTop: '-200px'}}></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-white/80 text-base">Total Balance</CardDescription>
              <div className="flex items-center gap-2 mt-4">
                <p className="text-5xl font-bold text-white">
                  {showBalance ? formatCurrency(selectedAccount.balance) : "••••••"}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:bg-white/20"
                >
                  {showBalance ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-white/70 mt-3">
                Account: {selectedAccount.accountNumber}
              </p>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 text-base px-4 py-2">
              {selectedAccount.type}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Account Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Your Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccountId(account.id)}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all duration-300 text-left",
                  selectedAccountId === account.id
                    ? "border-blue-500 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-lg"
                    : "border-[hsl(var(--border))] hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
                )}
              >
                <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                  {account.name}
                </span>
                <span className="text-2xl font-bold mt-3 block text-[hsl(var(--foreground))]">
                  {formatCurrency(account.balance)}
                </span>
                <span className="text-xs text-[hsl(var(--muted-foreground))] mt-3 block">
                  {account.accountNumber}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              +{formatCurrency(monthlyIncome)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              -{formatCurrency(monthlyExpenses)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Savings Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{savingsRate}%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{transactions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-auto py-5 flex flex-col gap-3 bg-gradient-to-br from-blue-500 to-indigo-600 hover:shadow-lg hover:scale-105 transition-all duration-300 text-white">
              <SendIcon className="h-6 w-6" />
              <span className="text-base font-semibold">Send Money</span>
            </Button>
            <Button variant="outline" className="h-auto py-5 flex flex-col gap-3 hover:bg-[hsl(var(--muted))] transition-all duration-300 hover:scale-105">
              <Download className="h-6 w-6" />
              <span className="text-base font-semibold">Request Money</span>
            </Button>
            <Button variant="outline" className="h-auto py-5 flex flex-col gap-3 hover:bg-[hsl(var(--muted))] transition-all duration-300 hover:scale-105">
              <Plus className="h-6 w-6" />
              <span className="text-base font-semibold">Add Funds</span>
            </Button>
            <Button variant="outline" className="h-auto py-5 flex flex-col gap-3 hover:bg-[hsl(var(--muted))] transition-all duration-300 hover:scale-105">
              <FileText className="h-6 w-6" />
              <span className="text-base font-semibold">Pay Bills</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest 7 transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={cn(
                  "flex items-center justify-between py-4 px-4 rounded-lg transition-colors",
                  index !== recentTransactions.length - 1 ? "border-b border-[hsl(var(--border))]" : "",
                  "hover:bg-[hsl(var(--muted))]"
                )}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${getCategoryColor(transaction.category)}`}>
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[hsl(var(--foreground))]">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === "credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-[hsl(var(--foreground))]"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge
                    variant={
                      transaction.status === "completed"
                        ? "default"
                        : transaction.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs mt-1"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Icon component
function FileText(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="12" y1="11" x2="12" y2="17"></line>
      <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
  );
}
