"use client";

import React, { useState, useMemo } from "react";
import { Search, Download, Filter, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency, formatDate, formatTime, generateTransactions, getCategoryColor, Transaction } from "@/lib/data";

const ITEMS_PER_PAGE = 10;
const categories = ["Food", "Transport", "Shopping", "Bills", "Income", "Entertainment", "Health", "Other"];
const statuses = ["completed", "pending", "failed"];

export function TransactionsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const allTransactions = generateTransactions(80);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || tx.category === selectedCategory;
      const matchesStatus = !selectedStatus || tx.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Transactions</h1>
        <p className="text-lg text-muted-foreground">View and manage all your transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/20 shadow-md hover:shadow-lg transition-all duration-300">
          <p className="text-sm font-medium text-muted-foreground uppercase mb-2">Total Transactions</p>
          <p className="text-3xl font-bold text-foreground">{filteredTransactions.length}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-900/20 shadow-md hover:shadow-lg transition-all duration-300">
          <p className="text-sm font-medium text-muted-foreground uppercase mb-2">Total Income</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">+{formatCurrency(totalIncome)}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border border-red-100 dark:border-red-900/20 shadow-md hover:shadow-lg transition-all duration-300">
          <p className="text-sm font-medium text-muted-foreground uppercase mb-2">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">-{formatCurrency(totalExpenses)}</p>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by merchant, description, or reference..."
              className="pl-10 rounded-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Category</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                className="rounded-lg"
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage(1);
                }}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat ? null : cat);
                    setCurrentPage(1);
                  }}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Status</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedStatus ? "default" : "outline"}
                size="sm"
                className="rounded-lg"
                onClick={() => {
                  setSelectedStatus(null);
                  setCurrentPage(1);
                }}
              >
                All
              </Button>
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    setSelectedStatus(selectedStatus === status ? null : status);
                    setCurrentPage(1);
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end pt-2">
            <Button variant="outline" className="gap-2 rounded-lg">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of{" "}
            {filteredTransactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="py-4 px-4 text-sm">
                      <div>
                        <p className="font-medium">{formatDate(transaction.date)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(transaction.date)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {transaction.type === "credit" ? (
                          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950/30">
                            <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/30">
                            <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.reference}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">
                        {transaction.category}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p
                        className={`font-semibold ${
                          transaction.type === "credit"
                            ? "text-green-600 dark:text-green-400"
                            : "text-foreground"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 pb-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Description
                  </p>
                  <p className="text-sm font-medium mt-2 text-foreground">
                    {selectedTransaction.description}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Category
                  </p>
                  <p className="text-sm font-medium mt-2 text-foreground">
                    {selectedTransaction.category}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Amount
                  </p>
                  <p className={`text-lg font-bold mt-2 ${
                    selectedTransaction.type === "credit"
                      ? "text-green-600 dark:text-green-400"
                      : "text-foreground"
                  }`}>
                    {selectedTransaction.type === "credit" ? "+" : "-"}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Date & Time
                  </p>
                  <p className="text-sm font-medium mt-2 text-foreground">
                    {formatDate(selectedTransaction.date)} {formatTime(selectedTransaction.date)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Reference
                  </p>
                  <p className="text-sm font-medium mt-2 text-foreground">
                    {selectedTransaction.reference}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
