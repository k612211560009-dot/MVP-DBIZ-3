import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import { mockPayments } from "../lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";

export function Payments() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [transferDate, setTransferDate] = useState("");

  const filteredPayments = mockPayments.filter((payment) => {
    return statusFilter === "all" || payment.status === statusFilter;
  });

  const handleMarkTransferred = () => {
    if (!transferDate) {
      toast.error("Please select transfer date");
      return;
    }

    toast.success(`Marked as transferred for ${selectedPayment.donorName}`, {
      description: receiptFile ? "Receipt has been uploaded" : "",
    });

    setIsTransferModalOpen(false);
    setSelectedPayment(null);
    setReceiptFile(null);
    setTransferDate("");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "Pending", icon: Clock },
      transferred: {
        variant: "default",
        label: "Transferred",
        icon: CheckCircle,
      },
      failed: { variant: "destructive", label: "Failed", icon: XCircle },
    };
    const config = variants[status] || {
      variant: "secondary",
      label: status,
      icon: Clock,
    };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns = [
    {
      key: "id",
      header: "Payment ID",
    },
    {
      key: "donor",
      header: "Donor",
      render: (payment: any) => (
        <div>
          <p>{payment.donorName}</p>
          <p className="text-muted-foreground">{payment.donorId}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (payment: any) => formatCurrency(payment.amount),
    },
    {
      key: "requestedAt",
      header: "Request Date",
    },
    {
      key: "transferredAt",
      header: "Transfer Date",
      render: (payment: any) => payment.transferredAt || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (payment: any) => getStatusBadge(payment.status),
    },
    {
      key: "actions",
      header: "Actions",
      render: (payment: any) => (
        <div className="flex gap-2">
          {payment.status === "pending" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setSelectedPayment(payment);
                setIsTransferModalOpen(true);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark as Transferred
            </Button>
          )}
          {payment.status === "transferred" && payment.receiptUrl && (
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              View Receipt
            </Button>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = mockPayments.filter(
    (p) => p.status === "pending"
  ).length;
  const transferredCount = mockPayments.filter(
    (p) => p.status === "transferred"
  ).length;
  const totalPending = mockPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Payment Support</h1>
        <p className="text-muted-foreground">Manage payments for donors</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Pending</p>
                <h2>{pendingCount}</h2>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Transferred</p>
                <h2>{transferredCount}</h2>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Pending Payment</p>
                <h2>{formatCurrency(totalPending)}</h2>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "transferred" ? "default" : "outline"}
          onClick={() => setStatusFilter("transferred")}
        >
          Transferred
        </Button>
        <Button
          variant={statusFilter === "failed" ? "default" : "outline"}
          onClick={() => setStatusFilter("failed")}
        >
          Failed
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={filteredPayments}
        columns={columns}
        emptyMessage="No payment requests"
      />

      {/* Mark as Transferred Modal */}
      {isTransferModalOpen && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Transfer</DialogTitle>
              <DialogDescription>
                Mark as transferred for donor
                {selectedPayment && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p>Donor: {selectedPayment.donorName}</p>
                    <p>Amount: {formatCurrency(selectedPayment.amount)}</p>
                    <p>Payment ID: {selectedPayment.id}</p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="transferDate">Transfer Date *</Label>
                <Input
                  id="transferDate"
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt">Upload Receipt (optional)</Label>
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                />
                {receiptFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {receiptFile.name}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsTransferModalOpen(false);
                  setSelectedPayment(null);
                  setReceiptFile(null);
                  setTransferDate("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleMarkTransferred}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>
            GET /api/admin/payments?status=&page=&per_page= - List payments
          </li>
          <li>
            POST /api/admin/payments/{"{id}"}/mark-transferred - Mark as
            transferred with date and receipt
          </li>
          <li>
            File upload: Store receipt in secure file storage (S3, Azure Blob,
            etc.)
          </li>
          <li>
            Send email/SMS notification to donor when payment is marked as
            transferred
          </li>
          <li>Payment history: Show all transfers for a specific donor</li>
          <li>
            Bulk operations: Mark multiple payments as transferred at once
          </li>
          <li>
            Integration: Auto-generate payment requests based on accumulated
            points
          </li>
          <li>
            Permission: Only Director/Admin/Finance staff can mark payments as
            transferred
          </li>
          <li>Audit trail: Log all payment status changes</li>
        </ul>
      </div>
    </div>
  );
}

export default Payments;
