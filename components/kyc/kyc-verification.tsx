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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  Clock,
  Upload,
  AlertCircle,
  FileText,
  Camera,
  X,
} from "lucide-react";

type VerificationStatus =
  | "not_started"
  | "in_progress"
  | "pending_review"
  | "verified"
  | "rejected";

interface Document {
  id: string;
  name: string;
  status: VerificationStatus;
  uploadedAt?: Date;
  rejectionReason?: string;
}

export function KYCVerification() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "id_front",
      name: "ID (Front)",
      status: "verified",
      uploadedAt: new Date("2024-12-15"),
    },
    {
      id: "id_back",
      name: "ID (Back)",
      status: "verified",
      uploadedAt: new Date("2024-12-15"),
    },
    {
      id: "selfie",
      name: "Selfie",
      status: "in_progress",
      uploadedAt: new Date("2024-12-18"),
    },
    {
      id: "address",
      name: "Address Proof",
      status: "not_started",
    },
  ]);

  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const verifiedCount = documents.filter(
    (d) => d.status === "verified"
  ).length;
  const progress = (verifiedCount / documents.length) * 100;

  const overallStatus: VerificationStatus =
    verifiedCount === documents.length
      ? "verified"
      : verifiedCount === documents.length - 1
      ? "pending_review"
      : "in_progress";

  const handleUpload = (docId: string) => {
    setUploadingDoc(docId);
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                status: "in_progress",
                uploadedAt: new Date(),
              }
            : doc
        )
      );
      setUploadingDoc(null);
    }, 1500);
  };

  const handleResubmit = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: "not_started",
              rejectionReason: undefined,
            }
          : doc
      )
    );
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "pending_review":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Upload className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Identity Verification
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete your KYC verification to unlock all features
        </p>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                {verifiedCount} of {documents.length} documents verified
              </CardDescription>
            </div>
            <div>
              {overallStatus === "verified" && (
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              )}
              {overallStatus === "pending_review" && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  Pending Review
                </Badge>
              )}
              {overallStatus === "in_progress" && (
                <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            {overallStatus === "verified"
              ? "Your account is fully verified!"
              : overallStatus === "pending_review"
              ? "Your documents are under review. We'll notify you within 24 hours."
              : "Please complete the remaining documents to verify your account."}
          </p>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Why we need this</AlertTitle>
        <AlertDescription>
          We're committed to preventing fraud and complying with regulations. Your
          information is encrypted and secure.
        </AlertDescription>
      </Alert>

      {/* Documents List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Required Documents</h2>
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-muted">
                    {doc.id === "selfie" ? (
                      <Camera className="h-5 w-5 text-foreground" />
                    ) : (
                      <FileText className="h-5 w-5 text-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {doc.status === "verified"
                        ? `Verified on ${doc.uploadedAt?.toLocaleDateString()}`
                        : doc.status === "in_progress"
                        ? "Under review..."
                        : doc.status === "pending_review"
                        ? "Pending review"
                        : doc.status === "rejected"
                        ? `Rejected: ${doc.rejectionReason}`
                        : "Not uploaded"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusIcon(doc.status)}
                  <Badge className={getStatusColor(doc.status)}>
                    {doc.status === "not_started"
                      ? "Not Started"
                      : doc.status === "in_progress"
                      ? "In Progress"
                      : doc.status === "pending_review"
                      ? "Pending"
                      : doc.status === "verified"
                      ? "Verified"
                      : "Rejected"}
                  </Badge>

                  {doc.status === "not_started" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpload(doc.id)}
                      disabled={uploadingDoc === doc.id}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}

                  {doc.status === "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResubmit(doc.id)}
                    >
                      Resubmit
                    </Button>
                  )}

                  {doc.status === "verified" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      View
                    </Button>
                  )}
                </div>
              </div>

              {doc.status === "rejected" && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Document Rejected</AlertTitle>
                  <AlertDescription>
                    {doc.rejectionReason || "Please check the requirements and try again."}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">Tips for successful verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Ensure documents are clearly visible with all corners visible</span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Good lighting to avoid shadows or glare</span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>For selfies, face should be clearly visible against plain background</span>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Supported formats: JPG, PNG (max 5MB each)</span>
          </div>
        </CardContent>
      </Card>

      {/* Document Viewer */}
      {selectedDocument && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedDocument.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDocument(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Document preview</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Status: {selectedDocument.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
