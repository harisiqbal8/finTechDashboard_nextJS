"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  formatCurrency,
  generateAccounts,
  generateRecipients,
  generateTransactions,
} from "@/lib/data";

type Step = "recipient" | "amount" | "review" | "auth" | "success" | "error";

export function TransferFlow() {
  const [currentStep, setCurrentStep] = useState<Step>("recipient");
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [showNewRecipient, setShowNewRecipient] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState("");

  const accounts = generateAccounts();
  const recipients = generateRecipients();
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  const filteredRecipients = recipients.filter((r) =>
    r.name.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  const stepNumber = {
    recipient: 1,
    amount: 2,
    review: 3,
    auth: 4,
    success: 5,
    error: 5,
  }[currentStep];

  const progress = (stepNumber / 5) * 100;

  const handleRecipientSelect = (recipient: any) => {
    setSelectedRecipient(recipient);
    setShowNewRecipient(false);
    setCurrentStep("amount");
  };

  const handleAmountSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setCurrentStep("review");
  };

  const handleReview = () => {
    setCurrentStep("auth");
  };

  const handleAuth = async () => {
    if (pin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      if (Math.random() > 0.1) {
        setCurrentStep("success");
      } else {
        setCurrentStep("error");
      }
    }, 2000);
  };

  const handleNewTransfer = () => {
    setCurrentStep("recipient");
    setSelectedRecipient(null);
    setAmount("");
    setNote("");
    setPin("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Transfer Money
        </h1>
        <p className="text-lg text-muted-foreground">
          Send money securely to your contacts
        </p>
      </div>

      {/* Progress Indicator */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-sm">Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} />
          <div className="flex justify-between text-xs font-medium">
            <span className={currentStep === "recipient" ? "text-primary" : "text-muted-foreground"}>
              1. Recipient
            </span>
            <span className={["amount", "review", "auth", "success", "error"].includes(currentStep) ? "text-primary" : "text-muted-foreground"}>
              2. Amount
            </span>
            <span className={["review", "auth", "success", "error"].includes(currentStep) ? "text-primary" : "text-muted-foreground"}>
              3. Review
            </span>
            <span className={["auth", "success", "error"].includes(currentStep) ? "text-primary" : "text-muted-foreground"}>
              4. Authenticate
            </span>
            <span className={["success", "error"].includes(currentStep) ? "text-primary" : "text-muted-foreground"}>
              5. Confirm
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Select Recipient */}
      {currentStep === "recipient" && (
        <Card>
          <CardHeader>
            <CardTitle>Select Recipient</CardTitle>
            <CardDescription>
              Choose who you want to send money to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-10"
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
              />
            </div>

            {/* Saved Recipients */}
            <div>
              <Label className="text-base font-semibold mb-4 block">
                Saved Contacts
              </Label>
              <div className="grid gap-3">
                {filteredRecipients.map((recipient) => (
                  <Button
                    key={recipient.id}
                    variant="outline"
                    className="h-auto py-3 px-4 justify-start"
                    onClick={() => handleRecipientSelect(recipient)}
                  >
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{recipient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {recipient.bankName} • {recipient.accountNumber}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>

            {/* New Recipient */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowNewRecipient(true)}
            >
              <Plus className="h-4 w-4" />
              Add New Recipient
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Enter Amount */}
      {currentStep === "amount" && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Amount</CardTitle>
            <CardDescription>
              Transfer to {selectedRecipient?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Account */}
            <div className="space-y-2">
              <Label>From Account</Label>
              <div className="p-4 border rounded-lg bg-muted">
                <p className="font-semibold">{selectedAccount.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(selectedAccount.balance)} available
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-muted-foreground font-semibold">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {amount && (
                <p className="text-xs text-muted-foreground">
                  Will arrive in 1-3 business days
                </p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                placeholder="Payment for..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep("recipient");
                  setSelectedRecipient(null);
                }}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleAmountSubmit}
                disabled={!amount}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {currentStep === "review" && (
        <Card>
          <CardHeader>
            <CardTitle>Review Transfer</CardTitle>
            <CardDescription>Confirm the details before proceeding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  From
                </p>
                <p className="text-base font-semibold mt-1">
                  {selectedAccount.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedAccount.accountNumber}
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  To
                </p>
                <p className="text-base font-semibold mt-1">
                  {selectedRecipient.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedRecipient.bankName} • {selectedRecipient.accountNumber}
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                {note && (
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Note</span>
                    <span className="font-semibold text-sm">{note}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total</span>
                  <span className="text-lg">
                    {formatCurrency(parseFloat(amount))}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("amount")}
              >
                Back
              </Button>
              <Button className="flex-1" onClick={handleReview}>
                Confirm & Authenticate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Authentication */}
      {currentStep === "auth" && (
        <Card>
          <CardHeader>
            <CardTitle>Security Verification</CardTitle>
            <CardDescription>Enter your 4-digit PIN to confirm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Security Check</AlertTitle>
              <AlertDescription>
                For your security, we need to verify your identity
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="pin">Enter 4-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                placeholder="••••"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                className="text-center text-2xl tracking-widest font-bold"
              />
              <p className="text-xs text-muted-foreground">
                We'll never ask for your password
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("review")}
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleAuth}
                disabled={isProcessing || pin.length !== 4}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Verify & Transfer"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Success */}
      {currentStep === "success" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Transfer Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Your transfer has been completed successfully
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-semibold">{selectedRecipient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-semibold text-sm">TXN-2024-001234</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Status</span>
                  <Badge>Completed</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => (window.location.href = "/")}
              >
                Go to Dashboard
              </Button>
              <Button className="flex-1" onClick={handleNewTransfer}>
                New Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Error */}
      {currentStep === "error" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Transfer Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Transaction Error</AlertTitle>
              <AlertDescription>
                Unfortunately, the transfer could not be processed. Please try again or contact support.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => (window.location.href = "/")}
              >
                Go to Dashboard
              </Button>
              <Button className="flex-1" onClick={handleNewTransfer}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Recipient Dialog */}
      <Dialog open={showNewRecipient} onOpenChange={setShowNewRecipient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Recipient</DialogTitle>
            <DialogDescription>
              Enter the details of the person you want to send money to
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Handle new recipient creation
              alert("New recipient added!");
              setShowNewRecipient(false);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank">Bank Name</Label>
              <Input id="bank" placeholder="Chase Bank" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Account Number</Label>
              <Input id="account" placeholder="••••••••" />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowNewRecipient(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Recipient
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
