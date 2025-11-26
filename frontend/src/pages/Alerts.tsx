import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle, Mail, UserPlus, AlertTriangle } from "lucide-react";
import { mockAlerts } from "../lib/mock-data";
import { toast } from "sonner";

export function Alerts() {
  const [statusFilter, setStatusFilter] = useState("active");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesStatus =
      statusFilter === "all" || alert.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || alert.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      high: { variant: "destructive", label: "Cao" },
      medium: { variant: "secondary", label: "Trung bình" },
      low: { variant: "outline", label: "Thấp" },
    };
    const config = variants[priority] || {
      variant: "secondary",
      label: priority,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      test_expiring: "Xét nghiệm hết hạn",
      screening_incomplete: "Sàng lọc chưa xong",
      unsigned_consent: "Chưa ký cam kết",
      payment_pending: "Chờ thanh toán",
    };
    return labels[type] || type;
  };

  const handleMarkResolved = (alertId: string) => {
    toast.success("Đã đánh dấu cảnh báo đã xử lý");
  };

  const handleSendReminder = (alert: any) => {
    toast.success(`Đã gửi nhắc nhở đến ${alert.donorName}`);
  };

  const columns = [
    {
      key: "priority",
      header: "Mức độ",
      render: (alert: any) => getPriorityBadge(alert.priority),
    },
    {
      key: "type",
      header: "Loại",
      render: (alert: any) => getTypeLabel(alert.type),
    },
    {
      key: "donor",
      header: "Donor",
      render: (alert: any) => (
        <div>
          <p>{alert.donorName}</p>
          <p className="text-muted-foreground">{alert.donorId}</p>
        </div>
      ),
    },
    {
      key: "message",
      header: "Thông báo",
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (alert: any) => (
        <div className="flex gap-2">
          {alert.status === "active" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkResolved(alert.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Đã xử lý
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendReminder(alert)}
              >
                <Mail className="h-4 w-4 mr-1" />
                Nhắc nhở
              </Button>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-1" />
                Giao việc
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const activeCount = mockAlerts.filter((a) => a.status === "active").length;
  const highPriorityCount = mockAlerts.filter(
    (a) => a.status === "active" && a.priority === "high"
  ).length;
  const resolvedCount = mockAlerts.filter(
    (a) => a.status === "resolved"
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Quản lý cảnh báo</h1>
        <p className="text-muted-foreground">
          Theo dõi và xử lý các cảnh báo hệ thống
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Cảnh báo đang hoạt động</p>
                <h2>{activeCount}</h2>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Ưu tiên cao</p>
                <h2>{highPriorityCount}</h2>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Đã xử lý</p>
                <h2>{resolvedCount}</h2>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
          >
            Đang hoạt động
          </Button>
          <Button
            variant={statusFilter === "resolved" ? "default" : "outline"}
            onClick={() => setStatusFilter("resolved")}
          >
            Đã xử lý
          </Button>
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={priorityFilter === "high" ? "destructive" : "outline"}
            onClick={() =>
              setPriorityFilter(priorityFilter === "high" ? "all" : "high")
            }
          >
            Cao
          </Button>
          <Button
            variant={priorityFilter === "medium" ? "default" : "outline"}
            onClick={() =>
              setPriorityFilter(priorityFilter === "medium" ? "all" : "medium")
            }
          >
            Trung bình
          </Button>
          <Button
            variant={priorityFilter === "low" ? "secondary" : "outline"}
            onClick={() =>
              setPriorityFilter(priorityFilter === "low" ? "all" : "low")
            }
          >
            Thấp
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredAlerts}
        columns={columns}
        emptyMessage="Không có cảnh báo nào"
      />

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>
            GET /api/admin/alerts?status=&priority=&type= - List all alerts with
            filters
          </li>
          <li>
            PATCH /api/admin/alerts/{"{id}"}/resolve - Mark alert as resolved
          </li>
          <li>
            POST /api/admin/alerts/{"{id}"}/send-reminder - Send SMS/email
            reminder to donor
          </li>
          <li>
            POST /api/admin/alerts/{"{id}"}/assign - Assign alert to staff
            member
          </li>
          <li>
            Automated alert creation: Check daily for expiring tests, incomplete
            screenings
          </li>
          <li>
            Real-time notifications: WebSocket for new high-priority alerts
          </li>
          <li>
            Alert rules configurable by admin (thresholds, priority levels)
          </li>
          <li>Email digest: Daily summary of active alerts sent to Director</li>
        </ul>
      </div>
    </div>
  );
}

export default Alerts;
