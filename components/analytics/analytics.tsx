"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generateTransactions, formatCurrency } from "@/lib/data";

export function Analytics() {
  const [timeRange, setTimeRange] = useState("30");
  const transactions = generateTransactions(100);

  // Calculate spending by category
  const spendingByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions.forEach((tx) => {
      if (tx.type === "debit") {
        categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
      }
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }));
  }, []);

  // Calculate income vs expenses by day
  const incomeVsExpensesByDay = useMemo(() => {
    const days: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach((tx) => {
      const day = tx.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!days[day]) {
        days[day] = { income: 0, expenses: 0 };
      }

      if (tx.type === "credit") {
        days[day].income += tx.amount;
      } else {
        days[day].expenses += tx.amount;
      }
    });

    return Object.entries(days)
      .slice(-30)
      .map(([date, { income, expenses }]) => ({
        date,
        income: Number(income.toFixed(2)),
        expenses: Number(expenses.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  // Top merchants
  const topMerchants = useMemo(() => {
    const merchants: Record<string, number> = {};
    transactions.forEach((tx) => {
      if (tx.merchant) {
        merchants[tx.merchant] = (merchants[tx.merchant] || 0) + tx.amount;
      }
    });

    return Object.entries(merchants)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }));
  }, []);

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#6366f1",
  ];

  const totalIncome = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
        <p className="text-lg text-muted-foreground">Visualize your spending patterns and financial trends</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-900/20 shadow-md hover:shadow-lg transition-all duration-300">
          <p className="text-sm font-medium text-muted-foreground uppercase mb-2">Total Income</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">+{formatCurrency(totalIncome)}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border border-red-100 dark:border-red-900/20 shadow-md hover:shadow-lg transition-all duration-300">
          <p className="text-sm font-medium text-muted-foreground uppercase mb-2">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">-{formatCurrency(totalExpenses)}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/20 shadow-md hover:shadow-lg transition-all duration-300">
          <p className="text-sm font-medium text-muted-foreground uppercase mb-2">Net Savings</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">+{formatCurrency(totalIncome - totalExpenses)}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-100 dark:border-purple-900/20 shadow-md hover:shadow-lg transition-all duration-300">
          <p className="text-sm font-medium text-muted-foreground uppercase mb-2">Savings Rate</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{((((totalIncome - totalExpenses) / totalIncome) * 100) || 0).toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Distribution of your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {spendingByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Merchants */}
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardTitle>Top Merchants</CardTitle>
            <CardDescription>Your most frequent spending destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topMerchants}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income vs Expenses Trend */}
        <Card className="lg:col-span-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardTitle>Income vs Expenses Trend</CardTitle>
            <CardDescription>Daily comparison of your income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={incomeVsExpensesByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  name="Income"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  name="Expenses"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Detailed spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {spendingByCategory
              .sort((a, b) => b.value - a.value)
              .map((category) => {
                const percentage = (
                  (category.value / totalExpenses) *
                  100
                ).toFixed(1);
                return (
                  <div key={category.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-sm font-bold">
                        {formatCurrency(category.value)} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
