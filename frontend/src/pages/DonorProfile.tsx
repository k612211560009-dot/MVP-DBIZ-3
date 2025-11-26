import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Download, Mail, CheckCircle, XCircle, FileText } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { mockDonors, mockDonations, mockEHRTests } from "../lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

/*
API Endpoints:
GET /api/admin/donors/{id} - Get full donor profile
POST /api/admin/donors/{id}/approve - Approve donor with e-signature
POST /api/admin/donors/{id}/reject - Reject donor

E-signature Approval Flow (VNPT-CA Integration):
1. Click "Duyệt hồ sơ" button
2. Show approval modal
3. Step 1: Preview consent document
4. Step 2: Select CA provider (VNPT-CA / VN PT / Viettel CA)
5. Step 3: Call CA API to initiate signing
6. Step 4: Enter OTP received via SMS
7. Step 5: Submit OTP to verify signature
8. Step 6: Save signed document & update donor status to 'approved'

Request body for approval:
POST /api/admin/donors/{id}/approve
{
  action: 'approve',
  caProvider: 'vnpt-ca' | 'vn-pt' | 'viettel-ca',
  otp: string,
  signatureData: {
    transactionId: string,
    timestamp: string
  }
}
*/

const ESignatureModal = ({ donor, isOpen, onClose }: any) => {
  const [step, setStep] = useState(1);
  const [caProvider, setCAProvider] = useState("vnpt-ca");
  const [otp, setOtp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInitiateSigning = () => {
    setIsProcessing(true);
    // Simulate CA API call
    setTimeout(() => {
      toast.success("OTP has been sent to your phone");
      setIsProcessing(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP code");
      return;
    }

    setIsProcessing(true);
    // Simulate OTP verification
    setTimeout(() => {
      toast.success("Profile approved and digitally signed successfully", {
        description: `Donor ${donor.name} has been approved`,
      });
      setIsProcessing(false);
      onClose(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <Dialog>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Approve Donor Profile - Digital Signature</DialogTitle>
          <DialogDescription>
            Confirm approval for {donor?.name} ({donor?.id})
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3>Donor Information</h3>
              <div className="mt-2 space-y-1">
                <p>Full Name: {donor?.name}</p>
                <p>Date of Birth: {donor?.dob}</p>
                <p>Phone: {donor?.phone}</p>
                <p>EHR ID: {donor?.ehrId}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Digital Signature Provider</Label>
              <div className="grid grid-cols-3 gap-3">
                {["vnpt-ca", "vn-pt", "viettel-ca"].map((provider) => (
                  <button
                    key={provider}
                    className={`p-4 border rounded-lg ${
                      caProvider === provider
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                    onClick={() => setCAProvider(provider)}
                  >
                    <div className="text-center">
                      <div className="h-12 flex items-center justify-center mb-2">
                        <FileText className="h-8 w-8" />
                      </div>
                      <p className="uppercase">{provider}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-blue-900 dark:text-blue-100">
                After clicking "Send OTP", you will receive a verification code
                via SMS. Please have your phone ready to receive the code.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3>Enter OTP Code</h3>
              <p className="text-muted-foreground mt-2">
                OTP code has been sent to your phone
              </p>
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <Label htmlFor="otp">OTP Code (6 digits)</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center tracking-widest"
              />
            </div>

            <div className="text-center">
              <Button variant="ghost" onClick={handleInitiateSigning}>
                Resend OTP
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          {step === 1 && (
            <Button onClick={handleInitiateSigning} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Send OTP"}
            </Button>
          )}
          {step === 2 && (
            <Button
              onClick={handleVerifyOTP}
              disabled={isProcessing || otp.length !== 6}
            >
              {isProcessing ? "Verifying..." : "Confirm Signature"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function DonorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const donor = mockDonors.find((d) => d.id === id) || mockDonors[0];
  const donorDonations = mockDonations.filter((d) => d.donorId === donor.id);
  const donorTests = mockEHRTests.filter((t) => t.donorId === donor.id);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "Pending Screening" },
      interviewed: { variant: "default", label: "Interviewed" },
      needs_tests: { variant: "outline", label: "Needs Tests" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleApprovalComplete = (success: boolean) => {
    setIsApprovalModalOpen(false);
    if (success) {
      // Refresh data or navigate
      navigate("/donors");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>
              <span className="text-xl">
                {donor.name.split(" ").pop()?.charAt(0)}
              </span>
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1>{donor.name}</h1>
              {getStatusBadge(donor.status)}
            </div>
            <p className="text-muted-foreground">
              {donor.id} • EHR: {donor.ehrId}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
          {donor.status !== "approved" && donor.status !== "rejected" && (
            <>
              <Button
                variant="destructive"
                onClick={() => {
                  if (
                    confirm("Are you sure you want to reject this profile?")
                  ) {
                    toast.success("Profile has been rejected");
                  }
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={() => setIsApprovalModalOpen(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Profile
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs {...({ defaultValue: "info", className: "w-full" } as any)}>
        <TabsList>
          <TabsTrigger {...({ value: "info" } as any)}>
            Personal Information
          </TabsTrigger>
          <TabsTrigger {...({ value: "screening" } as any)}>
            Screening Form
          </TabsTrigger>
          <TabsTrigger {...({ value: "tests" } as any)}>
            Test Results
          </TabsTrigger>
          <TabsTrigger {...({ value: "donations" } as any)}>
            Donation Log
          </TabsTrigger>
          <TabsTrigger {...({ value: "payments" } as any)}>
            Payments
          </TabsTrigger>
          <TabsTrigger {...({ value: "activity" } as any)}>
            Activity History
          </TabsTrigger>
        </TabsList>

        <TabsContent {...({ value: "info" } as any)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground">Full Name</label>
                <p>{donor.name}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Date of Birth</label>
                <p>{donor.dob}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Phone</label>
                <p>{donor.phone}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Email</label>
                <p>{donor.email}</p>
              </div>
              <div className="col-span-2">
                <label className="text-muted-foreground">Address</label>
                <p>{donor.address}</p>
              </div>
              <div>
                <label className="text-muted-foreground">
                  Emergency Contact
                </label>
                <p>{donor.emergencyContact}</p>
              </div>
              <div>
                <label className="text-muted-foreground">EHR ID</label>
                <p>{donor.ehrId}</p>
              </div>
              <div>
                <label className="text-muted-foreground">
                  Registration Date
                </label>
                <p>{donor.registeredAt}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent {...({ value: "screening" } as any)}>
          <Card>
            <CardHeader>
              <CardTitle>Screening Form</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No screening forms saved yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent {...({ value: "tests" } as any)}>
          <Card>
            <CardHeader>
              <CardTitle>EHR Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {donorTests.length > 0 ? (
                <div className="space-y-4">
                  {donorTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p>{test.testType}</p>
                        <p className="text-muted-foreground">
                          {test.lab} • {test.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            test.result === "negative"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {test.result === "negative" ? "Negative" : "Positive"}
                        </Badge>
                        <Badge
                          variant={
                            test.validity === "valid"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {test.validity === "valid" ? "Valid" : "Expired"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No test results available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent {...({ value: "donations" } as any)}>
          <Card>
            <CardHeader>
              <CardTitle>Donation Log</CardTitle>
            </CardHeader>
            <CardContent>
              {donorDonations.length > 0 ? (
                <div className="space-y-4">
                  {donorDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p>{donation.date}</p>
                        <p className="text-muted-foreground">
                          {donation.volume}ml • {donation.containers}{" "}
                          container(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p>{donation.points} points</p>
                        <p className="text-muted-foreground">
                          {donation.staff}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No donations recorded yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent {...({ value: "payments" } as any)}>
          <Card>
            <CardHeader>
              <CardTitle>Payments & Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No payment transactions</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent {...({ value: "activity" } as any)}>
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p>Registered to program</p>
                    <p className="text-muted-foreground">
                      {donor.registeredAt}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* E-Signature Modal */}
      <ESignatureModal
        donor={donor}
        isOpen={isApprovalModalOpen}
        onClose={handleApprovalComplete}
      />

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>
            GET /api/admin/donors/{"{id}"} - Fetch full donor profile with all
            related data
          </li>
          <li>
            POST /api/admin/donors/{"{id}"}/approve - E-signature flow with CA
            provider
          </li>
          <li>
            CA Integration: VNPT-CA API for OTP generation and signature
            verification
          </li>
          <li>
            Store signed consent document in secure document management system
          </li>
          <li>
            Audit trail: Log all approval/rejection actions with timestamp and
            user
          </li>
          <li>
            Permission: Only Director/Admin can approve/reject donor profiles
          </li>
          <li>
            Send email and SMS notification to donor after approval/rejection
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DonorProfile;
