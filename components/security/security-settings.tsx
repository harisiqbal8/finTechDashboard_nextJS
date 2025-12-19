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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Lock,
  Smartphone,
  Fingerprint,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  LogOut,
} from "lucide-react";
import { formatDate } from "@/lib/data";

interface Device {
  id: string;
  name: string;
  type: "phone" | "desktop" | "tablet";
  lastActive: Date;
  location: string;
  isCurrent: boolean;
}

interface LoginHistory {
  id: string;
  date: Date;
  location: string;
  device: string;
  status: "success" | "failed";
}

export function SecuritySettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const devices: Device[] = [
    {
      id: "dev_1",
      name: "iPhone 14 Pro",
      type: "phone",
      lastActive: new Date(),
      location: "New York, USA",
      isCurrent: true,
    },
    {
      id: "dev_2",
      name: "MacBook Pro",
      type: "desktop",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: "New York, USA",
      isCurrent: false,
    },
    {
      id: "dev_3",
      name: "iPad Air",
      type: "tablet",
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      location: "New York, USA",
      isCurrent: false,
    },
  ];

  const loginHistory: LoginHistory[] = [
    {
      id: "login_1",
      date: new Date(),
      location: "New York, USA",
      device: "iPhone 14 Pro",
      status: "success",
    },
    {
      id: "login_2",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: "New York, USA",
      device: "MacBook Pro",
      status: "success",
    },
    {
      id: "login_3",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      location: "Unknown",
      device: "Chrome Browser",
      status: "failed",
    },
  ];

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    alert("Password changed successfully!");
    setShowPasswordForm(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Security Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your account security and privacy
        </p>
      </div>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password regularly</CardDescription>
              </div>
            </div>
            <Button onClick={() => setShowPasswordForm(!showPasswordForm)}>
              {showPasswordForm ? "Cancel" : "Change Password"}
            </Button>
          </div>
        </CardHeader>

        {showPasswordForm && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input
                id="current"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <div className="relative">
                <Input
                  id="new"
                  type={showPasswords ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                <li>✓ At least 8 characters</li>
                <li>✓ Mix of uppercase and lowercase letters</li>
                <li>✓ Include numbers and symbols</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type={showPasswords ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordChange}>Update Password</Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security</CardDescription>
              </div>
            </div>
            <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Via SMS</p>
              <p className="text-sm text-muted-foreground">
                Receive codes via text message
              </p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          {twoFactorEnabled && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>2FA Enabled</AlertTitle>
              <AlertDescription>
                You will receive a code via SMS when logging in
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Biometric Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Biometric Authentication</CardTitle>
                <CardDescription>
                  Use fingerprint or face recognition
                </CardDescription>
              </div>
            </div>
            <Badge variant={biometricEnabled ? "default" : "secondary"}>
              {biometricEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Fingerprint</p>
              <p className="text-sm text-muted-foreground">
                Use your fingerprint to unlock
              </p>
            </div>
            <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Face Recognition</p>
              <p className="text-sm text-muted-foreground">
                Use face ID to unlock
              </p>
            </div>
            <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Trusted Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Trusted Devices
          </CardTitle>
          <CardDescription>
            Devices that have access to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{device.name}</p>
                    {device.isCurrent && (
                      <Badge variant="outline">Current Device</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {device.location} • Last active {formatDate(device.lastActive)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDevice(device)}
                  >
                    View
                  </Button>
                  {!device.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout from All Devices
          </Button>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>Recent login activity on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginHistory.map((login) => (
              <div
                key={login.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  {login.status === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">{login.device}</p>
                    <p className="text-sm text-muted-foreground">
                      {login.location} • {formatDate(login.date)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={login.status === "success" ? "default" : "destructive"}
                >
                  {login.status === "success" ? "Success" : "Failed"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Use a unique, strong password that you don't use elsewhere</span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Enable two-factor authentication for added protection</span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Review your login history regularly</span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Remove devices you no longer use</span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Never share your password or recovery codes with anyone</span>
          </div>
        </CardContent>
      </Card>

      {/* Device Details Dialog */}
      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Device</p>
                <p className="text-lg font-bold mt-1">{selectedDevice.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Location
                  </p>
                  <p className="text-sm mt-1">{selectedDevice.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Active
                  </p>
                  <p className="text-sm mt-1">
                    {formatDate(selectedDevice.lastActive)}
                  </p>
                </div>
              </div>
              {selectedDevice.isCurrent && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Current Device</AlertTitle>
                  <AlertDescription>
                    This is the device you are currently using
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout from all devices?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out from all devices except this one. You'll need to log
              in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialog>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => alert("Logged out from all devices")}>
              Logout All
            </AlertDialogAction>
          </AlertDialog>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
