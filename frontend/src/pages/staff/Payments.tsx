import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import { getSafePayments } from "../../lib/safe-mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "sonner";

export function Payments() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [transferDate, setTransferDate] = useState("");

  const filteredPayments = getSafePayments().filter((payment) => {
    return statusFilter === "all" || payment.status === statusFilter;
  });

  const handleMarkTransferred = () => {
    if (!transferDate) {
      toast.error("Vui lòng chọn ngày chuyển khoản");
      return;
    }

    toast.success(
      `Đã đánh dấu đã chuyển khoản cho ${selectedPayment.donorName}`,
      {
        description: receiptFile ? "Biên lai đã được tải lên" : "",
      }
    );

    setIsTransferModalOpen(false);
    setSelectedPayment(null);
    setReceiptFile(null);
    setTransferDate("");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "Chờ xử lý", icon: Clock },
      transferred: {
        variant: "default",
        label: "Đã chuyển",
        icon: CheckCircle,
      },
      failed: { variant: "destructive", label: "Thất bại", icon: XCircle },
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
      header: "Số tiền",
      render: (payment: any) => formatCurrency(payment.amount),
    },
    {
      key: "requestedAt",
      header: "Ngày yêu cầu",
    },
    {
      key: "transferredAt",
      header: "Ngày chuyển",
      render: (payment: any) => payment.transferredAt || "-",
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (payment: any) => getStatusBadge(payment.status),
    },
    {
      key: "actions",
      header: "Thao tác",
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
              Đánh dấu đã chuyển
            </Button>
          )}
          {payment.status === "transferred" && payment.receiptUrl && (
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Xem biên lai
            </Button>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = getSafePayments().filter(
    (p) => p.status === "pending"
  ).length;
  const transferredCount = getSafePayments().filter(
    (p) => p.status === "transferred"
  ).length;
  const totalPending = getSafePayments()
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Hỗ trợ thanh toán</h1>
        <p className="text-muted-foreground">
          Quản lý thanh toán cho các donor
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Chờ xử lý</p>
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
                <p className="text-muted-foreground">Đã chuyển</p>
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
                <p className="text-muted-foreground">Tổng chờ thanh toán</p>
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
          Tất cả
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          onClick={() => setStatusFilter("pending")}
        >
          Chờ xử lý
        </Button>
        <Button
          variant={statusFilter === "transferred" ? "default" : "outline"}
          onClick={() => setStatusFilter("transferred")}
        >
          Đã chuyển
        </Button>
        <Button
          variant={statusFilter === "failed" ? "default" : "outline"}
          onClick={() => setStatusFilter("failed")}
        >
          Thất bại
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={filteredPayments}
        columns={columns}
        emptyMessage="Không có yêu cầu thanh toán nào"
      />

      {/* Mark as Transferred Modal */}
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận chuyển khoản</DialogTitle>
            <DialogDescription>
              Đánh dấu đã chuyển khoản cho donor
              {selectedPayment && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p>Donor: {selectedPayment.donorName}</p>
                  <p>Số tiền: {formatCurrency(selectedPayment.amount)}</p>
                  <p>Payment ID: {selectedPayment.id}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="transferDate">Ngày chuyển khoản *</Label>
              <Input
                id="transferDate"
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receipt">Tải lên biên lai (tùy chọn)</Label>
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              />
              {receiptFile && (
                <p className="text-sm text-muted-foreground">
                  Đã chọn: {receiptFile.name}
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
              Hủy
            </Button>
            <Button onClick={handleMarkTransferred}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
